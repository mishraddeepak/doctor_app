// import React, { useContext, useEffect, useState } from "react";
// import { AdminContext } from "../../context/AdminContext";
// import { assets } from "../../assets/assets";
// import axios from "axios";

// export default function AllAppointments() {
//   const {
//     aToken,
//     doctors,
//     completeData,
//     getAllDoctors,
//     getAllAppointments,
//     backendUrl,
//   } = useContext(AdminContext);

//   const [expandedIndex, setExpandedIndex] = useState(null);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);

//   useEffect(() => {
//     getAllDoctors();
//   }, []);

//   useEffect(() => {
//     if (aToken) {
//       getAllAppointments();
//     }
//   }, [aToken]);

//   const toggleExpand = (index) => {
//     setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
//   };

//   const handleSubmit = async (appointmentId) => {
//     if (!selectedDoctor) {
//       alert("Please select a doctor.");
//       return;
//     }

//     const fee = document.getElementById(`fee-${appointmentId}`).value;
//     const status = document.getElementById(`status-${appointmentId}`).value;

//     try {
//       console.log({
//         appointmentId: appointmentId,
//         status,
//         docId: selectedDoctor._id,
//         doctorName: selectedDoctor.name,
//         doctorFee: fee || selectedDoctor.fees,
//       });
//       // Send status, doctor _id, doctor name, and doctor fee to the backend
//       await axios.post(
//         `${backendUrl}/api/admin/appointment-status/${appointmentId}`,
//         {
//           appointmentId,
//           status,
//           docId: selectedDoctor._id,
//           doctorName: selectedDoctor.name,
//           doctorFee: fee || selectedDoctor.fees,
//         },
//         {
//           headers: { Authorization: `Bearer ${aToken}` },
//         }
//       );
//       alert("Appointment details updated successfully!");
//       getAllAppointments(); // Refresh the appointments list
//     } catch (error) {
//       console.error("Error updating appointment details:", error);
//       alert("Failed to update appointment details.");
//     }
//   };

//   let serialNumber = 1;

//   // Sorting function to sort by selectedDate and slotTime
//   const sortAppointments = (appointments) => {
//     return appointments.sort((a, b) => {
//       // First compare selectedDate
//       const dateA = new Date(a.selectedDate);
//       const dateB = new Date(b.selectedDate);
//       if (dateA < dateB) return -1;
//       if (dateA > dateB) return 1;

//       // If dates are the same, compare slotTime
//       const timeA = a.slotTime;
//       const timeB = b.slotTime;
//       if (timeA < timeB) return -1;
//       if (timeA > timeB) return 1;

//       return 0; // Return 0 if both are equal
//     });
//   };

//   return (
//     <div className="w-full max-w-6xl m-5">
//       <p className="mb-3 text-lg font-medium">All Appointments</p>
//       <div className="bg-white border-rounded min-h-[60vh] text-sm max-h-[80vh] overflow-y-scroll">
//         {/* Table Headers */}
//         <div className="grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr] py-3 px-6 border-b text-center sm:text-left">
//           <p className="hidden sm:block">#</p>
//           <p>Patient</p>
//           <p>Age</p>
//           <p>Date & Time</p>
//           <p>Actions</p>
//         </div>

//         {/* Table Data */}
//         {completeData.map((patient, patientIndex) => (
//           <div key={patient._id}>
//             {/* Sort the appointments before rendering */}
//             {sortAppointments(patient.appointments).map((appointment, appointmentIndex) => {
//               const rowIndex = `${patientIndex}-${appointmentIndex}`;
//               return (
//                 <div
//                   key={appointment._id}
//                   className="grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr] py-3 px-6 border-b hover:bg-gray-200 text-center sm:text-left"
//                 >
//                   {/* Serial Number */}
//                   <p className="hidden sm:block">{serialNumber++}</p>

//                   {/* Patient Name */}
//                   <div className="flex items-center gap-2 justify-center sm:justify-start">
//                     <p>{patient.name}</p>
//                   </div>

//                   {/* Age */}
//                   <p>
//                     {patient.dob
//                       ? new Date().getFullYear() -
//                         new Date(patient.dob).getFullYear() -
//                         (new Date().setMonth(
//                           new Date().getMonth(),
//                           new Date(patient.dob).getDate()
//                         ) < new Date()
//                           ? 0
//                           : 1)
//                       : "N/A"}
//                   </p>

