import React, { createContext, useEffect, useState } from "react";
import { doctors } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

export const AppContext = createContext();
export default function AppContextProvider(props) {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const adminUrl = import.meta.env.VITE_ADMIN_PANEL_URL;
  console.log("admin url", adminUrl);
  console.log("backendUrl is.....", backendUrl);
  const [token, setToken] = useState(false);
  const [userObj,setUserObj] = useState({})
  const [userID, setUserID] = useState(
    localStorage.getItem("userID") ? localStorage.getItem("userID") : ""
  );
  const [allData, setAllData] = useState([]);

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-appointments`
      );
      console.log("data is", data);
      if (data.success) {
        const allAppointments = data.userdata.flatMap(
          (user) => user.appointments
        );
        setAllData(allAppointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getAllDoctor = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/`);
    } catch (error) {}
  };


  // register function
  const registerUser = async (userData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/register`,
        userData
      );
      setToken(data.token)
      setUserObj(data.userObj)
    } catch (error) {
      console.log(error);
    }
  };
  const loginUser = async (userData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/login`,
        userData
      );
    setToken(data.token)
    setUserObj(data.userObj)
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    // new 
    registerUser,
    loginUser,
    token,
    setToken,
    userObj,
    setUserObj,
// old 
    doctors,
    currencySymbol,
    
    backendUrl,
    userID,
    setUserID,
    allData,
    getAllAppointments,
    adminUrl,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}
