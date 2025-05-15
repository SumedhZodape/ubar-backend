import nodemailer from 'nodemailer';
import { config } from '../config/env.js';


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user:"sumedhzodape8003@gmail.com",
        pass: ""
    }
})

export default async function sendMail({to, subject, text}){

    const mailOption = {
        from:'"Ubar App" <sumedhzodape8003@gmail.com>',
        to:to,
        subject:subject,
        text:text
    }


    await transporter.sendMail(mailOption, (err, info)=>{
        if(err){
            console.log(err)
        }else{
            console.log(info)
        }
    })

}