//                   {/* Date & Time */}
//                   <p>
//                     {appointment.selectedDate}, {appointment.slotTime}
//                   </p>

//                   {/* Actions */}
//                   <div className="flex items-center justify-center sm:justify-start gap-2">
//                     <button
//                       onClick={() => toggleExpand(rowIndex)}
//                       className="text-sm font-medium text-gray-500 hover:text-primary transition-all duration-300"
//                     >
//                       {expandedIndex === rowIndex ? "▲ Collapse" : "▼ Expand"}
//                     </button>
//                   </div>

//                   {/* Expandable Section */}
//                   {expandedIndex === rowIndex && (
//                     <div className="col-span-full mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
//                       {/* Appointment Details */}
//                       <div className="mb-4">
//                         <p className="font-medium">
//                           Symptoms: <span>{appointment.symptoms}</span>
//                         </p>
//                         <p className="font-medium">
//                           Booking Status:
//                           <span
//                             className={`${
//                               appointment.status === "Pending"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : appointment.status === "Accepted"
//                                 ? "bg-green-100 text-green-700"
//                                 : appointment.status === "Completed"
//                                 ? "bg-green-100 text-green-700"
//                                 : appointment.status === "Canceled"
//                                 ? "bg-red-100 text-red-700"
//                                 : ""
//                             }`}
//                           >
//                             {appointment.status}
//                           </span>
//                         </p>
//                         <p className="font-medium">
//                           Additional Details:{" "}
//                           <span>
//                             {appointment.details ||
//                               "No additional details provided."}
//                           </span>
//                         </p>
//                       </div>

//                       {/* Doctor Selection */}
//                       <label className="block mb-2 font-medium">Doctor:</label>
//                       <select
//                         className="w-full sm:w-auto p-2 border rounded-md"
//                         onChange={(e) => {
//                           const doctor = doctors.find(
//                             (doctor) => doctor._id === e.target.value
//                           );
//                           setSelectedDoctor(doctor); // Set the selected doctor
//                           if (doctor) {
//                             document.getElementById(
//                               `fee-${appointment._id}`
//                             ).value = doctor.fees;
//                           }
//                         }}
//                       >
//                         <option value="" disabled>
//                           Select a doctor
//                         </option>
//                         {doctors.map((doctor) => (
//                           <option key={doctor._id} value={doctor._id}>
//                             {doctor.name} ({doctor.speciality})
//                           </option>
//                         ))}
//                       </select>

//                       {/* Editable Fee */}
//                       <label className="block mt-4 mb-2 font-medium">
//                         Fee:
//                       </label>
//                       <input
//                         type="number"
//                         id={`fee-${appointment._id}`}
//                         className="w-full p-2 border rounded-md"
//                         placeholder="Enter fee"
//                         defaultValue={appointment.fee || ""}
//                       />

//                       {/* Appointment Status Update */}
//                       <div className="mt-4">
//                         <label className="block mb-2 font-medium">
//                           Update Appointment Status:
//                         </label>
//                         <div className="flex items-center gap-4">
//                           <select
//                             className="p-2 border rounded-md"
//                             id={`status-${appointment._id}`}
//                           >
//                             <option value="">Select status</option>
//                             <option value="Pending">Pending</option>
//                             <option value="Accepted">Accepted</option>
//                             <option value="Completed">Completed</option>
//                             <option value="Canceled">Canceled</option>
//                           </select>
//                         </div>
//                       </div>

//                       {/* Submit Button */}
//                       <div className="mt-4 text-center">
//                         <button
//                           onClick={() => handleSubmit(appointment._id)}
//                           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
//                         >
//                           Save Changes
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import axios from "axios";

