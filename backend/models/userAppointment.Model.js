const mongoose = require("mongoose");
const doctorModel = require('./doctorModel')
const appointmentSchema = new mongoose.Schema({
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        default: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')  // Use a valid ObjectId here
    },
    slotTime: { type: String, required: true },
    symptoms: { type: String, required: true },
    selectedDate:{type:String},
    priscription:{type:String},
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
        appointments: [appointmentSchema], // Array of appointments linked to the user
    },
    { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
