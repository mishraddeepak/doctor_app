import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Pages/Login";

import { useContext,useEffect } from "react";
import { AppContext } from "./context/AppContext";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Admin/Dashboard";
import AllAppointments from "./Pages/Admin/AllAppointments";
import AddDoctor from "./Pages/Admin/AddDoctor";
import DoctorsList from "./Pages/Admin/DoctorsList";
import UpdateDoctor from "./Pages/Admin/UpdateDoctor";
import { DoctorContext } from "./context/DoctorContext";
import DoctorAppointment from "./Pages/Doctor/DoctorAppointment";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";
export default function App() {
  const { aToken } = useContext(AdminContext);
const{dToken} = useContext(DoctorContext)

  // useEffect(() => {
  //   if (!aToken) {
  //     toast.error("You are not authorised...Log in"); // Display the toast message
  //   }
  // }, [aToken])
console.log(dToken)
  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* adminRoute */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctors-list" element={<DoctorsList />} />
          <Route path="/update-doctor/:doctorId" element={<UpdateDoctor />} />
          {/* doctorRoute */}
          <Route path="/doctor-appointments" element={<DoctorAppointment/>} />
          <Route path="/doctor-profile" element={<DoctorProfile/>} />



        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
     
      <ToastContainer />
    </>
  );
}
