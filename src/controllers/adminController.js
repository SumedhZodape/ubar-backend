import {Admin} from '../models/index.js';


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