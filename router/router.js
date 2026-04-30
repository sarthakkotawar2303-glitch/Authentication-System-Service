const express = require('express');
const rateLimit=require('express-rate-limit')
const { loginUser, registerUser, changePassword, deleteImageController } = require('../controller/authController');
const authMiddleware = require('../middleware/auth-middleware');
const isAdmin = require('../middleware/admin-middleware');
const { forgotPassword, verifyOtp, resetPassword } = require('../controller/OtpController');

const router = express.Router()

const otpLimiter=rateLimit({
windowMs:15*60*1000,
max:5,
message:{msg:"Too many requests, please try again later"}
})

//all routes are related to authentication and authoriaztion
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/change-password", authMiddleware, changePassword)


router.post("/forgot-password",otpLimiter,forgotPassword)
router.post("/verify-otp",otpLimiter,verifyOtp)
router.post("/reset-password",resetPassword)

module.exports = router
