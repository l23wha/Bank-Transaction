
const express=require('express');
const authMiddleware=require("../middleware/auth.middleware")
const accountController=require("../controllers/account.controller");

const router=express.Router();


// Post-> /api/accounts
// create a new account ,protected route

router.post("/user",authMiddleware.authMiddleware,accountController.createAccountController);


module.exports=router;