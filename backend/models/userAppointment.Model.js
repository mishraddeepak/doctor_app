const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        default: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')  // Use a valid ObjectId here
    },
    slotTime: { type: String, required: true },
    docName:{type: String,},
    docFee:{type: String},
    patientReports:  
       [ {
          fileId: {type:String},
          fileType: { 
            type: String, 
            enum: ["audio", "video", "pdf", "image"], // Allowed types
           
          },
          fileName:{type:String},
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
        }]
      ,
    symptoms: { type: String, required: true },
    selectedDate:{type:String},
    prescriptions: [{
      medicine: {
        type: String,
     
      },
      dose: {
        type: String,
      
      },
      timing:{
        type: String,
      }
    }
    ],
    instruction:{type:String},
    bookedAt: { type: Date, default: Date.now },
    status: {type: String, enum: ["Pending", "Accepted", "Canceled","Completed"], default: "Pending"} 
   },{timestamps:true});
const userProfileSchema = new mongoose.Schema(
    {   name: { type: String, required: true },
        email: { type: String, required: true, },
        phone: { type: String, required: true },
        image: { type: String },
        address: {line1: { type: String, required: true },line2: { type: String },},
        gender: { type: String, required: true },
        dob: { type: Date, required: true },
        uploadedFiles: [{fileName: String,filePath: String,},],
    },
    { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
