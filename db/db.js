const mongoose = require("mongoose")
require('dotenv').config()


const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is connected")
    } catch (error) {
        console.error("failed to connect the database",error)

    }
}

module.exports=connectToDb;