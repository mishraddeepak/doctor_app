const express  = require('express')
const { getDoctorAppointments, loginDoctor, getDoctorById, prescriptionUpdate } = require('../controllers/doctorController')
const doctorRouter = express.Router()

// doctorRouter.get('/getallappointments:doctorId',getAllAppointmentsWithPatients)
doctorRouter.get('/getallappointments/:doctorId',getDoctorAppointments)
doctorRouter.get('/getdoctor/:id',getDoctorById)
doctorRouter.post('/login',loginDoctor)

// prescription to the patient
doctorRouter.post('/update-prescription/:patientId',prescriptionUpdate)

module.exports=doctorRouter