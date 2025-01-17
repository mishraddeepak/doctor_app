const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const doctorModel = require('../models/doctorModel')

const bcrypt = require("bcrypt");
const path = require("path");
const cloudinary = require("cloudinary").v2; // For image upload, if using cloudinary
const fs = require("fs");
const mongoose = require("mongoose")
dotenv.config();

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
// add new doctor
const addDoctor = async (req, res) => {
  console.log(req.body)
  try {
    console.log("hiii")
    const {
      name,
      email,
      password,
      experience,
      fees,
      about,
      isHeadDoctor,
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
      isHeadDoctor,
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
const removeDoctorWithId= async(req,res)=>{
  const { id } = req.params;
  try {
    await doctorModel.findByIdAndDelete(id); // Delete the doctor by ID
    res.status(200).json({ message: "Doctor deleted successfully." });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Failed to delete doctor." });
  }
}

// const updateAppointmentStatus = async (req, res) => {
  
//   try {
//     const { appointmentId } = req.params;  // Get the appointmentId from the URL
   
//     const { status, doctorFee,details,selectedFiles, docId } = req.body;  // Get the fields from the request body
//  // Find the user whose appointment matches the given appointmentId
//     const user = await UserProfile.findOne({ "appointments._id": appointmentId });
//     console.log(selectedFiles)

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User or appointment not found" });
//     }

//     // Find the specific appointment to update
//     const appointment = user.appointments.find((app) => app._id.toString() === appointmentId);

//     if (!appointment) {
//       return res.status(404).json({ success: false, message: "Appointment not found" });
//     }
//    console.log("selected files are",selectedFiles)
// // Update the appointment fields
//     appointment.status = status || appointment.status;  // Update status if provided, else keep the old status
//     appointment.doctorFee = doctorFee || appointment.doctorFee;  // Update doctorFee if provided
//     // appointment.doctorName = doctorName || appointment.doctorName;  // Update doctorName if provided
//     appointment.doctor = docId || appointment.docId;  // Update docId if provided
//     appointment.patientReports = (selectedFiles !== undefined && selectedFiles !== null) ? selectedFiles : null;

//     // Save the updated user document
//     await user.save();

//     // Respond with success
//     res.status(200).json({ success: true, message: "Appointment updated successfully" });

//   } catch (error) {
//     console.error("Error updating appointment:", error);
//     res.status(500).json({ success: false, message: "Error updating appointment" });
//   }
// };

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;  // Get the appointmentId from the URL
    const { status, docFee,docName, details, selectedFiles, docId } = req.body;  // Get the fields from the request body
    console.log(selectedFiles); // Checking the structure of selectedFiles

    // Ensure selectedFiles is an array of fileIds (if it's not an array, return an error)
    if (selectedFiles && !Array.isArray(selectedFiles)) {
      return res.status(400).json({ success: false, message: "Selected files must be an array of fileIds." });
    }

    const user = await UserProfile.findOne({ "appointments._id": appointmentId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User or appointment not found" });
    }

    const appointment = user.appointments.find((app) => app._id.toString() === appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Update the appointment fields
    appointment.status = status || appointment.status;
    appointment.docFee = docFee || appointment.docFee;
    appointment.doctor = docId || appointment.docId;
    appointment.docName = docName || appointment.docName;
    // If selectedFiles contain an array of fileIds, assign them to patientReports
    if (selectedFiles && selectedFiles.length > 0) {
      appointment.patientReports = selectedFiles.map(fileId => ({
        fileId: fileId,              // Use the fileId directly from the array
        filePath: `/uploads/${fileId}`,  // Assuming filePath is constructed from the fileId
        uploadedAt: new Date()       // Save the upload timestamp
      }));
    }

    // Save the updated user document
    await user.save();

    // Respond with success
    res.status(200).json({ success: true, message: "Appointment updated successfully" });

  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ success: false, message: "Error updating appointment" });
  }
};





const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const updateDoctor = async (req, res) => {
const{id} = req.params

  try {
    // Destructure the request body
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

    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: "Doctor not found" });
    }

    // Check if the doctor is updating their password
    if (password) {
      // Hash the new password (you can use bcrypt to hash it before saving)
      doctor.password = password; // Hash password before saving
    }

    // If a new image is uploaded, handle it
    if (req.file) {
      // If you are using Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "doctor_images", // Cloudinary folder
      });

      // Remove the old image if there's any (for cloud storage or local)
      if (doctor.profileImage) {
        // If the profile image is already stored in Cloudinary
        const imageId = doctor.profileImage.split("/").pop().split(".")[0]; // Extract image ID
        await cloudinary.uploader.destroy(imageId); // Delete old image from Cloudinary
      }

      // Save the new image URL
      doctor.profileImage = result.secure_url;
    }

    // Update doctor fields with new data
    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.experience = experience || doctor.experience;
    doctor.fees = fees || doctor.fees;
    doctor.about = about || doctor.about;
    doctor.speciality = speciality || doctor.speciality;
    doctor.degree = degree || doctor.degree;
    doctor.address1 = address1 || doctor.address1;
    doctor.address2 = address2 || doctor.address2;

    // Save the updated doctor details
    await doctor.save();

    res.status(200).json({ success: true, message: "Doctor details updated successfully", doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "An error occurred while updating doctor details" });
  }
};








