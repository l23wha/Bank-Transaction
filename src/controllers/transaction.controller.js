
const transactionModel=require("../models/transaction.model");
const ledgerModel=require("../models/ledger.model");
const emailService=require("../services/email.services");
const accountModel=require("../models/account.model");
const mongoose=require("mongoose");

// 1. Validate request
//2   Validate idempotency key
//3 Check account status
//4 Derive sender balance from ledger
//5 Create transaction (pending)
//6 Create Debit ledger entry
//7 create credit ledger entry
//8 mark transaction completed
//9 Commit MongoDb session
//10 Send email notification

async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey}=req.body;

     if(!fromAccount || !toAccount || !amount || !idempotencyKey){
       return  res.status(400).json({message:"All fields are required"});
     }

     const fromUserAccount=await accountModel.findOne({_id:fromAccount});
     const toUserAccount=await accountModel.findOne({_id:toAccount});

     if(!fromUserAccount || toUserAccount){
         return res.status(400).json({message:"both accounts are required"});
     }


        // Validate idempotency key
        const isTransactionAlreadyExists=await transactionModel.findOne({idempotencyKey:idempotencyKey});
         if(isTransactionAlreadyExists){
             if(isTransactionAlreadyExists.status==="COMPLETED"){
                  
                return  res.status(200).json({message:"Transaction already processed",transaction:isTransactionAlreadyExists});

                  
             }
             if(isTransactionAlreadyExists.status==='PENDING'){
               return  res.status(200).json({message:"Transacton is still processing"});
             }

             if(isTransactionAlreadyExists.status==="FAILED"){
              return   res.status(500).json({message:"Transaction process is failed"});
             }
              if(isTransactionAlreadyExists.status==="REVERSED"){
                  return   res.status(500).json({message:"Transaction was reversed, please retry"});
              }
         }

         // Check account status

           if(fromUserAccount.status!=="ACTIVE" || toUserAccount!=="ACTIVE"){
             //means mere dono ke account active hone chaiye theek boss
              return res.status(400).json({message:"Both fromAccount and toAccount must be Active to process transaction"});
           }

           // Derive sender balance from ledger

           const balance=await fromUserAccount.getBalance();

               if(balance<amount){
                   return res.status(400).json({
                        message:`Insufficient balance. Current balance is ${currentBalance}. Request amount is ${amount}`
                    })
               }


               //Create transaction (Pending)

               const session=await mongoose.startSession();
                session.startTransaction();

                const transaction=await transactionModel.create({
                      fromAccount,
                      toAccount,
                      amount,
                      idempotencyKey,
                      status:"PENDING"
                },{session});

                 const debitLedgetEntry=await ledgerModel.create({
                      account:fromAccount,
                      amount:amount,
                      transaction:transaction._id,
                      type:"DEBIT"

                 },{session })

                const CreditLedgerEntry=await ledgerModel.create({
                      account:toAccount,
                      amount:amount,
                      transaction:transaction._id,
                       type:"CREDIT",

                      
                },{session})


                transaction.status="COMPLETE";
                await transaction.save({session});

                await session.commitTransaction();
                session.endSession();

                //Send email Nodification

                await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount);

                 return res.status(201).json({
                     message:"Transaction completed Successfully",
                     transaction
                 });


}

module.exports={
     createTransaction
}