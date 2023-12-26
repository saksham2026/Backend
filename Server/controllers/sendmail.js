import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import nodemailer from "nodemailer";


const sendMail = asyncHandler( async (req, res, next)=>{
    const { name, username, message, subject, password} = req.body;
    console.log(name, username, message, subject, password);
    const user_id = req._id ;
    console.log(user_id);
    const user = await User.findById(user_id);
    const email = user.email;
    console.log(email);
    const to = await User.find({ username });
    const toEmail = to.email;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: email,
            pass: password,
        }
    });

    const mailOptions = {
        from: email,
        to: toEmail, 
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send('Email sent successfully');
        }
      });
});

export { sendMail };