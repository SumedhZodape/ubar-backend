import { Captain } from '../models/index.js';
import sendMail from '../utils/mail.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/env.js';

// register
export const registerCaptain = async (req, res) =>{

    const { 
        name,
        email,
        password,
        mobileno,
        dob,
        location,
        vehicleType,
        drivingLicenceNo,
        address,
        vehicleNo
     } = req.body;

     const findCaptain = await Captain.findOne({email:email })

     if(findCaptain){
      return res.send({success: false, message: "User already exist!"})
     }

     const profilePic = req.files?.profilePic[0].filename;
     const vehiclePic = req.files?.vehiclePic[0].filename;

   try{
      const captain = new Captain({
         name,
         email,
         mobileno,
         dob,
         location,
         address,
         profilePic,
         vehicleType,
         vehiclePic,
         vehicleNo,
         drivingLicenceNo,
         password
      })
      await captain.save();
      await sendMail({
         to: email,
         subject:"Captain Registraion",
         text: `Hi ${name}, your captain registraion is pending approval.`
      })

      res.send({
         success: true,
         message: "Captain registed successfully."
      })
   }catch(err){
      res.send({
         success: false,
         message: "Sever Error!"
      })
   }

}


export const login = async(req, res)=>{

   const { email, password } = req.body;
   
       if(!email || !password){
           return res.send({success: false, message: "All fields are required!"});
       }
   
       try{
   
           const captain = await Captain.findOne({email});
   
           if(!captain){
               return res.send({success: false, message: "Invalid Credential!"})
           }

           if(captain.status !== "Approved"){
               return res.send({success: false, message:"Request is not yet approved!, contact to your admin"})
           }
   
           const isMatch = await bcrypt.compare(password, captain.password);
   
           if(!isMatch){
               return res.send({success: false, message: "Invalid Password!"})
           }
   
           const token = jwt.sign({id: captain._id}, config.secretKey, {expiresIn: '1h'});
   
           res.send({
               success: true,
               message: "Captain Logged in successfully",
               token: token
           })
   
       }catch(err){
           console.log(err)
           res.send({success: false, message: "Server Error!", err})
       }

}