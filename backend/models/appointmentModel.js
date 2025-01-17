const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  medicine: {
    type: String,
    required: true,
  },
  dose: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
});

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Doctor',
    },
  slotTime: {
    type: String,
    required: true,
  },
  docName: {
    type: String,
    required: false,
  },
  docFee: {
    type: String,
    required: false,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  patientName: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  selectedDate: {
    type: Date,
    required: true,
  },
  prescriptions: {
    type: [prescriptionSchema], 
    required: false, 
  },
  instruction: {
    type: String,
    required: false, 
  },
  bookedAt: {
    type: Date,
    required: true,
    
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Completed", "Cancelled"],
    required: true,
    default: "Pending",
  },
}, { timestamps: true }); 

const appointmentModel = mongoose.model('Appointment', appointmentSchema);

module.exports = appointmentModel;
