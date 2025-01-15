import {createContext, useState} from 'react'

import axios from 'axios'
import {toast} from 'react-toastify'
export const DoctorContext = createContext()
export default function DoctorContextProvider(props) {
  const[docProfile,setDocProfile] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL

const[dToken,setDToken] = useState(
 
  localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
)
const id = localStorage.getItem("dUserId");

const getDoctorDetails = async () => {
  
  try {
  
    const { data } = await axios.get(
      `${backendUrl}/api/doctor/getdoctor/${id}`
    );
    console.log(data)
    setDocProfile(data)
    if(data.success){
      toast.success("loaded profile")
    }
  } catch (error) {
    toast.error("Unable to load this time try again late")
  }
};

    const value = {
      dToken,
      setDToken,
      backendUrl,
      getDoctorDetails,
      docProfile
    }

  return (
   <DoctorContext.Provider value={value}>
    {props.children}
   </DoctorContext.Provider>
  )
}
