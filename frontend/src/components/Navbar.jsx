// import React, { useContext, useState } from "react";
// import { assets } from "../assets/assets";
// import { NavLink, useNavigate } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { toast } from "react-toastify";
// export default function Navbar() {
//   const navigate = useNavigate();

//   const [showMenu, setShoMenu] = useState(false);
//   const { token, setToken,userID,setUserID } = useContext(AppContext);

//   const logout = () => {
//     setToken(false);
//     setUserID('')
//     localStorage.removeItem("userID");
//     localStorage.removeItem("token");
//     toast.success("Logged out successfully");
//     navigate("/");

//   };

//   return (
//     <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 ">
//       <img className="w-44 cursor-pointer" src={assets.logo} alt="" />
//       <ul className="hidden md:flex item-start gap-5 font-medium">
//         <NavLink to="/">
//           <li className="py-1 ">HOME</li>
//           <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//         </NavLink>
//         <NavLink to="/doctors">
//           <li className="py-1 ">ALL DOCTORS</li>
//           <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//         </NavLink>
//         <NavLink to="/about">
//           <li className="py-1 ">ABOUT</li>
//           <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//         </NavLink>
//         <NavLink to="/contact">
//           <li className="py-1 ">CONTACT</li>
//           <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//         </NavLink>
//       </ul>
//       <div className="flex items-center gap-4">
//         {token ? (
//           <div className="flex items-center gap-2 cursor-pointer group relative">
//             <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
//             <img className="w-2.5  " src={assets.dropdown_icon} alt="" />
//             <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
//               <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
//                 <p
//                   onClick={() => navigate("/my-profile")}
//                   className="hover:text-black cursor-pointer "
//                 >
//                   My Profile
//                 </p>
//                 <p
//                   onClick={() => navigate("/my-appointments")}
//                   className="hover:text-black cursor-pointer "
//                 >
//                   My Appointments
//                 </p>
//                 <p
//                   onClick={() => navigate("/book-appointment")}
//                   className="hover:text-black cursor-pointer "
//                 >
//                   Book Appointment
//                 </p>

//                 <p
//                   onClick={logout}
//                   className="hover:text-black cursor-pointer "
//                 >
//                   Log Out
//                 </p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <button
//             onClick={() => navigate("/login")}
//             className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block "
//           >
//             Create account
//           </button>
//         )}
//         <img
//           onClick={() => setShoMenu(true)}
//           className="w-6 md:hidden"
//           src={assets.menu_icon}
//           alt=""
//         />
//         {/*  mobile view*/}
//         <div
//           className={`${
//             showMenu ? "fixed w-full" : "h-0 w-0"
//           } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}
//         >
//           <div className="flex items-center justify-between px-5 py-6  ">
//             <img className="w-36" src={assets.logo} alt="" />
//             <img
//               className="w-7"
//               onClick={() => setShoMenu(false)}
//               src={assets.cross_icon}
//               alt=""
//             />
//           </div>
//           <ul className="flex items-center flex-col gap-2 mt-5 px-5 text-lg font-medium">
//             <NavLink onClick={() => setShoMenu(false)} to="/">
//               <p className="px-4 py-2 rounded  inline-block ">Home</p>
//             </NavLink>
//             <NavLink onClick={() => setShoMenu(false)} to="/doctors">
//               <p className="px-4 py-2 rounded  inline-block ">All Doctors</p>
//             </NavLink>
//             <NavLink onClick={() => setShoMenu(false)} to="/about">
//               <p className="px-4 py-2 rounded  inline-block ">Appointment</p>
//             </NavLink>
//             <NavLink onClick={() => setShoMenu(false)} to="/contact">
//               <p className="px-4 py-2 rounded  inline-block ">Contact</p>
//             </NavLink>
//             <NavLink className="bg-primary text-white px-8 py-3 rounded-full font-light" 
//             onClick={() =>{token?logout():setShoMenu(false)} } to='/login'
//            >
//             <p  >{token?'Log out':'Create account'}</p>
//             </NavLink>
           
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShoMenu] = useState(false);
  const { token, setToken,adminUrl, userID, setUserID } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    setUserID("");
    localStorage.removeItem("userID");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };
console.log(adminUrl)
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 ">
      <img className="w-44 cursor-pointer" src={assets.logo} alt="" />
      <ul className="hidden md:flex item-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1 ">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1 ">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1 ">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1 ">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer "
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer "
                >
                  My Appointments
                </p>
                <p
                  onClick={() => navigate("/book-appointment")}
                  className="hover:text-black cursor-pointer "
                >
                  Book Appointment
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer "
                >
                  Log Out
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            {/* Create Account Button */}
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block "
            >
              Create account
            </button>

            {/* Admin/Doctor Button */}
            <button
             onClick={() => window.open(adminUrl, "_self")}
             className="border border-primary text-primary bg-transparent px-3 py-1 rounded-full font-light text-xs hidden md:block"
            >
              Admin/Doctor
            </button>
          </div>
        )}
        <img
          onClick={() => setShoMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* Mobile View */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShoMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex items-center flex-col gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShoMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Home</p>
            </NavLink>
            <NavLink onClick={() => setShoMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">All Doctors</p>
            </NavLink>
            <NavLink onClick={() => setShoMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">Appointment</p>
            </NavLink>
            <NavLink onClick={() => setShoMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">Contact</p>
            </NavLink>
            <NavLink
              className="bg-primary text-white px-8 py-3 rounded-full font-light"
              onClick={() => {
                token ? logout() : setShoMenu(false);
              }}
              to="/login"
            >
              <p>{token ? "Log out" : "Create account"}</p>
            </NavLink>
            {/* Admin/Doctor Button in Mobile View */}
            <NavLink
              className="border border-primary text-primary bg-transparent px-6 py-2 rounded-full font-light text-sm"
              onClick={() => setShoMenu(false)}
              to="/admin-login"
            >
              <p>Admin/Doctor</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
}

