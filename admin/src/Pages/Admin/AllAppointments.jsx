import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
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
  const [selectedFiles, setSelectedFiles] = useState({}); // Tracks selected files for each appointment
  const [expandedDropdown, setExpandedDropdown] = useState(null); // Track which dropdown is open

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

  const toggleFileDropdown = (appointmentId) => {
    setExpandedDropdown((prev) =>
      prev === appointmentId ? null : appointmentId
    );
  };

  // const handleFileSelection = (appointmentId, fileName) => {
  //   setSelectedFiles((prevState) => {
  //     const prevFiles = prevState[appointmentId] || [];
  //     const updatedFiles = prevFiles.includes(fileName)
  //       ? prevFiles.filter((file) => file !== fileName) // Remove file
  //       : [...prevFiles, fileName]; // Add file
  // console.log("fie section")
  //     // If no files are selected, remove the key for the appointment
  //     if (updatedFiles.length === 0) {
  //       const { [appointmentId]: _, ...remainingState } = prevState;
  //       return remainingState;
  //     }

  //     return {
  //       ...prevState,
  //       [appointmentId]: updatedFiles,
  //     };
  //   });
  // };

  const handleFileSelection = (appointmentId, fileId) => {
    setSelectedFiles((prevState) => {
      const prevFiles = prevState[appointmentId] || [];
      const updatedFiles = prevFiles.includes(fileId)
        ? prevFiles.filter((file) => file !== fileId) // Remove file by ID
        : [...prevFiles, fileId]; // Add file by ID

      // If no files are selected, remove the key for the appointment
      if (updatedFiles.length === 0) {
        const { [appointmentId]: _, ...remainingState } = prevState;
        return remainingState;
      }

      return {
        ...prevState,
        [appointmentId]: updatedFiles,
      };
    });
  };

  // const handleSubmit = async (appointmentId) => {
  //   const fee = document.getElementById(`fee-${appointmentId}`).value;
  //   const status = document.getElementById(`status-${appointmentId}`).value;

  //   if ((!selectedDoctor || !selectedDoctor.name || !selectedDoctor._id) && status !== 'Canceled') {
  //     alert("Please select a doctor.");
  //     return;
  //   }

    
  //   // Get the appointment details
  //   const appointment = completeData
  //     .flatMap((patient) => patient.appointments)
  //     .find((app) => app._id === appointmentId);

  //   // Ensure the appointment exists
  //   if (!appointment) {
  //     alert("Appointment not found.");
  //     return;
  //   }

  //   // Find the corresponding patient for the appointment
  //   const patient = completeData.find((patient) =>
  //     patient.appointments.some((app) => app._id === appointmentId)
  //   );

  //   // Ensure the patient exists
  //   if (!patient) {
  //     alert("Patient not found.");
  //     return;
  //   }

  //   // Extract patient details
  //   const patientDetails = {
  //     _id: patient.userId, // Patient's userId (unique identifier)
  //     name: patient.name || "Unknown",
  //     email: patient.email || "Unknown",
  //     phone: patient.phone || "Unknown",
  //     address: patient.address || { line1: "Unknown", line2: "Unknown" },
  //     gender: patient.gender || "Unknown",
  //     dob: patient.dob || "Unknown",
  //     // selectedFiles: selectedFiles[appointmentId] || [], // Optional file selection
  //   };
  //   console.log("selected doctor", selectedDoctor);
  //   // Prepare appointment info
  //   const appointmentDetails = {
  //     appointmentId,
  //     status,
  //     docName: selectedDoctor?.name || '',
  //     docId: selectedDoctor?._id ||'507f1f77bcf86cd799439011',
  //     docFee: fee || selectedDoctor?.fees || 0,
  //     details: appointment.details || "No additional details provided.",
  //     selectedFiles: selectedFiles[appointmentId] || [], // Optional file selection
  //   };
  //   console.log("Appointment Details:", appointmentDetails);
  //   try {
  //     // First API request to update appointment details
  //     const { data } = await axios.post(
  //       `${backendUrl}/api/admin/appointment-status/${appointmentId}`,
  //       appointmentDetails
  //     );
  //     console.log(data);
  //     // Second API request to send patient and appointment info
  //     await axios.post(
  //       `${backendUrl}/api/admin/assign-doctor/${selectedDoctor._id}`,
  //       {
  //         patient: patientDetails,
  //         appointmentDetails,
  //       }
  //     );
  //     console.log("hii");
  //     alert("Appointment and patient details updated successfully!");
  //     getAllAppointments(); // Refresh the appointments list
  //   } catch (error) {
  //     console.error(
  //       "Error updating appointment or sending patient info:",
  //       error
  //     );
  //     alert("Failed to update appointment or send patient info.");
  //   }
  // };

  const handleSubmit = async (appointmentId) => {
    const fee = document.getElementById(`fee-${appointmentId}`).value;
    const status = document.getElementById(`status-${appointmentId}`).value;
  
    // Ensure a doctor is selected only when the status is not 'Canceled'
    if ((!selectedDoctor || !selectedDoctor.name || !selectedDoctor._id) && status !== 'Canceled') {
      alert("Please select a doctor.");
      return;
    }
  
    // Get the appointment details
    const appointment = completeData
      .flatMap((patient) => patient.appointments)
      .find((app) => app._id === appointmentId);
  
    if (!appointment) {
      alert("Appointment not found.");
      return;
    }
  
    const patient = completeData.find((patient) =>
      patient.appointments.some((app) => app._id === appointmentId)
    );
  
    if (!patient) {
      alert("Patient not found.");
      return;
    }
  
    const patientDetails = {
      _id: patient.userId,
      name: patient.name || "Unknown",
      email: patient.email || "Unknown",
      phone: patient.phone || "Unknown",
      address: patient.address || { line1: "Unknown", line2: "Unknown" },
      gender: patient.gender || "Unknown",
      dob: patient.dob || "Unknown",
    };
  
    // Use a dummy doctor ID for 'Canceled' status
    const appointmentDetails = {
      appointmentId,
      status,
      docName: status === 'Canceled' ? '' : selectedDoctor?.name || '',
      docId: status === 'Canceled' ? '507f1f77bcf86cd799439011' : selectedDoctor?._id,
      docFee: status === 'Canceled' ? 0 : fee || selectedDoctor?.fees || 0,
      details: appointment.details || "No additional details provided.",
      selectedFiles: selectedFiles[appointmentId] || [],
    };
  
    console.log("Appointment Details:", appointmentDetails);
  
    try {
      // Update appointment details
      const { data } = await axios.post(
        `${backendUrl}/api/admin/appointment-status/${appointmentId}`,
        appointmentDetails
      );
      console.log(data);
  
      // Only assign a doctor if the status is not 'Canceled'
      if (status !== 'Canceled' && selectedDoctor && selectedDoctor._id) {
        await axios.post(
          `${backendUrl}/api/admin/assign-doctor/${selectedDoctor._id}`,
          {
            patient: patientDetails,
            appointmentDetails,
          }
        );
      }
  
      alert("Appointment and patient details updated successfully!");
      getAllAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error("Error updating appointment or sending patient info:", error);
      alert("Failed to update appointment or send patient info.");
    }
  };
  
  let serialNumber = 1;

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
  console.log("completeDatais", completeData);
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
            {sortAppointments(patient.appointments).map(
              (appointment, appointmentIndex) => {
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
                            new Date(patient.dob).getMonth(),
                            new Date(patient.dob).getDate()
                          ) < new Date()
                            ? 0
                            : 1)
                        : "N/A"}
                    </p>

                    <p>
                      {appointment.selectedDate}, {appointment.slotTime}
                    </p>

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

                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <button
                        onClick={() => toggleExpand(rowIndex)}
                        className="text-sm font-medium text-gray-500 hover:text-primary transition-all duration-300"
                      >
                        {expandedIndex === rowIndex ? "▲ Collapse" : "▼ Expand"}
                      </button>
                    </div>

                    {expandedIndex === rowIndex && (
                      <div className="col-span-full mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                        <div className="mb-4">
                          <p className="font-medium">
                            Symptoms: <span>{appointment.symptoms}</span>
                          </p>
                          {/* <p className="font-medium">
                            Additional Details:{" "}
                            <span>
                              {appointment.details ||
                                "No additional details provided."}
                            </span>
                          </p> */}
                        </div>

                        {/* Assigned Doctor And Fee */}
                        <div className="mb-4 ">
                          <p className="font-medium">
                            Assigned Doctor: <span className="text-sm">{appointment.docName|| "Doctor Not Yet assigned"}</span>
                          </p>
                          <p className="font-medium">
                            Appointment Fee:
                            <span>
                              {appointment.docFee  ||
                                "No  provided."}
                            </span>
                          </p >
                        </div>

                        {/* File Selection with Dropdown */}
                        <div className="mt-4">
                          <label className="block mb-2 font-medium">
                            Available Reports:
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              className="w-full sm:w-auto p-2 border rounded-md bg-white text-gray-700"
                              onClick={() =>
                                toggleFileDropdown(appointment._id)
                              }
                            >
                              {selectedFiles[appointment._id]?.length > 0
                                ? `${
                                    selectedFiles[appointment._id].length
                                  } Report(s) selected`
                                : "Select Reports (optional)"}
                            </button>

                            {expandedDropdown === appointment._id && (
                              <div className="absolute mt-2 w-full sm:w-auto max-h-40 overflow-y-auto border rounded-md bg-white shadow-lg z-10">
                                {patient.uploadedFiles &&
                                patient.uploadedFiles.length > 0 ? (
                                  <ul className="p-2">
                                    {patient.uploadedFiles.map((file) => (
                                      <li
                                        key={file._id}
                                        className="flex items-center gap-2"
                                      >
                                        <input
                                          type="checkbox"
                                          className="form-checkbox"
                                          checked={(
                                            selectedFiles[appointment._id] || []
                                          ).includes(file._id)}
                                          onChange={() =>
                                            handleFileSelection(
                                              appointment._id,
                                              file._id
                                            )
                                          }
                                        />
                                        <label>
                                          {file.fileName}
                                          <a
                                            href={`${backendUrl}/middlewares/${file.filePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 text-sm hover:underline mx-3"
                                          >
                                            View
                                          </a>
                                        </label>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="p-2 text-gray-500">
                                    No Reports available for this appointment.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Doctor Selection and Fee */}
                        <div className="mt-4">
                          <label className="block font-medium">Doctor</label>
                          <select
                            value={selectedDoctor?.name || ""}
                            onChange={(e) => {
                              const doctor = doctors.find(
                                (doc) => doc.name === e.target.value
                              );
                              setSelectedDoctor(doctor);
                            }}
                            className="p-2 border rounded-md w-full sm:w-auto"
                          >
                            <option value="" disabled>
                              Select a doctor
                            </option>
                            {doctors.map((doctor) => (
                              <option key={doctor._id} value={doctor.name}>
                                {doctor.name} ({doctor.speciality})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status and Fee */}
                        <div className="mt-4 flex gap-4">
                          <div className="w-1/2">
                            <label className="block font-medium">Status</label>
                            <select
                              id={`status-${appointment._id}`}
                              className="p-2 border rounded-md w-full"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Completed">Completed</option>
                              <option value="Canceled">Canceled</option>
                            </select>
                          </div>

                          <div className="w-1/2">
                            <label className="block font-medium">
                              Doctor Fee
                            </label>
                            <input
                              id={`fee-${appointment._id}`}
                              type="number"
                              className="p-2 border rounded-md w-full"
                              defaultValue={selectedDoctor?.fees || ""}
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4 flex gap-4">
                          <button
                            onClick={() => handleSubmit(appointment._id)}
                            className="px-4 py-2 text-white bg-green-600 rounded-md"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
