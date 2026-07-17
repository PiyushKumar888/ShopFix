import nodemailer from "nodemailer";
import {ApiError} from "./ApiError.js";





const sendmail = async (
    to,
    subject,
    text,
    html
)=>{
    const transporter = nodemailer.createTransport({

        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure: false,
        auth: {
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD,
        }
    })
    const mailOptions = {
        from:process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
    }

    try{
        const response =  await  transporter.sendMail(mailOptions)

    }catch(e){

        throw new ApiError("Email faild to send",200,e.message)
    }


}

export default sendmail;