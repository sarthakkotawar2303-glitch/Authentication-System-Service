const express = require('express');
const { loginUser, registerUser, changePassword, deleteImageController } = require('../controller/authController');
const authMiddleware = require('../middleware/auth-middleware');
const isAdmin = require('../middleware/admin-middleware');
const router = express.Router()

//all routes are related to authentication and authoriaztion
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/change-password", authMiddleware, changePassword)


module.exports = router
