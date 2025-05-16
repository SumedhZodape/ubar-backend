import { User } from '../models/index.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../config/env.js';

export const register = async(req, res)=>{
    const {
        name,
        dob,
        mobileNo,
        email,
        location,
        password
    } = req.body;

    if(!name || !dob || !mobileNo || !email || !location || !password){
        return res.send({success: false, message:"All fields are requred!"})
    }

    try {
        
        const findUser = await User.findOne({email});

        if(findUser){
            return res.send({success: false, message:"User already exist!"})
        }

        const user = new User({
            name,
            dob,
            mobileNo,
            email,
            location,
            password
        })

        await user.save();

        res.send({success: true, message:"User Registered."})

    } catch (error) {
        res.send({success: false, message: "Server Error"})
    }

}


export const login = async(req, res)=>{
    const { email, password } = req.body;

    if(!email || !password){
        return res.send({success: false, message:"All filed are required!"})
    }

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.send({success: false, message:"User not exist!"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.send({success: false, message: "Incorrect password!"})
        }

        const token = jwt.sign({id: user._id}, config.secretKey, {expiresIn: '1h'});

        res.send({
            success: true,
            message: "User Logged in successfully",
            token: token
        })

    }catch(err){
        res.send({success: false, message:"Server Error!"})
    }

   

}