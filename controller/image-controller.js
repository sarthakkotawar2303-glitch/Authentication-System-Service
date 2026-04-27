const { image } = require('../config/cloudinary');
const uploadTocloudinary = require('../helper/cloudinaryHelper');
const Image = require('../model/Image');
const fs = require('fs')

const uploadImageController = async (req, res) => {
    try {
        // check if file is missing in the req object
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image.'
            });
        }

        // upload to cloudinary
        const { url, publicId } = await uploadTocloudinary(req.file.path);

        // store image data in DB
        const newUploadImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        await newUploadImage.save();

        //delete the file from local storage
        fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            data: newUploadImage
        });

    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error while uploading the file',
            error: error.message
        });
    }
};

const fetchImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const skip = (page - 1) * limit

        const sortBy = req.query.sortBy || "createdAt"
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1
        const totalImages = await Image.countDocuments()
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {}
        sortObj[sortBy] = sortOrder

        const images = await Image.find({})
        if (images) {
            return res.status(200).json({
                success: true,
                message: 'fetched the images successfully',
                data: images
            })
        }


    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error while fetching the images',
            error: error.message
        });
    }

}
module.exports = { uploadImageController, fetchImages };
