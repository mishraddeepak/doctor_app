const UserProfile = require('../models/userAppointment.Model');



const createUserProfile = async (req, res) => {
    try {
        const { userID, email, name, phone, image, address, gender, dob } = req.body;

        // Process uploaded files from multer
        const uploadedFiles = req.files.map((file) => ({
            fileName: file.originalname,
            filePath: file.path,
        }));

        console.log("Uploaded Files:", uploadedFiles);

        // Check if the user with the same email exists (even if the userID is different)
        const existingUser = await UserProfile.findOne({ email });

        if (existingUser && existingUser._id.toString() !== userID) {
            return res.status(400).json({
                message: "A user with this email already exists.",
            });
        }

        // Check if the user profile already exists
        const userProfile = await UserProfile.findById(userID);

        if (userProfile) {
            // Update the existing user profile
            const updatedUserProfile = await UserProfile.findByIdAndUpdate(
                userID,
                {
                    name,
                    email,
                    phone,
                    image,
                    address,
                    gender,
                    dob,
                    $push: { uploadedFiles: { $each: uploadedFiles } }, // Append new files
                },
                { new: true, runValidators: true }
            );

            return res.status(200).json({
                message: "User profile updated successfully",
                data: updatedUserProfile,
            });
        }

        // Create a new user profile
        const newUserProfile = new UserProfile({
            _id: userID,
            name,
            email,
            phone,
            image,
            address,
            gender,
            dob,
            uploadedFiles,
        });

        // Save the new user profile
        const savedUserProfile = await newUserProfile.save();

        res.status(201).json({
            message: "User profile created successfully",
            data: savedUserProfile,
        });
    } catch (error) {
        console.error("Error creating or updating user profile:", error);
        res.status(500).json({ message: "Error creating or updating user profile", error });
    }
};
// user profile by ID
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
        const {userID} = req.params
        const{param1}=req.query
        console.log(userID,param1)
        const user = await UserProfile.findOne({_id:userID})
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const files =  user.uploadedFiles
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



// // Cancel a specific appointment for a user
// const cancelAppointment = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const appointmentId = req.params.appointmentId;

//         const user = await UserProfile.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: "User profile not found" });
//         }

//         // Filter out the appointment to be canceled
//         user.appointments = user.appointments.filter(
//             (appointment) => appointment._id.toString() !== appointmentId
//         );

//         const updatedUser = await user.save();

//         res.status(200).json({
//             message: "Appointment canceled successfully",
//             data: updatedUser,
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error canceling appointment", error });
//     }
// };

// Controller to book an appointment for a user
const bookAppointment = async (req, res) => {
   
    try {
        const { userID, doctorId, slotTime, symptoms, uploadedFiles,selectedDate } = req.body;
console.log("hwd")
       
        // Find the user by userID
        const user = await UserProfile.findById(userID);
       
        if (!user) {
            return res.status(404).json({ message: "User profile not found" });
        }

        // Create a new appointment object
        const newAppointment = {
            doctorId,
            selectedDate,
            slotTime,
            symptoms,
            uploadedFiles: uploadedFiles || [], // Optional, default to empty array
            bookedAt: new Date(), // Automatically sets the booking time to now
        };

        // Add the new appointment to the user's appointments array
        user.appointments.push(newAppointment);

        // Save the updated user document
        const updatedUser = await user.save();

        res.status(200).json({
            message: "Appointment booked successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Error booking appointment", error });
    }
};

module.exports={
    createUserProfile,
    bookAppointment,
    getUserProfile,
    deleteUserFile
}
