
const mongoose=require("mongoose");



function connectTODB(){

    mongoose.connect(process.env.MONGO_URI).then(()=>{
         console.log("Server is Connected to DB");
    }).catch(err=>{
         console.error("Error :",err.message);
         process.exit(1);
    })
}


module.exports=connectTODB;