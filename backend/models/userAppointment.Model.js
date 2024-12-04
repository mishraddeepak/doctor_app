const mongoose = require("mongoose");

// {
//     appointmentId,
    
//     docId: selectedDoctor._id,
//     doctorName: selectedDoctor.name,
//     doctorFee: fee || selectedDoctor.fees,
//   },

const appointmentSchema = new mongoose.Schema({
    // doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' ,default: "123" },
    docId:{type:String} ,
    doctorName: {type:String},
    doctorName:{type:String} ,
    doctorFee: {type:String} ,
    slotTime: { type: String, required: true },
    symptoms: { type: String, required: true },
    selectedDate:{type:String,required:true},
    // uploadedFiles: [{fileName: String,filePath: String,},],
    bookedAt: { type: Date, default: Date.now },
    // status: { type: String, enum: ["pending", "accepted", "canceled"], default: "pending" },
    status: {type: String, enum: ["Pending", "Accepted", "Canceled","Completed"], default: "Pending"} 
   },{timestamps:true});

// Define the UserProfile schema
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
