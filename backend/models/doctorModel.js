const mongoose = require("mongoose");
const UserProfile=require('./userAppointment.Model')
const appointmentSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "UserProfile", // Reference to the Patient model 
    required: true 
  },
  appointmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  patientReports:  [
    {
      fileId: {type:String},
      fileType: { 
        type: String, 
        enum: ["audio", "video", "pdf", "image"], // Allowed types
       
      },
      filePath: { 
        type: String, // Path or URL to the file
        
      },
      description: { 
        type: String, // Optional description of the report
        default: "No description provided" 
      },
      uploadedAt: { 
        type: Date, 
        default: Date.now // Automatically set the upload timestamp
      }
    }
  ]
}, { timestamps: true });


const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  experience: { type: String, required: true },
  fees: { type: Number, required: true },
  about: { type: String },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  isHeadDoctor: { type: Boolean, default: false },
  address1: { type: String, required: true },
  address2: { type: String },
  docImg: { type: String }, // Stores the uploaded image path or URL
  appointments:[appointmentSchema]
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const doctorModel= mongoose.model("Doctor", doctorSchema);

module.exports=doctorModel 