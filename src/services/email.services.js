
const nodemailer=require("nodemailer");

const transpoter=nodemailer.createTransport({
     service:'gmail',
     auth:{
         type:'OAuth2',
         user:process.env.EMAIL_USER,
         clientId:process.env.CLIENT_ID,
         clientSecret:process.env.CLIENT_SECRET,
         refreshToken:process.env.REFRESH_TOKEN
     }
});


//verify the connection configuration

transpoter.verify((error,success)=>{
     if(error){
          console.error("Error connecting to email server:", error);
           
     }else{
         console.log('Email server is ready to send messages');
     }
});


//Function to send email

const sendMail=async (to,subject, text, html)=>{
     try{
         const info=await transpoter.sendMail({
                from:`"Backend ledger" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text,
                html,
         });

         console.log('Message sent: %s', info.messageId);
         console.log("preview url: %s", nodemailer.getTestMessageUrl(info));
     }catch(error){
         console.error('Error sending email:', error);
     }
}

async function sendRegistrationEmail(userEmail,name){
     const subject='Welcome to Backend Ledger';
      const text=`Hello ${name}, \n\nThank you for registering at Backend Ledger. We are excited to have you on board!\n\nBest regards,\nThe Backend Ledger team`;
      const html=`<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger, We're exicted to have you on board,</p>`

      await sendMail(userEmail,subject,text,html);
}

async function sendTransactionEmail(userEmail,name,amount,toAccount){
      
     const subject='Transaction Successful';
     const text=`Hello ${name},\n\nYour transaction of ${amount} to account ${toAccount} was successful. `
     const html=`<p>Hello ${name}, </p> <p>Your transaction`

     await sendMail(userEmail,subject,text,html);
}  


async function sendTransactionFailureEmail(userEmail,name,amount,toAccount){
           const subject='Transaction failed';
     const text=`Hello ${name},\n\nYour transaction of ${amount} to account ${toAccount} was failed. `
     const html=`<p>Hello ${name}, </p> <p>Your transaction failed`

     await sendMail(userEmail,subject,text,html);
}

module.exports={
     sendRegistrationEmail
}