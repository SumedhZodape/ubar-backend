import mongoose from "mongoose";
import geoLocationSchema from "./geoLocation.model.js";


const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    captainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Captain'
    },
    startLocation: {
        type:geoLocationSchema,
        required: true
    },
    endLocation: {
        type: geoLocationSchema,
        required: true
    },
    otp: {type: String},
    distance: {type: Number, required: true},
    price: {type: Number, required: true},
    status: {
        type: String,
        enum:['Requested', 'Accepted', 'Ride Started', 'Completed', 'Cancelled'],
        default: 'Requested'
    },
    vehicleType: {
        type: String,
        enum: ['Auto', 'TwoWheeler', 'Car'],
        required: true
    },
},{timestamps: true})


export default mongoose.model('Ride', rideSchema)