const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (v) => /^[0-9]{10}$/.test(v),
            message: "Mobile number must be exactly 10 digit"
        }
    },
    password: {
        type: String,
        required: true
    },
    resetOtp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    resetToken:{
        type:String,
        default:null
    },
    resetTokenExpiry:{
        type:Date,
        default:null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)
module.exports = { User }