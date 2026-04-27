require("dotenv").config()
const express = require("express")
const connectToDb = require('./db/db')
const authroutes = require("./router/router")
const homeroutes = require('./router/home-routes')
const adminroutes = require('./router/admin')
const uploadImageRoutes = require('./router/image-router')


const app = express();
const port = process.env.PORT || 3000;

connectToDb()

//midleware
app.use(express.json())


app.use('/api/auth', authroutes)
app.use('/api/home', homeroutes)
app.use('/api/admin', adminroutes)
app.use('/api/image', uploadImageRoutes)



app.listen(port, () => {
    console.log(`Server is started at the port No ${port}`)
})  