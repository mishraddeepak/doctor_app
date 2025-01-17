const userModel = require('../models/userModel')
const appointmentModel = require("../models/appointmentModel")
const fs = require('fs')
const path = require('path');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Register the user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body
        console.log("hii")
        const searchUser = await userModel.findOne({ email })
        if (searchUser) {
            return res.json({
                success: false,
                message: "User already exists."

            })
        }
        // hashing user
        console.log("hello....")
        const hashPassword = await bcrypt.hash(password, 10)
        const userData = {
            name,
            email,
            password: hashPassword
        }
        const newUser = new userModel(userData)
        const user = await newUser.save()
        const userObj = user.toObject();
        delete userObj.password;
        console.log("user is", user)
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '24hr' })
        return res.json({
            success: true,
            message: "User Registered Successfully.",
            token,
            userObj
        })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }

}
// Loging in user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email, password)
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })

        }
        const userObj = user.toObject()
        delete userObj.password

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '24hr' })
            return res.json({ success: true, token, userObj })
        }
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })

    }
}
// updating user Profile
const editUserProfile = async (req, res) => {
    try {
        const { email, name, phone, image, address, gender, dob } = req.body;

        const uploadedFiles = req.files.map((file) => ({
            fileName: file.originalname,
            filePath: path.join('uploads', file.filename), // Include the relative directory
        }));

        console.log("Uploaded Files:", uploadedFiles);




        const userProfile = await userModel.findOne({ email });

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found with the provided email",
            });
        }
        // Prepare data for update
        const updateData = { email, name, phone, image, address, gender, dob };
        if (image) updateData.image = image;
        if (dob) updateData.dob = dob;
        if (uploadedFiles.length > 0) {
            updateData.$push = { uploadedFiles: { $each: uploadedFiles } };
        }
        // Update the user profile using email
        const newUserProfile = await userModel.findOneAndUpdate(
            { email },
            updateData,
            { new: true, runValidators: true }
        );
        const updatedUserProfile = newUserProfile.toObject()
        delete updatedUserProfile.password
        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUserProfile,
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Error in updating user profile", error });
    }
};
// Controller to book an appointment for a user
const bookAppointment = async (req, res) => {

    try {
        // Extract data from the request body
        const {
            email,
            doctorId,
            selectedDate,
            slotTime,
            docFee,
            docName,
            patientId,
            patientName,
            symptoms,
            instruction,
            uploadedFiles,
        } = req.body;

        // Create a new appointment object instance
        const newAppointment = new appointmentModel({

            doctorId,
            selectedDate,
            slotTime,
            docFee,
            docName,
            patientId,
            patientName,
            symptoms,
            instruction,
            uploadedFiles: uploadedFiles || [],
            bookedAt: new Date(),
        });


        // Save the new appointment to the database
        const savedAppointment = await newAppointment.save();
        console.log("saved appointments are", savedAppointment)
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.appointments.push(savedAppointment._id)
        await user.save();
      
        res.status(200).json({
            message: "Appointment booked successfully",
            data: savedAppointment,
        });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Error booking appointment", error });
    }
};




// old controllers

const updateUserProfile = async (req, res) => {
    const { userID, email, name, phone, image, address, gender, dob } = req.body;

    try {
        // Check if user exists
        let user = await UserProfile.findById(userID);
        if (!user) {
            // Create a new user if not exists
            user = new UserProfile({
                _id: userID,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: {
                    line1: req.body["address[line1]"],
                    line2: req.body["address[line2]"],
                },
                gender: req.body.gender,
                dob: req.body.dob,
                uploadedFiles: [],
            });
        }

        // Process uploaded files
        const uploadedFiles = req.files.map((file) => ({
            fileName: file.originalname,
            filePath: file.path,
            type: file.mimetype,
        }));

        // Update user data
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address.line1 = req.body["address[line1]"] || user.address.line1;
        user.address.line2 = req.body["address[line2]"] || user.address.line2;
        user.gender = req.body.gender || user.gender;
        user.dob = req.body.dob || user.dob;
        user.uploadedFiles = [...user.uploadedFiles, ...uploadedFiles];

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: "User profile updated successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({
            message: "Failed to update user profile",
            error: error.message,
        });
    }
};








const getUserProfile = async (req, res) => {
    try {
        const { userID } = req.params; // Assuming userID is passed as a route parameter
        console.log(userID)
        // Fetch the user profile from the database
        const userProfile = await UserProfile.findById(userID);

        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        res.status(200).json({
            message: "User profile retrieved successfully",
            data: userProfile,
        });
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        res.status(500).json({ message: "Error retrieving user profile", error });
    }
};




// Delete a user profile by ID
const deleteUserFile = async (req, res) => {
    try {
        const { userID } = req.params
        const { param1 } = req.query
        console.log(userID, param1)
        const user = await UserProfile.findOne({ _id: userID })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const files = user.uploadedFiles
        // Filter out the file with the matching _id
        const updatedFiles = files.filter(file => file._id.toString() !== param1);

        user.uploadedFiles = updatedFiles;
        await user.save();
        console.log("After Deletion:", updatedFiles);


        res.status(200).json({ message: "File deleted successfully", updatedFiles });
    } catch (error) {
        console.error("Error deleting user file:", error);
        res.status(500).json({ message: "Error deleting user file", error });
    }
};




module.exports = {
    registerUser,
    loginUser,
    editUserProfile,
    bookAppointment,
    // old controllers

   
    getUserProfile,
    deleteUserFile,
    updateUserProfile
}
