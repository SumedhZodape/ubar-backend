import { Captain } from '../models/index.js';
import sendMail from '../utils/mail.js'

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

     console.log(req.body)

     const profilePic = req.files?.profilePic[0].filename;
     const vehiclePic = req.files?.vehiclePic[0].filename;

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

}