import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useContext } from "react";
import{toast} from 'react-toastify'
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
export default function Login() {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { aToken, setAToken, backendUrl } = useContext(AdminContext);
  console.log(backendUrl);
  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        console.log("hii");
        const {data} = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });
        console.log("data is...",data);
        if (data.success) {
            localStorage.setItem('aToken',data.token)
          setAToken(data.token)
        }else{
            toast.error(data.message)
        }
      } else {
      }
    } catch (error) {}
  };

  return (
    <form
      onSubmit={submitHandler}
      action=""
      className="min-h-[80vh] flex items-center "
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg ">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span>Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p> Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button className="bg-primary text-white w-full py-2 rouunded-md text-base ">
          LogIn
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
