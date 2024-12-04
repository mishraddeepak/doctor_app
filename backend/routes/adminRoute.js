const express  = require('express')
const adminRouter = express.Router()
const {addDoctor,
     verifyAdminLogin,
      getAllDoctors, 
      getAllAppointments,
      updateAppointmentStatus} =require('../controllers/adminController')
const multer = require('multer');
const upload = multer();
// const upload = require('../middlewares/multer')

adminRouter.post('/login',verifyAdminLogin)
adminRouter.post('/add-doctor', upload.none(),addDoctor)
adminRouter.get('/all-doctors',getAllDoctors)
adminRouter.get('/all-appointments',getAllAppointments)
adminRouter.post('/appointment-status/:appointmentId',updateAppointmentStatus)

module.exports = adminRouter