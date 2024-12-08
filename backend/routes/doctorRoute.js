const express  = require('express')
const { getDoctorAppointments, loginDoctor, getDoctorById } = require('../controllers/doctorController')
const doctorRouter = express.Router()

// doctorRouter.get('/getallappointments:doctorId',getAllAppointmentsWithPatients)
doctorRouter.get('/getallappointments/:doctorId',getDoctorAppointments)
doctorRouter.get('/getdoctor/:id',getDoctorById)
doctorRouter.post('/login',loginDoctor)
doctorRouter.put('/doctor-priscription',(req,res)=>{
    console.log("hii")
})

module.exports=doctorRouter