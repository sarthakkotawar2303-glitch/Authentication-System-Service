

const isAdmin=(req,res,next)=>{
    if(!req.userInfo.role=='admin'){
        return res.status(404).json({
          message:"you are not admin so you are not authorize to some pages"
        })
    }
    next()
}

module.exports=isAdmin