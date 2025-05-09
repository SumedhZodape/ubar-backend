    import mongoose from "mongoose";
    import bcrypt from 'bcrypt';
    import geoLocationSchema from "./geoLocation.model.js";


    const captainSchema = new mongoose.Schema({
        name: { type:String, required: true },
        email: {type: String, required: true, unique: true},
        mobileno: {type: String, required: true, unique: true},
        dob: {type: Date, required: true},
        location:{
            type: geoLocationSchema,
            required: true
        }, 
        address: { type: String, required: true},
        profilePic: {type: String},
        vehicleType: {
            type: String,
            enum: ['Auto', 'TwoWheeler', 'Car'],
            required: true
        },
        vehiclePic: {type: String},
        vehicleNo: {type: String, required: true, unique: true},
        drivingLicenceNo: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Blocked'],
            default: 'Pending'
        },
        isOnline: { type: Boolean, default: false }
    }, {timestamps: true})


    captainSchema.pre('save', async function(next){
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password, 10)
        }
        next()
    })

    captainSchema.method.compairePassword = async function(password){
        return bcrypt.compare(password, this.password)
    }

    export default mongoose.model('Captain', captainSchema);

