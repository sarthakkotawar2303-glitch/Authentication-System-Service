const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const isAdmin = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/upload-middleware')
const { uploadImageController, fetchImages } = require('../controller/image-controller')


const router = express.Router()

//upload the file
router.post('/upload', authMiddleware, isAdmin, uploadMiddleware.single('image'), uploadImageController)

//get all images
router.get('/get',fetchImages)
module.exports = router