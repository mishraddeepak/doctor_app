const mongoose = require('mongoose')

const connectDb = async()=>{

    mongoose.connection.on('connected',()=>console.log("Database Connected"))

    await mongoose.connect(`${process.env.MONGODB_URL}/docs_database`)
}

module.exports = connectDb