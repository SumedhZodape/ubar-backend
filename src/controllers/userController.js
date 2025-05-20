import { Captain, User } from '../models/index.js'
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


export const bookCab = async(req, res)=>{
    
    const userId = req.id;
    const {vehicleType, startLocation, endLocation} = req.body;

    if(!vehicleType || !startLocation || !endLocation){
        return res.send({success: false, message:"All fileds are required!"})
    }

    if(!['Car', 'TwoWheeler', 'Auto'].includes(vehicleType)){
        return res.send({success:false, message:"Invalid vehicle type!"})
    }


    try{

        const captains = await Captain.find({
            location:{
                $near: {
                    $geometry: startLocation,
                    $maxDistace: 4000
                }
            },
            vehicleType,
            status: 'Approved',
            isOnline: true
        }).limit(5);

        if(!captains.length){
            return res.send({success: false, message: `No ${vehicleType} 
                captins available within 4km.`})
        }

        const distance = 5;

        const price = distance * (
            vehicleType === 'Car'? 15: vehicleType === 'Auto' ? 10 : 5
        )

        console.log(price)

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(otp)

        res.send({success: true, meesage:"Test"})
    }catch(err){
        console.log(err)
        res.send({success: false, message:"Server Error"})
    }


}