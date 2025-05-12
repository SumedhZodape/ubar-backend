import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const AdminSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})


AdminSchema.pre('save', async function(next){
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password, 10)
        }
        next()
})


 AdminSchema.method.compairePassword = async function(password){
        return bcrypt.compare(password, this.password)
}


export default mongoose.model('Admin', AdminSchema);