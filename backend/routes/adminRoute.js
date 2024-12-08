const express  = require('express')
const adminRouter = express.Router()
const { uploadFiles, verifyToken } = require('../middlewares/multer');
const {addDoctor,
     verifyAdminLogin,
      getAllDoctors, 
      getAllAppointments,
      updateAppointmentStatus,
      assignDoctor,
      removeDoctorWithId,
      getDoctorById,
      updateDoctor} =require('../controllers/adminController')
const multer = require('multer');
const upload = multer();
// const upload = require('../middlewares/multer')

adminRouter.post('/login',verifyAdminLogin)
adminRouter.post('/add-doctor', verifyToken,upload.none(),addDoctor)
adminRouter.get('/all-doctors',getAllDoctors)
adminRouter.get('/all-appointments',getAllAppointments)
adminRouter.post('/appointment-status/:appointmentId',updateAppointmentStatus)
adminRouter.post('/assign-doctor/:docId',assignDoctor)
adminRouter.delete('/remove-doctor/:id',removeDoctorWithId)
adminRouter.get('/doctor/:id',getDoctorById)
adminRouter.put('/update-doctor/:id',upload.none(),updateDoctor)

module.exports = adminRouter