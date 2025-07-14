import { Captain, Ride } from '../models/index.js';
import sendMail from '../utils/mail.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/env.js';
import  { io, connectedUser } from '../app.js'

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
     let parsedLocation;

     try{
        parsedLocation = typeof location === 'string'? JSON.parse(location) : location;
        if(!parsedLocation || 
            !parsedLocation.type === 'Point' ||
            !Array.isArray(parsedLocation.coordinates) ||
            typeof parsedLocation.coordinates[0] !== 'number' ||
            typeof parsedLocation.coordinates[1] !== 'number'
        ){
            return res.send({success: false, message:"Invalid Location!"})
        }
     }catch(err){
        return res.send({success: false, message:"Invalid Location!"})
     }

   try{
      const captain = new Captain({
         name,
         email,
         mobileno,
         dob,
         location : parsedLocation,
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
   
           captain.isOnline = true,
           await captain.save()

           res.send({
               success: true,
               message: "Captain Logged in successfully",
               token: token, 
               userID: captain._id
           })
   
       }catch(err){
           console.log(err)
           res.send({success: false, message: "Server Error!", err})
       }

}

export const getRideInfo = async(req, res) =>{

    const id = req.params.id;

    try {
        
        const ride = await Ride.findById(id);

        if(!ride){
            return res.send({success: false, message:"Ride not found."})
        }

        res.send({success: true, result: ride})

    } catch (error) {
        res.send({success: false, message:"Server Error!"})
    }
}

export const approveRequest = async(req, res) =>{
    const id = req.params.id;

    try{

        const ride = await Ride.findById(id);

        if(!ride){
            return res.send({success: false, message:"Ride not found."})
        }

        if(ride.status != 'Requested'){
            return res.send({success: false, message:"Request is accepted by another captain."})
        }

        ride.status = 'Accepted';
        ride.captainId = req.id;
        await ride.save();

       res.send({success: true, message:"Ride accepted!"})

    }catch(err){
        res.send({success: false, message:"Server Error!"})
    }
}

export const otpVerification = async(req, res) =>{
    const id = req.params.id;
    const { otp } = req.body;

    try{

        const ride = await Ride.findById(id);

        if(!ride){
            return res.send({success: false, message:"Ride not found."})
        }

        if(ride.status === 'Arrived'){
            if(ride.otp === otp){
                ride.status = 'Ride Started';
                await ride.save();
                res.send({success: true, message:"Ride Started."})
            }else{
                return res.send({success: false, message:"Invalid Otp"})
            }

        }else{
            return res.send({success: false, message:"Request should accepted."})
        }

        

    }catch(err){
        res.send({success: false, message:"Server Error!"})
    }
}

export const endRideorRejectRide = async(req, res) =>{
    const id = req.params.id;
    const {status} = req.body;

    try{

        const ride = await Ride.findById(id);

        if(!ride){
            return res.send({success: false, message:"Ride not found."})
        }

        ride.status = status;
        ride.captainId = req.id;
        await ride.save();

       res.send({success: true, message: status === 'Completed' ? 'Ride successfully completed' : 'Ride rejected'})

    }catch(err){
        res.send({success: false, message:"Server Error!"})
    }
}

export const getAcceptedRide = async(req, res) =>{

    const status = req.params.status;
    const captainId = req.id;

    try {
        const ride = await Ride.find({$and:[{captainId},{status: {$ne: "Requested"}}, {status: {$ne: "Cancelled"}}, {status: {$ne: "Completed"}}]}).populate('userId');
        console.log(ride)

        res.send({success: true, result: ride})

    } catch (error) {
        res.send({success: false, message:"Server Error!"})
    }
}

export const updateRideStatus = async(req, res)=>{
    const { id } = req.params;
    const status = req.body.status;

    try {
        const ride = await Ride.findById(id);
        if(!ride){
            return res.send({success: false, message:"Ride not found."})
        }

        console.log(ride.userId)
        const userId = ride.userId.toString();

        console.log(userId)
        const socketId = connectedUser.get(userId);
         if(socketId){
            io.to(socketId).emit('acceptNotification', {
                from: req.id,
                ride: ride,
                message:"Ride Accepted"
            })

        }

        ride.status = status;
        await ride.save()
        res.send({success: true, message: `${status} updated`, status: ride.status})
    } catch (error) {
         res.send({success: false, message:"Server Error!"})
    }
}