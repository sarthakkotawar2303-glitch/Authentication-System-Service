const cloudinary = require('../config/cloudinary')

const uploadTocloudinary = async (filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath)
        return {
            url:result.secure_url,
            publicId:result.public_id
        }
    } catch (error) {
        console.log("Error while uploading the file")
        throw new Error("Error while uploading the file")
    }
}

module.exports=uploadTocloudinary;