// const assignDoctor = async (req, res) => {
//   const { docId } = req.params; // Extract doctor ID from URL
//   const { patient, appointmentDetails } = req.body;

//   console.log("Details are", patient, appointmentDetails);

//   try {
//     // 1. Find the doctor by ID
//     const doctor = await doctorModel.findById(docId);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     // 2. Extract the patientId, appointmentId, and patientReports
//     const patientId = patient.patientId || patient._id; // Use either patientId or _id
//     const appointmentId = appointmentDetails.appointmentId;

//     // Validate selectedFiles and ensure they're in the correct format
//     // if (!appointmentDetails.selectedFiles || appointmentDetails.selectedFiles.length === 0) {
//     //   return res.status(400).json({ success: false, message: "No files uploaded" });
//     // }

//     // Transform `selectedFiles` into the required format
//     const patientReports = appointmentDetails.selectedFiles.map((file) => {
//       const fileExtension = file.split('.').pop(); // Extract file extension
//       let fileType;

//       // Determine the file type based on the extension
//       if (['mp4', 'mkv'].includes(fileExtension)) fileType = 'video';
//       else if (['mp3', 'wav'].includes(fileExtension)) fileType = 'audio';
//       else if (['pdf'].includes(fileExtension)) fileType = 'pdf';
//       else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) fileType = 'image';
//       else throw new Error(`Unsupported file type for file: ${file}`);

//       // Here, you should make sure the file is uploaded to your server or cloud storage
//       // and that `filePath` correctly points to the uploaded file.
//       // For example, if you're storing files locally, you might append the path like:
//       const filePath = `/uploads/${file}`;  // Update with actual file path where it's stored.

//       return { fileType, filePath };
//     });

//     console.log("Reports are", patientReports);

//     // 3. Check if the appointment already exists and update it
//     const existingAppointmentIndex = doctor.appointments.findIndex(
//       (appointment) => appointment.appointmentId.toString() === appointmentId
//     );

//     if (existingAppointmentIndex !== -1) {
//       // If the appointment exists, update its details
//       doctor.appointments[existingAppointmentIndex].patientId = patientId;
//       doctor.appointments[existingAppointmentIndex].patientReports = patientReports;
//     } else {
//       // If it does not exist, add it as a new appointment
//       doctor.appointments.push({
//         patientId,
//         appointmentId,
//         patientReports,
//       });
//     }

//     // 4. Save the updated doctor document
//     await doctor.save();

//     res.status(200).json({ success: true, message: "Doctor assigned successfully", doctor });
//   } catch (error) {
//     console.error("Error assigning doctor:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



const assignDoctor = async (req, res) => {
  const { docId } = req.params; // Extract doctor ID from URL
  const { patient, appointmentDetails } = req.body;

  // console.log("Details are", patient, appointmentDetails);

  try {
    // 1. Find the doctor by ID
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // 2. Extract the patientId, appointmentId, and patientReports
    const patientId = patient.patientId || patient._id; // Use either patientId or _id
    const appointmentId = appointmentDetails.appointmentId;

    // 3. Fetch the files (using their IDs) from the doctor’s existing records, if any
    const patientReports = appointmentDetails.selectedFiles.map(fileId => {
      return {
        fileId: fileId, // Use the file ID directly
        filePath: `/uploads/${fileId}` // Assuming the file name is the same as the ID for simplicity
      };
    });

    // console.log("Reports are", patientReports);

    // 4. Check if the appointment already exists and update it
    const existingAppointmentIndex = doctor.appointments.findIndex(
      (appointment) => appointment.appointmentId.toString() === appointmentId
    );

    if (existingAppointmentIndex !== -1) {
      // If the appointment exists, update its details
      doctor.appointments[existingAppointmentIndex].patientId = patientId;
      doctor.appointments[existingAppointmentIndex].patientReports = patientReports;
    } else {
      // If it does not exist, add it as a new appointment
      doctor.appointments.push({
        patientId,
        appointmentId,
        patientReports,
      });
    }

    // 5. Save the updated doctor document
    await doctor.save();

    res.status(200).json({ success: true, message: "Doctor assigned successfully", doctor });
  } catch (error) {
    console.error("Error assigning doctor:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};










module.exports = {
  verifyAdminLogin,
  addDoctor,
  getAllDoctors,
  getAllAppointments,
  updateAppointmentStatus,
  assignDoctor,
  removeDoctorWithId,
  getDoctorById,
  updateDoctor
}
