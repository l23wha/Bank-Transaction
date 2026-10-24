const express=require('express');

const cookieParse=require("cookie-parser");

const app=express();
app.use(express.json());
app.use(cookieParse());

// Routes required
const authRouter=require("./routes/auth.routes");
const accountRouter=require("./routes/account.route");
const transactionRouts=require("./routes/transaction.route");


//use routes
app.use("/api/auth",authRouter);
app.use("/api/accounts",accountRouter);

module.exports=app;