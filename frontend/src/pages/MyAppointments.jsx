import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

function MyAppointments() {
  const { doctors, userID, backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/user/information/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Sort appointments by selectedDate and slotTime
        const sortedAppointments = response.data.data.appointments.sort(
          (a, b) => {
            const dateA = new Date(`${a.selectedDate} ${a.slotTime}`);
            const dateB = new Date(`${b.selectedDate} ${b.slotTime}`);
            return dateA - dateB; // Ascending order
          }
        );

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [backendUrl, userID, token]);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => (
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
              <button className="text-sm text-stone-500 px-4 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">
                Cancel Appointment
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
                  {item.doctorName || "Doctor Name"}
                </p>
                <p>{item.speciality || "Speciality"}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.address?.line1 || "Line 1"}</p>
                <p className="text-xs">{item.address?.line2 || "Line 2"}</p>
                <p className="text-xs mt-1 font-semibold">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  {item.slotTime} | {item.selectedDate}
                </p>
                {/* Booking Date Section */}
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
                  {/* Prescription Section */}
                  <p className="font-semibold text-gray-700">Prescription:</p>
                  <div className="space-y-2">
                    {item.medications && item.medications.length > 0 ? (
                      item.medications.map((med, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="font-medium text-gray-800">
                            {med.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Dosage:</strong> {med.dosage}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Frequency:</strong> {med.frequency}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Duration:</strong> {med.duration}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No medications listed.
                      </p>
                    )}
                  </div>
                </div>
                {/* Symptoms Section */}
                {item.symptoms && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-semibold text-gray-700">Symptoms:</p>
                    <p className="text-sm text-gray-600">{item.symptoms}</p>
                  </div>
                )}
                {/* Instructions Section */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold text-gray-700">Instructions:</p>
                  <p className="text-sm text-gray-600">{item.instructions}</p>
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
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;
