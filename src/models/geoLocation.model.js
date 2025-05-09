import mongoose from "mongoose";

const geoLocationSchema = new mongoose.Schema({
    type : {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
})

export default geoLocationSchema;