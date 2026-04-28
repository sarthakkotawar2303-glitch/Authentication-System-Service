const User = require("../model/model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cloudinary = require("../config/cloudinary");
const Image = require("../model/Image");

// Register controller
const registerUser = async (req, res) => {
    try {
        const { username, email, password,mobileNo, role } = req.body;

        // Check if user already exists
        const checkExistUser = await User.findOne({ $or: [{ mobileNo }, { email }] });
        if (checkExistUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email already exists, try again",
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            mobileNo,
            password: hashedPassword,
            role: role || "user",
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "New user registered successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// Login controller
const loginUser = async (req, res) => {
    try {
        const { mobileNo,email,password } = req.body;

        // Find user by email
        const user = await User.findOne({$or:[{mobileNo},{email}] });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }




        //token
        const accesToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15m'
        })

        // If login successful
        res.status(200).json({
            success: true,
            message: "Login successful",
            accesToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

const changePassword = async (req, res) => {
    try {

        //if user want to change their password then user should be login
        const userId = req.userInfo.userId;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found",
            });3
        }
        //taking old and new password from the user
        const { oldPassword, newPassword } = req.body;

        const isCorrectPassword = await bcrypt.compare(oldPassword, user.password)
        if (!isCorrectPassword) {
            return res.status(400).json({
                success: false,
                message: "incorrect password",
            });
        }

        //hashing the new password
        const salt = await bcrypt.genSalt(10)
        const newhashedPassword = await bcrypt.hash(newPassword, salt)

        //update userPassword
        user.password = newhashedPassword;

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Password is Changed",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error occurs during changing the password",
        });
    }
}

const deleteImageController = async (req, res) => {
    try {
        const getCurrentIdOfImageForDelete = req.params.id
        const userId = req.userInfo.userId

        const image = await Image.findById(getCurrentIdOfImageForDelete)
        if (!image) {
            return res.status(401).json({
                success: false,
                message: "image is not present"
            })
        }
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this image"
            })
        }

        //deleting the image from the cloudinary
        await cloudinary.uploader.destroy(image.publicId)

        //deleting the image from the mongoDb
        await Image.findByIdAndDelete(getCurrentIdOfImageForDelete)
        return res.status(200).json({
            success: true,
            message: "Image delete Successfully"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error occurs during changing the password",
        });
    }


}

module.exports = { registerUser, loginUser, changePassword, deleteImageController };
