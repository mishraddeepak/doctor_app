const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  experience: { type: String, required: true },
  fees: { type: Number, required: true },
  about: { type: String },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  docImg: { type: String }, // Stores the uploaded image path or URL
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const doctorModel= mongoose.model("Doctor", doctorSchema);

module.exports=doctorModel 