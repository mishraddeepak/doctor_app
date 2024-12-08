
const Doctor = require('../models/doctorModel');
const UserProfile = require('../models/userAppointment.Model');
const doctorModel = require('../models/doctorModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await doctorModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "User not found" })

    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '24hr' })
      return res.json({ success: true, token, userID: user._id })
    }
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })

  }
}


// const getDoctorAppointments = async (req, res) => {
//     const { doctorId } = req.params; // Get doctor ID from request parameters
//     console.log(doctorId)
//     try {
//       // Fetch appointments for the doctor
//       const doctorAppointments = await UserProfile.find(
//         { "appointments.doctor": doctorId }, // Match appointments with the given doctor ID
//         {
//           name: 1, // Include patient's name
//           email: 1, // Include patient's email
//           phone: 1, // Include patient's phone
//           dob:1,
//           appointments: 1, 
//         }
//       ).populate({
//         path: "appointments.doctor",
//         model: "Doctor", // Updated model name
//         select: "name speciality", // Include desired doctor fields
//       });

//       // Check if appointments exist
//       if (!doctorAppointments || doctorAppointments.length === 0) {
//         return res.status(404).json({ message: "No appointments found for this doctor." });
//       }

//       // Respond with the fetched appointments
//       return res.json({success:true, doctorAppointments });
//     } catch (error) {
//       console.error("Error fetching doctor appointments:", error);
//       return res.status(500).json({ message: "Failed to fetch doctor appointments.", error });
//     }
//   };



const getDoctorAppointments = async (req, res) => {
  const { doctorId } = req.params; // Get doctor ID from request parameters
  

  try {
    // Fetch appointments for the doctor, ensuring that doctor._id matches doctorId
    const doctorAppointments = await UserProfile.find(

      { "appointments.doctor": doctorId }, // Match appointments with the given doctor ID
      {
        name: 1, // Include patient's name
        email: 1, // Include patient's email
        phone: 1, // Include patient's phone
        dob: 1,
        appointments: 1,
      }
    ).populate({
      path: "appointments.doctor",
      model: "Doctor", // Updated model name
      select: "name speciality", // Include desired doctor fields
    });
   
    // Check if appointments exist
    if (!doctorAppointments || doctorAppointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this doctor." });
    }

    // Filter appointments for the specific doctor ID
    const filteredAppointments = doctorAppointments.map(patient => {
      // Only keep appointments where doctor._id matches the requested doctorId
      patient.appointments = patient.appointments.filter(appointment =>
        appointment.doctor && appointment.doctor._id.toString() === doctorId
      );
      return patient;
    });

    // Check if any patient has appointments for the requested doctor
    const validAppointments = filteredAppointments.filter(patient => patient.appointments.length > 0);

    if (validAppointments.length === 0) {
      return res.status(404).json({ message: "No valid appointments found for this doctor." });
    }

    // Respond with the filtered and valid appointments
    return res.json({ success: true, doctorAppointments: validAppointments });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return res.json({ message: "Failed to fetch doctor appointments.", error });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    // Find the doctor by ID
    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      message: "Doctor retrieved successfully",
      doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.json({
      success: false,
      message: "An error occurred while fetching the doctor",
    });
  }
};

module.exports = {
  getDoctorAppointments,
  loginDoctor,
  getDoctorById
};






