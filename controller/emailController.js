const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");



const sendEmail = asyncHandler(async (data, req, res) => {
   
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        }
      });
      
      const info = await transporter.sendMail({
        from: '"hey 👻" <aligowi358@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      });
      
      console.log("message sent: %s",info.messageId);


      console.log("preview URL: %s",nodemailer.getTestMessageUrl(info));
    
});






module.exports = sendEmail;

