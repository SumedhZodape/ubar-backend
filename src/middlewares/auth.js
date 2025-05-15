import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { Admin } from '../models/index.js';


export const adminAuth = async(req, res, next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    
    if(!token){
        return res.send({success: false, message:"No token provided!"})
    }

    try{

        const decode = jwt.verify(token, config.secretKey);
        
        const admin = await Admin.findById(decode.id);

        if(!admin){
            return res.send({success: false, message: "Unauthorized!"})
        }

        req.id = decode.id;
        next()

    }catch(err){
        console.log(err)
        return res.send({success: false, message: "Invalid Token!"})
    }

}
