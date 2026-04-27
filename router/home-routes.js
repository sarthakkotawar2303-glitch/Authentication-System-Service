const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth-middleware')

router.get('/welcome', authMiddleware, (req, res) => {
    const { username, userId, role } = req.userInfo
    return res.status(200).json({
        message: "welcome to home page",
        user: {
            _id: userId,
            username,
            role
        }
    })
})

module.exports = router;