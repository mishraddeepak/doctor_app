const express = require('express')
const cors = require('cors')
require('dotenv').config()
const path = require('path');
const connectDb = require('./config/mongodb')
// const connectCloudinary=require('./config/cloudinary')

const adminRouter = require('./routes/adminRoute')
const userRouter = require('./routes/userRoute')
const doctorRouter = require('./routes/doctorRoute')


const app =express()
const port = process.env.PORT||4000
connectDb()
// connectCloudinary()
// middleware
app.use(cors())
app.use(express.json())

// const uploadDir = path.join(__dirname, 'uploads');

app.use('/reports', express.static(path.join(__dirname, '../reports')));
//api exndpoint
app.use('/api/admin',adminRouter)

app.use('/api/user',userRouter)

app.use('/api/doctor',doctorRouter)
// app.use('/uploads', express.static(uploadDir));

app.use('/middlewares/uploads', express.static(path.join(__dirname, 'middlewares/uploads')));


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