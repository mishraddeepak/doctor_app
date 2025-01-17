const express = require('express');
const userRouter = express.Router();
// const { registerUser, loginUser, getUserByID } = require('../controllers/userController')
// const { createUserProfile, bookAppointment, getUserProfile, deleteUserFile, updateUserProfile }
    // = require('../controllers/userController')
// const UserProfile = require('../models/userModel')
// new handlers
const userHandler= require('../controllers/userController')


const multer = require('multer');
const upload = multer();
const { uploadFiles, verifyToken } = require('../middlewares/multer');

// Registering the user
userRouter.post('/register', userHandler.registerUser)
userRouter.post('/login', userHandler.loginUser)
userRouter.post('/update-profile', uploadFiles, userHandler.editUserProfile)

userRouter.post('/book-appointment',  upload.none(), userHandler.bookAppointment)
// logging in user

// Booking the appoint ment for the user based upon the userID or _.id


// after the login updating the profile with submission of the reports
// userRouter.post('/update-profile', uploadFiles, createUserProfile)
// deleting the report submitted

// userRouter.delete('/information/delete/:userID', deleteUserFile)
// userRouter.get('/profile/:userID', getUserByID)
// userRouter.get('/information/:userID',  getUserProfile)



const getAllAppointmentsByDocId = async (req, res) => {
    try {
      const { docId } = req.query; // Get docId from query parameters
  
      if (!docId) {
        return res.status(400).json({ message: 'docId is required' });
      }
  
    //   console.log('docId from query:', docId);
  
      // Fetch all users that have an appointment with the given docId
      const users = await UserProfile.find({
        "appointments.docId": docId
      });
  
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'No appointments found for the given docId' });
      }
  
      // Filter users and appointments, returning only relevant data
      const results = users.map(user => {
        console.log(user.appointments)
        const filteredAppointments = user.appointments.filter(appointment => {
            console.log('Appointment docId:', appointment.docId); // Log each appointment's docId
            return String(appointment.docId) === String(docId); // Ensure both are strings and compare
          });
          
//   console.log("filteredAppointments",filteredAppointments)
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          dob: user.dob,
          uploadedFiles: user.uploadedFiles,
          appointments: filteredAppointments,
        };
      });
     
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  

  
 
   




userRouter.get('/appointments', getAllAppointmentsByDocId);







module.exports = userRouter
