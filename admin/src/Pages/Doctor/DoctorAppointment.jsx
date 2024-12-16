import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

export default function AllAppointmentsUI() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const id = localStorage.getItem("dUserId");
  const { getDoctorDetails, docProfile, backendUrl } =
    useContext(DoctorContext);

  const [prescriptions, setPrescriptions] = useState([]);
  const [instruction, setInstruction] = useState("");
  const [updatedPresc, setUpdatedPresc] = useState([]);
  const [prescSubmitted, setPrescSubmitted] = useState(false);
  
  useEffect(() => {
    getDoctorDetails();
  }, []);

  const toggleView = (patientId) => {
    const filteredAppointment = docProfile?.doctor?.appointments.filter(
      (item) => item.patientId === patientId
    );
    console.log(filteredAppointment);
    console.log("filteredArray", filteredAppointment);

    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (id) {
      const getAllData = async () => {
        try {
          const { data } = await axios.get(
            `${backendUrl}/api/doctor/getallappointments/${id}`
          );
          console.log("hiii", data);
          if (data.success) {
            const allAppointmentsList = data.doctorAppointments
              .flatMap((patient) => {
                return patient.appointments.map((appointment) => ({
                  ...appointment,
                  patientId: patient._id,
                  patientName: patient.name,
                  patientEmail: patient.email, // Added email
                  patientDob: patient.dob,
                }));
              })
               // Sort all appointments globally by date and time
            const sortedAppointments = allAppointmentsList.sort((a, b) => {
              const dateComparison = new Date(a.selectedDate) - new Date(b.selectedDate);
              if (dateComparison !== 0) return dateComparison; // Sort by date first
              return a.slotTime.localeCompare(b.slotTime); // Then sort by time
            });
            const groupedAppointments = data.doctorAppointments.map(
              (patient) => {
                const patientAppointments = sortedAppointments.filter(
                  (appointment) => appointment.patientId === patient._id
                );
                return {
                  ...patient,
                  appointments: patientAppointments,
                };
              }
            );
            setAllAppointments(groupedAppointments);
          } else {
            alert("Error in Loading Data");
          }
        } catch (error) {
          console.error("Error fetching appointments:", error);
          alert("No appointments Found");
        }
      };
      getAllData();
    }
  }, [id, backendUrl,prescSubmitted, prescriptions, instruction]);

  const toggleExpand = (rowIndex) => {
    setExpandedIndex((prevIndex) => (prevIndex === rowIndex ? null : rowIndex));
  };

  const addPrescriptionRow = () => {
    setPrescriptions((prevPrescriptions) => [
      ...prevPrescriptions,
      { medicine: "", dose: "" },
    ]);
  };

  const removePrescriptionRow = (index) => {
    setPrescriptions((prevPrescriptions) =>
      prevPrescriptions.filter((_, i) => i !== index)
    );
  };

  const handlePrescriptionChange = (index, field, value) => {
    setPrescriptions((prevPrescriptions) => {
      const newPrescriptions = [...prevPrescriptions];
      newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };
      return newPrescriptions;
    });
  };

  const handleSubmit = async (patientId, appointmentId) => {
    const prescriptionData = {
      prescriptions,
      instruction,
      appointmentId,
    };

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-prescription/${patientId}`,
        prescriptionData
      );
      setUpdatedPresc(data);
      setPrescSubmitted(!prescSubmitted);
      if (data.success) {
        console.log(data.updatedAppointment);
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
    }
  };

  // Filtering logic for search
  const filteredAppointments = allAppointments.map((patient) => {
    const filteredPatientAppointments = patient.appointments.filter(
      (appointment) =>
        appointment.patientName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        appointment.patientEmail
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    return { ...patient, appointments: filteredPatientAppointments };
  });

  let serialNumber = 1;
  console.log("helloo", filteredAppointments);
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

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

        {/* Filtered Table Data */}
        {filteredAppointments.map((patient, patientIndex) =>
          patient.appointments.length > 0 ? (
            <div key={patient._id}>
              {patient.appointments.map((appointment, appointmentIndex) => {
                const rowIndex = `${patientIndex}-${appointmentIndex}`;
                return (
                  <React.Fragment key={appointment._id}>
                    <div className="grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] py-3 px-6 border-b hover:bg-gray-200 text-center sm:text-left">
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
                          {expandedIndex === rowIndex
                            ? "▲ Collapse"
                            : "▼ Expand"}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Section */}
                    {expandedIndex === rowIndex && (
                      <div className="col-span-full mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                        <div className="mb-4">
                          <p className="font-medium">
                            Contact No:{" "}
                            <span>
                              {patient.phone ||
                                "No additional details provided."}
                            </span>
                          </p>
                          <p className="font-medium">
                            Symptoms: <span>{appointment.symptoms}</span>
                          </p>
                          {/* Reports */}
                          <div>
                            <p className="font-medium">
                              Reports:{" "}
                              <span
                                onClick={() => toggleView(patient._id)}
                                className="text-blue-500 cursor-pointer hover:underline"
                              >
                                View
                              </span>
                            </p>

                            {isOpen && (
                              <div className="mt-4 border p-4 rounded-md bg-gray-100 shadow-md">
                                <h3 className="text-lg font-bold mb-2">
                                  Reports
                                </h3>
                                {appointment.patientReports &&
                                appointment.patientReports.length > 0 ? (
                                  <ul className="list-disc pl-6">
                                    {appointment.patientReports.map(
                                      (report, index) => (
                                        <li key={index} className="mb-1">
                                          <a
                                            href={`${backendUrl}/middlewares/${report.filePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                          >
                                            {report.fileName}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500">
                                    No reports available.
                                  </p>
                                )}
                                {/* Close Button */}
                                <button
                                  onClick={toggleView}
                                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                  Close
                                </button>
                              </div>
                            )}
                          </div>
                          {/* Already given prescription */}
                          {appointment.prescriptions.length > 0 && (
                            <div className="mt-4">
                              <p className="font-medium text-sm">
                                Prescription:
                              </p>
                              <table className="mt-2 w-full table-auto text-sm border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="border-b px-4 py-2">
                                      Medicine
                                    </th>
                                    <th className="border-b px-4 py-2">Dose</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {appointment.prescriptions.map(
                                    (prescription, index) => (
                                      <tr
                                        key={index}
                                        className="hover:bg-gray-100"
                                      >
                                        <td className="border-b px-4 py-2">
                                          {prescription.medicine}
                                        </td>
                                        <td className="border-b px-4 py-2">
                                          {prescription.dose}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* Already Given Instruction */}
                          {appointment?.instruction?.length > 0 && (
                            <p className="font-medium">
                              Instructions:{" "}
                              <span>{appointment.instruction}</span>
                            </p>
                          )}

                          {/* Prescription Table */}
                          {!prescSubmitted && (
                            <div className="mt-4">
                              <p className="font-medium text-sm">
                                Prescription:
                              </p>
                              <table className="mt-2 w-full table-auto text-sm border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="border-b px-4 py-2">
                                      Medicine
                                    </th>
                                    <th className="border-b px-4 py-2">Dose</th>
                                    <th className="border-b px-4 py-2">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {prescriptions.map((prescription, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-100"
                                    >
                                      <td className="border-b px-4 py-2">
                                        <input
                                          type="text"
                                          value={prescription.medicine}
                                          onChange={(e) =>
                                            handlePrescriptionChange(
                                              index,
                                              "medicine",
                                              e.target.value
                                            )
                                          }
                                          className="w-full border px-2 py-1"
                                        />
                                      </td>
                                      <td className="border-b px-4 py-2">
                                        <input
                                          type="text"
                                          value={prescription.dose}
                                          onChange={(e) =>
                                            handlePrescriptionChange(
                                              index,
                                              "dose",
                                              e.target.value
                                            )
                                          }
                                          className="w-full border px-2 py-1"
                                        />
                                      </td>
                                      <td className="border-b px-4 py-2">
                                        <button
                                          onClick={() =>
                                            removePrescriptionRow(index)
                                          }
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <button
                                onClick={addPrescriptionRow}
                                className="text-sm text-blue-600 hover:underline mt-4"
                              >
                                + Add Medicine
                              </button>
                            </div>
                          )}

                          {/* Instruction Text Area */}
                          {!prescSubmitted && (
                            <div className="mt-4">
                              <p className="font-medium text-sm mb-2">
                                Instructions:
                              </p>
                              <textarea
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                                rows="4"
                                className="w-full border px-3 py-2 rounded-md"
                                placeholder="Add any instructions for the patient..."
                              ></textarea>
                            </div>
                          )}

                          {!prescSubmitted && (
                            <div className="mt-4">
                              <button
                                onClick={() =>
                                  handleSubmit(patient._id, appointment._id)
                                }
                                className="bg-primary text-white p-2 rounded-md"
                              >
                                Submit Prescription
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
