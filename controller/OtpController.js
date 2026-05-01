const crypto = require('crypto');
const { User } = require('../model/model');
const bcrypt = require("bcryptjs");
const sendSms = require('../utils/sendSms');
const sendEmail = require('../utils/sendEmail');


const optGenerator = () => {
    const otp = crypto.randomInt(100000, 999999)
    console.log(otp);
    return otp.toString();
}

const generateResetToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex")
}


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    maxAge: 10 * 60 * 1000
}

const forgotPassword = async (req, res) => {
    try {
        const { identifier, type } = req.body;

        if (!identifier || !type) {
            return res.status(400).json({
                msg: "All field are required"
            })
        }

        if (!['email', 'mobile'].includes(type)) {
            return res.status(400).json({ msg: "Invalid type" })
        }

        const query = type === "email" ? { email: identifier } : { mobileNo: identifier }
        const user = await User.findOne(query);

        if (!user) {
            return res.status(200).json({ msg: "If account exist,OTP has been sent" })
        }

        const otp = optGenerator();
        const hashedOtp = await bcrypt.hash(otp, 10)

        const resetToken = generateResetToken();
        const hashedToken = hashToken(resetToken);

        console.log(resetToken)

        user.resetOtp = hashedOtp
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); //5 min
        user.otpVerified = false;
        user.resetToken = hashedToken;
        user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save()

        if(type==="email"){
            await sendEmail(identifier,otp)
        }else{
            await sendSms(identifier,otp)
        }

        res.cookie('resetToken', resetToken, cookieOptions)

        return res.status(200).json({ msg: "OTP sent successfully" })

    } catch (error) {
        console.error("forgotPassword error:", error)
        return res.status(500).json({
            msg: "Internal server error"
        })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body

        const resetToken = req.cookies.resetToken

        if (!resetToken || !otp) {
            return res.status(400).json({ msg: "All fields are required" })
        }

        const hashedToken = hashToken(resetToken)

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        })
        if (!user || !user.resetOtp) {
            return res.status(400).json({ msg: "Invalid or expired token" })
        }

        if (!user.otpExpiry || user.otpExpiry < Date.now()) {
            return res.status(400).json({ msg: "OTP has expired" })
        }

        const isMatch = await bcrypt.compare(otp, user.resetOtp)

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid OTP" })
        }

        user.otpVerified = true
        user.resetOtp = null;
        user.otpExpiry = null;
        await user.save()

        return res.status(200).json({ msg: "OTP verified successfully" });

    } catch (error) {
        console.error("verifyOtp error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body

        const resetToken = req.cookies.resetToken

        if (!resetToken || !newPassword) {
            return res.status(400).json({ msg: "All fields are required" })
        }
        const hashedToken = hashToken(resetToken);

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ msg: "Invalid request" })
        }
        if (!user.otpVerified) {
            return res.status(400).json({ msg: "OTP not verified" })
        }
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({ msg: "New password must be different" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = null;
        user.otpExpiry = null;
        user.otpVerified = false;
        user.resetToken = null,
            user.resetTokenExpiry = null
        await user.save();

        res.clearCookie("resetToken")
        return res.status(200).json({ msg: "Password reset successfully" });
    } catch (error) {
        console.error("resetPassword error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

module.exports = { forgotPassword, verifyOtp, resetPassword }