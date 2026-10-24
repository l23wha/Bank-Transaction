
const transactionModel=require("../models/transaction.model");
const ledgerModel=require("../models/ledger.model");
const emailService=require("../services/email.services");
const accountModel=require("../models/account.model");

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

}