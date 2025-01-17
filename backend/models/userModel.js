const mongoose = require("mongoose");


const userProfileSchema = new mongoose.Schema(
    {   name: { type: String, required: true },
        email: { type: String, required: true, },
        password:{type:String,required:true},
        phone: { type: String, unique:true },
        image: { type: String },
        address: {line1: { type: String,  },line2: { type: String },},
        gender: { type: String,  },
        dob: { type: Date },
        uploadedFiles: [{fileName: String,filePath: String,},],
        appointments: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Appointment",
            },
        ],
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", userProfileSchema);

module.exports = userModel;
