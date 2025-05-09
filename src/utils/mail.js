import nodemailer from 'nodemailer';
import { config } from '../config/env.js';


let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"sumedhzodape8003@gmail.com",
        pass: config.apiKey
    }
})

export default async function sendMail({to, subject, text}){

    const mailOption = {
        from:"sumedhzodape8003@gmail.com",
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