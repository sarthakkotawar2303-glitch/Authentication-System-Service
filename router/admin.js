const express=require('express')
const authMiddleware = require('../middleware/auth-middleware')
const isAdmin = require('../middleware/admin-middleware')
const router=express.Router()


router.get('/admin-page',authMiddleware,isAdmin,(req,res)=>{
    res.json({
        message:"welcome to admin page"
    })
})

module.exports=router