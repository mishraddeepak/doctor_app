import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function MyAppointments() {
  const { doctors, backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to show a loading message
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  
  const userID = localStorage.getItem("userID");
  // Function to fetch appointments from the backend
  const fetchData = async () => {
    try {
      // Adding a cache-busting timestamp to prevent any cached responses
      const response = await axios.get(
        `${backendUrl}/api/user/information/${userID}?timestamp=${new Date().getTime()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response Data:", response.data.data);

      // Sorting appointments by selectedDate and slotTime
      const sortedAppointments = response.data.data.appointments.sort(
        (a, b) => {
          const dateA = new Date(`${a.selectedDate} ${a.slotTime}`);
          const dateB = new Date(`${b.selectedDate} ${b.slotTime}`);
          return dateA - dateB; // Ascending order
        }
      );
      setAppointments(sortedAppointments); // Update state with sorted appointments
      setLoading(false); // Set loading to false when data is loaded
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false in case of an error
    }
  };
  useEffect(() => {
    fetchData();
  }, [backendUrl, userID, token]);
  const handleCancel = async (appointmentId) => {
    try {
      const appointmentDetails = { status: "Canceled" };
      const { data } = await axios.post(
        `${backendUrl}/api/admin/appointment-status/${appointmentId}`,
        appointmentDetails
      );
      // Provide feedback to the user
      alert("Appointment successfully canceled!");
      fetchData();
    } catch (error) {
      console.error("Error canceling the appointment:", error);
      alert("Failed to cancel the appointment. Please try again.");
    }
  };
  // Function to toggle the expanded/collapsed state of an appointment
  const handleRebook = (appointment) => {
    console.log("appointment....",appointment)
    // Navigate to the booking page with pre-filled symptoms and other data
    navigate("/book-appointment", { state: { symptoms: appointment.symptoms, docId: appointment.docId } });
  };
  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // If data is still loading, show a loading message
  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.length === 0 ? (
          <p>No appointments available</p>
        ) : (
          appointments.map((item, index) => (
            <div
              key={index}
              className={`relative border rounded-lg p-4 mb-4 transition-all duration-300 ${
                expandedIndex === index ? "shadow-lg" : "shadow-sm"
              }`}
            >
              <div className="absolute sm:top-1/2 sm:right-4 transform sm:-translate-y-1/2 sm:flex sm:flex-col sm:gap-4 top-2 right-2 flex flex-col gap-2">
                <button className="text-sm text-stone-500 px-4 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                  Pay Online
                </button>
                <button
                  onClick={() => handleCancel(item._id)}
                  disabled={(item.status === "Canceled" || item.status === "Completed")}
                  className={`text-sm text-stone-500 px-4 py-2 border rounded ${
                    (item.status === "Canceled"|| item.status === "Completed")
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "hover:bg-red-600 hover:text-white"
                  } transition-all duration-300`}
                >
                  
                  {item.status === "Canceled"
                    ? "Canceled"
                    : "Cancel Appointment"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
                {/* Doctor Image */}
                <div>
                  <img
                    className="bg-indigo w-32 rounded-md"
                    src="https://via.placeholder.com/150"
                    alt="Doctor"
                  />
                </div>

                {/* Basic Details */}
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold">
                    Doctor: {item.docName || "Doctor Name"}
                  </p>
                  <p className="text-xs mt-1 font-semibold">
                    <span className="text-sm text-neutral-700 font-medium">
                      Appointment:
                    </span>{" "}
                    {item.slotTime} | {item.selectedDate}
                  </p>
                  <p className="text-xs mt-2 font-semibold">
                    <span className="text-sm text-neutral-700 font-medium">
                      Booked At:
                    </span>{" "}
                    {new Date(item.bookedAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    | {new Date(item.bookedAt).toLocaleDateString("en-US")}
                  </p>

                  {/* Appointment Status Section */}
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Canceled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Status: {item.status || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expandable Section */}
              {expandedIndex === index && (
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="bg-gray-50 p-1 rounded-md">
                      <h2 className="font-semibold text-gray-700 inline-block mr-2">
                        Doctor:
                      </h2>
                      <span className="text-sm text-gray-600">
                        {item.docName}
                      </span>
                    </div>
                  </div>
                  {/* Symptoms */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="bg-gray-50 p-1 rounded-md">
                      <h2 className="font-semibold text-gray-700 inline-block mr-2">
                        Symptoms:
                      </h2>
                      <span className="text-sm text-gray-600">
                        {item.symptoms}
                      </span>
                    </div>
                  </div>

                  {/* Prescriptions */}
                  <div className="bg-gray-50 p-4">
                    <p className="font-semibold text-gray-700">
                      Prescriptions:
                    </p>
                    <table className="table-auto border-collapse border border-gray-300 w-1/2 text-sm">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 max-w-[200px]">
                            Medicine
                          </th>
                          <th className="border border-gray-300 px-4 py-2 max-w-[200px]">
                            Dose
                          </th>
                          <th className="border border-gray-300 px-4 py-2 max-w-[200px]">
                            Timing
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.prescriptions.map((prescription) => (
                          <tr key={prescription._id}>
                            <td className="border border-gray-300 px-4 py-2 max-w-[200px]">
                              <span>{prescription.medicine}</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 max-w-[200px]">
                              <span>{prescription.dose}</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 max-w-[200px]">
                              <span>{prescription.timing}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Instructions Section */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-semibold text-gray-700">Instructions:</p>
                    <p className="text-sm text-gray-600">
                      {item.instruction
                        ? item.instruction
                        : "No instruction available"}
                    </p>
                  </div>

                  {/* Follow-Up Date Section */}
                  {item.followUpDate && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="font-semibold text-gray-700">
                        Follow-Up Date:
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.followUpDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Additional Notes Section */}
                  {item.additionalNotes && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="font-semibold text-gray-700">
                        Additional Notes:
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.additionalNotes}
                      </p>
                    </div>
                  )}

                  {/* Redirect for Canceled Appointments */}
                  {item.status === "Canceled" && (
                    <div className="bg-gray-50 p-4 flex flex-col justify-center items-center rounded-md">
                      <p className="font-semibold text-gray-700">
                        Need to rebook?
                      </p>
                      <button
                       onClick={() => handleRebook(item)}
                        className="text-sm text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded mt-2 transition-all duration-300"
                      >
                        Book Again
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Expand/Collapse Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => toggleExpand(index)}
                  className="text-sm font-medium text-gray-500 hover:text-primary transition-all duration-300"
                >
                  {expandedIndex === index ? "▲ Collapse" : "▼ Expand"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyAppointments;
