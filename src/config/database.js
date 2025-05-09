import { config } from './env.js';
import mongoose from 'mongoose';


export const connectDB = async() =>{
    try {
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("DB Connected!")
    } catch (error) {
        console.log("DB Connection faild!")
    }
}