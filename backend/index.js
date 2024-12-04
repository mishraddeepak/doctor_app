const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDb = require('./config/mongodb')
// const connectCloudinary=require('./config/cloudinary')

const adminRouter = require('./routes/adminRoute')
const userRouter = require('./routes/userRoute')


const app =express()
const port = process.env.PORT||4000
connectDb()
// connectCloudinary()
// middleware
app.use(cors())
app.use(express.json())



//api exndpoint
app.use('/api/admin',adminRouter)

app.use('/api/user',userRouter)



app.get('/',(req,res)=>{
    res.send('API Working')
    console.log("hii")
})



app.listen(port,(err)=>{
    if(err){
        console.log('error in starting server')
        return
    }
    console.log("server started on port ",port)
})