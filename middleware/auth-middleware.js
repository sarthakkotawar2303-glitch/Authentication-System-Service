const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader)

    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            success: "false",
            message: "acces denied,no token provided.plzz login to continue"
        })
    }

    //decode the token 
    try {
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(decodeToken)
        req.userInfo=decodeToken
        next()

    } catch (error) {

        return res.status(501).json({
            success: "false",
            message: "acces denied,no token provided.plzz login to continue"
        })

    }

}

module.exports = authMiddleware