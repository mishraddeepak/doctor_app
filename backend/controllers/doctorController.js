
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

const getDoctorAppointments = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const doctorAppointments = await UserProfile.find(
      { "appointments.doctor": doctorId },
      {
        name: 1,
        email: 1,
        phone: 1,
        dob: 1,
        appointments: 1,
        uploadedFiles: 1,
      }
    ).populate({
      path: "appointments.doctor",
      model: "Doctor",
      select: "name speciality",
    });

    if (!doctorAppointments || doctorAppointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this doctor." });
    }

    const filteredAppointments = doctorAppointments.map(patient => {
      // Filter appointments by doctor ID
      patient.appointments = patient.appointments.filter(appointment =>
        appointment.doctor && appointment.doctor._id.toString() === doctorId
      );

      // Map and update patientReports to include fileName
      patient.appointments = patient.appointments.map(appointment => {
        const updatedReports = appointment.patientReports.map(report => {
          const matchedFile = patient.uploadedFiles.find(
            file => file._id.toString() === report.fileId.toString()
          );

          if (matchedFile) {
            return {
              ...report, // Include all original report fields
              fileName: matchedFile.fileName, // Add fileName
              filePath: matchedFile.filePath, // Replace filePath with the correct value
            };
          }

          // Return the original report if no match is found
          return report;
        });

        // Return the updated appointment object
        return { ...appointment.toObject(), patientReports: updatedReports };
      });

      return patient;
    });

    // Filter out patients with no valid appointments
    const validAppointments = filteredAppointments.filter(patient => patient.appointments.length > 0);

    if (validAppointments.length === 0) {
      return res.status(404).json({ message: "No valid appointments found for this doctor." });
    }

    return res.json({ success: true, doctorAppointments: validAppointments });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return res.json({ message: "Failed to fetch doctor appointments.", error });
  }
};
// add prescription to the patient
const prescriptionUpdate = async (req, res) => {
  const { patientId } = req.params; // Extract patient ID from URL parameters
  const { appointmentId, prescriptions, instruction } = req.body; // Extract data from the request body

  try {
    // Find the patient by their ID
    const patient = await UserProfile.findById(patientId);

    // Check if the patient exists
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Locate the specific appointment within the appointments array
    const appointment = patient.appointments.find(
      (appt) => appt._id.toString() === appointmentId
    );

    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Ensure prescriptions is initialized as an array
    if (!Array.isArray(appointment.prescriptions)) {
      appointment.prescriptions = [];
    }

    // Add new prescriptions while avoiding duplicates based on `medicine` property
    if (Array.isArray(prescriptions) && prescriptions.length > 0) {
      prescriptions.forEach((newPrescription) => {
        // Ensure prescription object structure is valid
        if (typeof newPrescription === "object" && newPrescription.medicine && newPrescription.dose) {
          const isDuplicate = appointment.prescriptions.some(
            (existingPrescription) =>
              existingPrescription.medicine === newPrescription.medicine
          );

          if (!isDuplicate) {
            appointment.prescriptions.push(newPrescription);
          }
        }
      });
    }

    // Update the instruction if provided
    if (instruction) {
      appointment.instruction = instruction;
    }

    // Save the updated patient document
    await patient.save();

    // Respond with success
   return res.json({
      success: true,
      message: "Appointment Completed",
      updatedAppointment: appointment,
    });
  } catch (error) {
    console.error("Error updating prescription and instruction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update prescription and instruction",
      error: error.message,
    });
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
  getDoctorById,
  prescriptionUpdate
};






