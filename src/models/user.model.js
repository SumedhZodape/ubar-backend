import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import geoLocationSchema from "./geoLocation.model.js";


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    dob:{type:Date, required: true},
    mobileNo: {type: String, required: true},
    email:{type: String, required: true, unique: true},
    location: {
        type: geoLocationSchema,
        required: true
    },
    password: {type: String, required: true}
}, {timestamps: true})


userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})


userSchema.method.compairePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

export default mongoose.model('User', userSchema);