export default function AllAppointments() {
  const {
    aToken,
    doctors,
    completeData,
    getAllDoctors,
    getAllAppointments,
    backendUrl,
  } = useContext(AdminContext);

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    getAllDoctors();
  }, []);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSubmit = async (appointmentId) => {
    if (!selectedDoctor) {
      alert("Please select a doctor.");
      return;
    }

    const fee = document.getElementById(`fee-${appointmentId}`).value;
    const status = document.getElementById(`status-${appointmentId}`).value;

    try {
      console.log({
        appointmentId: appointmentId,
        status,
        docId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
        doctorFee: fee || selectedDoctor.fees,
      });

      // Send status, doctor _id, doctor name, and doctor fee to the backend
      await axios.post(
        `${backendUrl}/api/admin/appointment-status/${appointmentId}`,
        {
          appointmentId,
          status,
          docId: selectedDoctor._id,
          doctorName: selectedDoctor.name,
          doctorFee: fee || selectedDoctor.fees,
        },
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );

      alert("Appointment details updated successfully!");
      getAllAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error("Error updating appointment details:", error);
      alert("Failed to update appointment details.");
    }
  };

  let serialNumber = 1;

  // Sorting function to sort by selectedDate and slotTime
  const sortAppointments = (appointments) => {
    return appointments.sort((a, b) => {
      const dateA = new Date(a.selectedDate);
      const dateB = new Date(b.selectedDate);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      const timeA = a.slotTime;
      const timeB = b.slotTime;
      if (timeA < timeB) return -1;
      if (timeA > timeB) return 1;

      return 0;
    });
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border-rounded min-h-[60vh] text-sm max-h-[80vh] overflow-y-scroll">
        {/* Table Headers */}
        <div className="grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] py-3 px-6 border-b text-center sm:text-left">
          <p className="hidden sm:block">Sr. No.</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        {/* Table Data */}
        {completeData.map((patient, patientIndex) => (
          <div key={patient._id}>
            {sortAppointments(patient.appointments).map((appointment, appointmentIndex) => {
              const rowIndex = `${patientIndex}-${appointmentIndex}`;
              return (
                <div
                  key={appointment._id}
                  className="grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] py-3 px-6 border-b hover:bg-gray-200 text-center sm:text-left"
                >
                  <p className="hidden sm:block">{serialNumber++}</p>

                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <p>{patient.name}</p>
                  </div>

                  <p>
                    {patient.dob
                      ? new Date().getFullYear() -
                        new Date(patient.dob).getFullYear() -
                        (new Date().setMonth(
                          new Date().getMonth(),
                          new Date(patient.dob).getDate()
                        ) < new Date()
                          ? 0
                          : 1)
                      : "N/A"}
                  </p>

                  <p>
                    {appointment.selectedDate}, {appointment.slotTime}
                  </p>

                  {/* Appointment Status */}
                  <p
                    className={`${
                      appointment.status === "Pending"
                        ? "text-yellow-600"
                        : appointment.status === "Accepted"
                        ? "text-green-600"
                        : appointment.status === "Completed"
                        ? "text-blue-600"
                        : appointment.status === "Canceled"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {appointment.status}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <button
                      onClick={() => toggleExpand(rowIndex)}
                      className="text-sm font-medium text-gray-500 hover:text-primary transition-all duration-300"
                    >
                      {expandedIndex === rowIndex ? "▲ Collapse" : "▼ Expand"}
                    </button>
                  </div>

                  {/* Expandable Section */}
                  {expandedIndex === rowIndex && (
                    <div className="col-span-full mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                      <div className="mb-4">
                        <p className="font-medium">
                          Symptoms: <span>{appointment.symptoms}</span>
                        </p>
                        <p className="font-medium">
                          Additional Details:{" "}
                          <span>
                            {appointment.details || "No additional details provided."}
                          </span>
                        </p>
                      </div>

                      {/* Doctor Selection */}
                      <label className="block mb-2 font-medium">Doctor:</label>
                      <select
                        className="w-full sm:w-auto p-2 border rounded-md"
                        onChange={(e) => {
                          const doctor = doctors.find(
                            (doctor) => doctor._id === e.target.value
                          );
                          setSelectedDoctor(doctor);
                          if (doctor) {
                            document.getElementById(`fee-${appointment._id}`).value = doctor.fees;
                          }
                        }}
                      >
                        <option value="" disabled>
                          Select a doctor
                        </option>
                        {doctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.name} ({doctor.speciality})
                          </option>
                        ))}
                      </select>

                      <label 
                      className="block mt-4 mb-2 font-medium"

                      >Fee:</label>
                      <input
                        className="w-full sm:w-auto p-2 border rounded-md"

                        type="number"
                        id={`fee-${appointment._id}`}
                        // className="w-full p-2 border rounded-md"
                        placeholder="Enter fee"
                        defaultValue={appointment.fee || ""}
                      />

                      <div className="mt-4">
                        <label className="block mb-2 font-medium">
                          Update Appointment Status:
                        </label>
                        <div className="flex items-center gap-4">
                          <select
                            className="p-2 border rounded-md"
                            id={`status-${appointment._id}`}
                          >
                            <option value="">Select status</option>
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          onClick={() => handleSubmit(appointment._id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
