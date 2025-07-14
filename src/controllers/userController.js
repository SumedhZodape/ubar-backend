import { Captain, User, Ride } from '../models/index.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../config/env.js';
import { calculateDistance } from '../utils/calculateDistance.js';
import sendMail from '../utils/mail.js';
import  { io, connectedUser } from '../app.js'

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
            token: token,
            userID: user._id
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
        if(!startLocation || !endLocation ||
            !startLocation.type === 'Point' ||
            !endLocation.type === 'Point' ||
            !Array.isArray(startLocation.coordinates) ||
            typeof startLocation.coordinates[0] !== 'number' ||
            typeof startLocation.coordinates[1] !== 'number' || 
            !Array.isArray(endLocation.coordinates) ||
            typeof endLocation.coordinates[0] !== 'number' ||
            typeof endLocation.coordinates[1] !== 'number'

        ){
            return res.send({success: false, message:"Invalid Location!"})
        }
     }catch(err){
        return res.send({success: false, message:"Invalid Location!"})
     }

    try{

        const captains = await Captain.find({
            location:{
                $near: {
                    $geometry: startLocation,
                    $maxDistance: 4000
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

        const distance = calculateDistance(
            startLocation.coordinates,
            endLocation.coordinates
        );


        const price = distance * (
            vehicleType === 'Car'? 15: vehicleType === 'Auto' ? 10 : 5
        )

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        console.log(captains)

        

        const ride = new Ride({
            userId,
            startLocation,
            endLocation,
            otp,
            distance,
            price: parseFloat(price.toFixed(2)),
            vehicleType
        })

        await ride.save()

        let rideRequestNotificaiton = 0; 

        captains.forEach((captain)=>{
            const captainId = captain._id.toString();
            const socketId = connectedUser.get(captainId);
            if(socketId){
                io.to(socketId).emit('sendNotification', {
                    from: userId,
                    ride: ride,
                    message:"New Ride Request"
                })

                rideRequestNotificaiton ++;
            }
        })

        console.log(rideRequestNotificaiton)

        await sendMail({
            to: captains[0].email,
            subject:"New Ride Request",
            text:`Hi ${captains[0].name}, a new ride request has been 
            has been created. Please check your dashboard to accept the ride. Ride ID: ${ride._id}`
        })

        res.send({success: true, meesage:"Ride request created successfully"})
    }catch(err){
        res.send({success: false, message:"Server Error"})
    }


}


export const rejectRide = async(req, res) =>{
    const rideId = req.params.id;

    try{

        const ride = await Ride.findById(rideId);

        ride.status = 'Cancelled';
        await ride.save();
        res.send({success: true, message:"Ride Cancelled"})

    }catch(err){
        res.send({success: false, message: "Server Error!"})
    }
}

export const getRideInfo = async(req, res) =>{

    const userId = req.id;

    try {
        
        const ride = await Ride.find({userId});

        if(!ride){
            return res.send({success: false, message:"Ride not found."})
        }

        const currentRide = ride.find((ele)=>ele.status !== "Completed" || ele.status !=="Cancelled")

        console.log(currentRide)

        res.send({success: true, result: currentRide})

    } catch (error) {
        console.log(error)
        res.send({success: false, message:"Server Error!"})
    }
}