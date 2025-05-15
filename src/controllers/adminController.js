import {Admin, Captain} from '../models/index.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import bcrypt from 'bcrypt';
import sendMail from '../utils/mail.js';


// admin registration controller

export const register = async(req, res) => {

    const { email, password } = req.body;

    if(!email || !password){
        return res.send({success:false, message: "All fields are required!"})
    }

    try{

        const admin = new Admin({
            email,
            password
        })

        await admin.save();

        res.send({
            success: true,
            message: "Admin Registered!"
        })

    }catch(err){
        res.send({
            success: false,
            message: "Server Error!"
        })
    }

}


// login 
export const login = async(req, res)=>{
    const { email, password } = req.body;

    if(!email || !password){
        return res.send({success: false, message: "All fields are required!"});
    }

    try{

        const admin = await Admin.findOne({email});

        if(!admin){
            return res.send({success: false, message: "Invalid Credential!"})
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if(!isMatch){
            return res.send({success: false, message: "Invalid Password!"})
        }

        const token = jwt.sign({id: admin._id}, config.secretKey, {expiresIn: '1h'});

        res.send({
            success: true,
            message: "Admin Logged in successfully",
            token: token
        })

    }catch(err){
        console.log(err)
        res.send({success: false, message: "Server Error!", err})
    }

}

export const getCaptains = async(req, res) =>{
    try {
        const captains = await Captain.find();
        res.send({success: true, result: captains})
    } catch (error) {
        res.send({success: false, message: "Server Error!"})
    }
}

// update captain status 
export const updateStatus = async(req, res)=>{
   const { captainId } = req.params;
   const { status } = req.body;

   if(!["Approved", "Rejected", "Blocked"].includes(status)){
    return res.send({success: false, message:"Invalid Status!"});
   }

   try {

    const captain = await Captain.findById(captainId);

    if(!captain){
        return res.send({success: false, message:"Captain not found."})
    }

    captain.status = status;
    await captain.save();

    await sendMail({
        to: captain.email,
        subject:`Captain Status Update: ${status}`,
        text: `Hi ${captain.name}, your status has been updated to ${status}.`
    })

    res.send({success: true, message: `Captain Status Update: ${status}`})
    
   } catch (error) {
    console.log(error)
    res.send({success: false, message: "Server Error"})
   }

}

