
const mongoose=require("mongoose");


const transactionSchema=new mongoose.Schema({
     fromAccount:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"account",
         required:[true,"Transaction must be associated with a from account"],
         index:true
     },
     toAccount:{
          type:mongoose.Schema.Types.ObjectId,
         ref:"account",
         required:[true,"Transaction must be associated with a to account"],
         index:true
     },
     status:{
         type:String,
         enum:{
             values:["PENDING","COMPLETED","FAILED","REVERSED"],
             message:"Status can be either PENDING,COMPLETED,REVERSE",


         },
         default:"PENDING"
     },
     amount:{
         type:Number,
         required:[true,"Amount is required for creating a transacttion"],
         min:[0,"Transaction amount can not be nagative"]
     },
     idempotencyKey:{
         type:String,
         required:[true,"Idempotency key is required or cratig a transation"],
             index:true,
             unqiue:true,

     }
         
     
},{timestamps:true});


const transactionalModel=mongoose.model("transacion",transactionSchema);
module.export=transactionalModel;