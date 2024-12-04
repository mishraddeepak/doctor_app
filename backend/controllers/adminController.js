const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const doctorModel = require('../models/doctorModel')
const UserProfile = require('../models/userAppointment.Model')
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
dotenv.config();
// admin login
const verifyAdminLogin = (req, res) => {

  const { email, password } = req.body;

  // Retrieve admin credentials from .env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Check if credentials match
  if (email === adminEmail && password === adminPassword) {
    // Generate a JWT token

    const token = jwt.sign(
      { email: adminEmail, role: "admin" }, // Payload
      process.env.SECRET_KEY, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    return res.json({
      message: "Login successful",
      isAdmin: true,
      success: true,
      token,
    });
  } else {
    return res.json({ message: "Invalid credentials" });
  }
};



// Add a new doctor
const addDoctor = async (req, res) => {
  try {
    console.log("hiii")
    const {
      name,
      email,
      password,
      experience,
      fees,
      about,
      speciality,
      degree,
      address1,
      address2,
    } = req.body;
    // Check if doctor with the email already exists
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.json({ success: false, error: "Doctor with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle image upload if a file is included
    let docImgPath = "";
    if (req.file) {
      docImgPath = path.join("/uploads", req.file.filename); // Adjust the path as per your upload directory structure
    }

    // Create a new doctor instance
    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      experience,
      fees,
      about,
      speciality,
      degree,
      address1,
      address2,
      docImg: docImgPath,
    });

    // Save to database
    await newDoctor.save();
    return res.json({ message: "Doctor added successfully", success: true });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return res.json({ success: false, error: "Internal server error" });
  }
};

// get all doctors
const getAllDoctors = async (req, res) => {
  try {
    // Fetch all doctors from the database
    const doctors = await doctorModel.find();

    if (!doctors || doctors.length === 0) {
      return res.json({ success: false, message: "No doctors found" });
    }

    return res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.json({ success: false, error: "Internal server error" });
  }
};
const getAllAppointments = async (req, res) => {
  try {
    // Fetch all users who have appointments
    const users = await UserProfile.find({ "appointments.0": { $exists: true } });

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No appointments found" });
    }

    // Extract and format the appointment data from all users
    const results = users.map(user => {
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        dob: user.dob,
        uploadedFiles: user.uploadedFiles,
        appointments: user.appointments, // Include all appointments for the user
      };
    });

    return res.status(200).json({ success: true, userdata: results });
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


// const update appointment status
// const updateAppointmentStaus=async(req,res)=>{

//   try{
//     const users = await UserProfile.find({ "appointments.0": { $exists: true } });

//     if (!users || users.length === 0) {
//       return res.status(404).json({ success: false, message: "No appointments found" });
//     }
//     const results = users.map(user => {
//       return {
//         // userId: user._id,
//         // name: user.name,
//         // email: user.email,
//         // phone: user.phone,
//         // address: user.address,
//         // gender: user.gender,
//         // dob: user.dob,
//         // uploadedFiles: user.uploadedFiles,
//         appointments: user.appointments, // Include all appointments for the user
//       };

//     });
//     console.log(results)
//   }catch(error){

//   }
// }


// const updateAppointmentStatus = async (req, res) => {
//   try {
//     // Fetch users with appointments
//     const users = await UserProfile.find({ "appointments.0": { $exists: true } });

//     if (!users || users.length === 0) {
//       return res.status(404).json({ success: false, message: "No appointments found" });
//     }

//     // Use map to iterate over users and appointments
//     const updatePromises = users.map(async (user) => {
//       // For each user, map through their appointments
//       const appointmentUpdates = user.appointments.map(async (appointment) => {
//         const appointmentId = appointment._id;  // Assuming each appointment has an '_id'
//         const newStatus = req.body.status;  // Assume the new status is in the request body

//         // Update the status of each appointment
//         const updatedAppointment = await UserProfile.updateOne(
//           { "appointments._id": appointmentId },
//           {
//             $set: { "appointments.$.status": newStatus }
//           }
//         );

//         if (updatedAppointment.nModified === 0) {
//           console.log(`Appointment with ID ${appointmentId} not found or status already updated.`);
//         } else {
//           console.log(`Appointment with ID ${appointmentId} updated successfully.`);
//         }
//       });

//       // Wait for all appointment updates to complete
//       await Promise.all(appointmentUpdates);
//     });

//     // Wait for all users and their appointments to be updated
//     await Promise.all(updatePromises);

//     // Respond with success
//     res.status(200).json({ success: true, message: "Appointments updated successfully" });

//   } catch (error) {
//     console.error("Error updating appointments:", error);
//     res.status(500).json({ success: false, message: "Error updating appointments" });
//   }
// }

// const updateAppointmentStatus = async (req, res) => {
//   try {
//     // Fetch users with appointments
//     const users = await UserProfile.find({ "appointments.0": { $exists: true } });

//     if (!users || users.length === 0) {
//       return res.status(404).json({ success: false, message: "No appointments found" });
//     }

//     // Use map to iterate over users and appointments
//     const updatePromises = users.map(async (user) => {
//       // For each user, map through their appointments
//       const appointmentUpdates = user.appointments.map(async (appointment) => {
//         const appointmentId = appointment._id;  // Assuming each appointment has an '_id'
//         const newStatus = req.body.status;      // The new status from the request body
//         const doctorFee = req.body.doctorFee;   // The new doctorFee from the request body
//         const doctorName = req.body.doctorName; // The new doctorName from the request body
//         const docId = req.body.docId;           // The new docId from the request body

//         // Update the appointment with the new fields
//         const updatedAppointment = await UserProfile.updateOne(
//           { "appointments._id": appointmentId },
//           {
//             $set: {
//               "appointments.$.status": newStatus,
//               "appointments.$.doctorFee": doctorFee,
//               "appointments.$.doctorName": doctorName,
//               "appointments.$.docId": docId
//             }
//           }
//         );

//         if (updatedAppointment.nModified === 0) {
//           console.log(`Appointment with ID ${appointmentId} not found or status already updated.`);
//         } else {
//           console.log(`Appointment with ID ${appointmentId} updated successfully.`);
//         }
//       });

//       // Wait for all appointment updates to complete
//       await Promise.all(appointmentUpdates);
//     });

//     // Wait for all users and their appointments to be updated
//     await Promise.all(updatePromises);

//     // Respond with success
//     res.status(200).json({ success: true, message: "Appointments updated successfully" });

//   } catch (error) {
//     console.error("Error updating appointments:", error);
//     res.status(500).json({ success: false, message: "Error updating appointments" });
//   }
// }

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;  // Get the appointmentId from the URL
    const { status, doctorFee, doctorName, docId } = req.body;  // Get the fields from the request body
console.log(appointmentId,status, doctorFee, doctorName, docId)
    // Find the user whose appointment matches the given appointmentId
    const user = await UserProfile.findOne({ "appointments._id": appointmentId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User or appointment not found" });
    }

    // Find the specific appointment to update
    const appointment = user.appointments.find((app) => app._id.toString() === appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Update the appointment fields
    appointment.status = status || appointment.status;  // Update status if provided, else keep the old status
    appointment.doctorFee = doctorFee || appointment.doctorFee;  // Update doctorFee if provided
    appointment.doctorName = doctorName || appointment.doctorName;  // Update doctorName if provided
    appointment.docId = docId || appointment.docId;  // Update docId if provided

    // Save the updated user document
    await user.save();

    // Respond with success
    res.status(200).json({ success: true, message: "Appointment updated successfully" });

  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ success: false, message: "Error updating appointment" });
  }
};







module.exports = {
  verifyAdminLogin,
  addDoctor,
  getAllDoctors,
  getAllAppointments,
  updateAppointmentStatus
}
