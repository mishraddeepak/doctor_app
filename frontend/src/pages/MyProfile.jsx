import React, { useContext, useEffect, useState } from "react";
import axios from "axios"; // Assuming you're using Axios
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

export default function MyProfile() {
  const { token,userObj,backendUrl,setUserObj, setToken } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [info, setInfo] = useState({
    name: userObj.name,
    email: userObj.email,
  });
 
  const [userData, setUserData] = useState({
    
    name: info.name,
    email: info.email,
    image: assets.profile_pic,
    phone: userObj.phone||"00000",
    address: {
      line1: userObj.address.line1|| "Address Line-1 ",
      line2: userObj.address.line2|| "Address Line-2",
    },
    gender: userObj.gender||"Male",
    dob:userObj.dob|| "2000-01-20",
    uploadedFiles: uploadedFiles,
  });
 
  // handele report deete
  const handleDeleteFile = async (index, fileId) => {
    try {
      // Send delete request to the backend
      console.log("fileId is...",fileId)
      const response = await axios.delete(`${backendUrl}/api/user/information/delete/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        params:{
          param1:`${fileId}`
        }
      }
    );
  
      if (response.status === 200) {
        // Remove the file from the state after deletion
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles); // Assuming `setFiles` is the function that updates the state
      }
    } catch (error) {
      console.error("Error deleting the file", error);
    }
  };
  // file handling
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };
  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const saveProfile = async () => {
    try {
      setLoading(true);
      setMessage("");
      const formData = new FormData();
      // Append non-file fields
      formData.append("userID", userData.userID);
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("address[line1]", userData.address.line1);
      formData.append("address[line2]", userData.address.line2);
      uploadedFiles.forEach((file) => {
        formData.append("uploadedFiles", file);
      });
      /// consoling form data
      console.log("FormData contents:are....",);
      for (const [key, value] of uploadedFiles.entries()) {
        console.log(`${key}:`, value);
      }
      console.log("formData",formData)
      const {data} = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Required for FormData
          },
        }
      );
      console.log("hiii",data.data)
      if(data.success){
        toast.success(data.message)
      }
      
      
      setLoading(false);
      setUploadedFiles([]);
      setMessage("Profile updated successfully!");
      setIsEdit(false);
      // Optionally refetch updated data
     

      setFiles(data.data.uploadedFiles);
      setUserData({
        name: info.name,
        email: info.email,
        image: assets.profile_pic,
        phone: data.data.phone || "2948293",
        address: {
          line1: data.data.address.line1,
          line2: data.data.address.line2,
        },
        gender: data.data.gender,
        dob: data.data.dob.split("T")[0],
        uploadedFiles: [],
      });
      setUserObj(userData)
    } catch (error) {
      setLoading(false);
      setMessage("Failed to update profile. Please try again.");
      console.error(error);
    }
  };
 
  return (
    <div
      key={info.name + info.email}
      className="max-w-lg flex flex-col gap-2 text-sm"
    >
      <img className="w-36 rounded" src={userData.image} alt="Profile" />
      <p className="font-medium text-3xl text-neutral-800 mt-4">
        {info.name || "Loading..."}
      </p>
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <p className="text-neutral-500 underline mt-3">Contact Information</p>
      <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
        <p className="font-medium">Email Id:</p>
        <p className="text-blue-500">{info.email || "Loading..."}</p>
        <p className="font-medium">Phone:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 max-w-52"
            type="text"
            value={userData.phone}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        ) : (
          <p className="text-blue-500">{userData.phone}</p>
        )}
        <p className="font-medium">Address:</p>
        {isEdit ? (
          <div>
            <input
              className="bg-gray-50"
              value={userData.address.line1}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
              type="text"
            />
            <br />
            <input
              className="bg-gray-50"
              value={userData.address.line2}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value },
                }))
              }
              type="text"
            />
          </div>
        ) : (
          <p className="text-gray-500">
            {userData.address.line1}
            <br />
            {userData.address.line2}
          </p>
        )}
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">Basic Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              value={userData.gender}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}
          <p className="font-medium">Birth Date</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>

      {/* upload report start */}
      <div className="mt-4">
        <p>Upload Reports (PDF, Images, Videos)</p>
        {isEdit ? (
          <>
            <input
              type="file"
              accept=".pdf, image/*, video/*"
              multiple
              name="uploadedFiles"
              onChange={handleFileChange}
              className="block w-full border p-2 rounded-md"
            />
            <div className="mt-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-md mb-2"
                >
                  <p className="text-sm text-gray-700">{file.name}</p>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 mt-2">
            <input type="file" disabled={!isEdit} />{" "}
          </p>
        )}
      </div>
      {/* upload report end */}
      
<div className="mt-8">
  <p className="text-neutral-500 underline mb-3">All Reports</p>
  <div className="space-y-4">
    {files.length > 0 ? (
      files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-gray-100 rounded-md shadow-sm"
        >
          <div>
            <p className="font-medium text-gray-700 truncate max-w-xs">
              {file.fileName || `Report ${index + 1}`}
            </p>
            <p className="text-sm text-gray-500">{file.type}</p>
          </div>
          <div className="flex items-center space-x-4">
           
            <a
              href={`${backendUrl}/middlewares/${file.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm hover:underline"
              // onClick={() => handleViewFile(file.filePath)}
            >
              View
            </a>
            
            <button
              onClick={() => handleDeleteFile(index, file._id)} // Assuming each file has a unique _id
              className="text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No reports available to display.</p>
    )}
  </div>
</div>

      {/* save and edit */}
      <div className="mt-10">
        {loading ? (
          <p>Saving...</p>
        ) : isEdit ? (
          <button
            className="hover:text-white hover:bg-primary transition-all border-primary px-8 py-2 rounded-full"
            onClick={saveProfile}
          >
            Save Information
          </button>
        ) : (
          <button
            className="hover:text-white hover:bg-primary transition-all border-primary px-8 py-2 rounded-full"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
      {message && <p className="text-center mt-4">{message}</p>}
    </div>
  );
}
