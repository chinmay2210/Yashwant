import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()




// -----------------Mail function---------------------

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
})


export const sendOTPMail = (email, otp, subject) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: `Your OTP for registration is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};



export const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

