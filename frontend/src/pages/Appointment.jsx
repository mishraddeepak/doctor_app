
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
export default function Appointment() {
  const { docId } = useParams();
  const location = useLocation();
  const {
    allData,
    getAllAppointments,
    doctors,
    currencySymbol,
    token,
    userID,
    backendUrl,
  } = useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTimes, setSlotTimes] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = current month
  const [symptoms, setSymptoms] = useState(location.state?.symptoms || "");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocInfo = () => {
    const doctor = doctors.find((doc) => doc.Id === docId);
    if (doctor) {
      setDocInfo(doctor);
    }
  };

  const getAvailableSlots = () => {
    let today = new Date();
    today.setMonth(today.getMonth() + selectedMonth);
  
    let slots = [];
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
    for (let day = 1; day <= daysInMonth; day++) {
      let currentDate = new Date(today.getFullYear(), today.getMonth(), day);
  
      // Skip past dates for the current month
      if (selectedMonth === 0 && currentDate < new Date()) {
        continue;
      }
  
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);
  
      if (day === today.getDate() && selectedMonth === 0) {
        currentDate.setHours(Math.max(10, currentDate.getHours() + 1));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }
  
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      slots.push(timeSlots);
    }
  
    setDocSlots(slots);
  };
  

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDateSelection = (index) => {
    setSlotIndex(index);
    const selectedSlot = docSlots[index][0]?.datetime;
    setSelectedDate(selectedSlot ? selectedSlot.toLocaleDateString() : "");
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
    setSlotIndex(0); // Reset the slot index when month changes
  };

  const handleSubmit = async () => {
    if (!symptoms) {
      alert("Please describe your symptoms");
      return;
    }
    const formData = new FormData();
    formData.append("doctorId", docId);
    formData.append("slotTime", slotTimes);
    formData.append("selectedDate", selectedDate);
    formData.append("symptoms", symptoms);
    formData.append("userID", userID);

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/book-appointment/${userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Appointment booked successfully:", response.data);
      alert("Appointment booked successfully!");
      getAllAppointments();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Please update your profile to book an appointment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo, selectedMonth]);

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt="Doctor"
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              {docInfo.degree}-{docInfo.speciality}
              <button className="py-0 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment Fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Section */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          {/* Month Selection */}
          <div className="mt-4">
            <p>Select Month</p>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border p-2 rounded-md"
            >
              <option value={0}>Current Month</option>
              <option value={1}>Next Month</option>
              <option value={2}>Month After Next</option>
            </select>
          </div>

          {/* Date Selection */}
          <p className="mt-4">Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.map((item, index) => (
              <div
                onClick={() => handleDateSelection(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-primary text-white"
                    : "border border-gray-200"
                }`}
                key={index}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
          </div>

          {/* Time Slot Selection */}
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots[slotIndex]?.map((item, index) => {
              const isBooked = allData.some(
                (appointment) =>
                  new Date(appointment.selectedDate).toLocaleDateString() ===
                    selectedDate &&
                  appointment.slotTime === item.time
              );

              return (
                <p
                  onClick={() => !isBooked && setSlotTimes(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTimes
                      ? "bg-primary text-white"
                      : isBooked
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              );
            })}
          </div>

          {/* Symptoms input */}
          <div className="mt-4">
            <p>Describe Your Symptoms</p>
            <textarea
              className="w-full p-3 border rounded-md"
              placeholder="Enter symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows="3"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className={`bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Booking..." : "Book an Appointment"}
          </button>
        </div>
      </div>
    )
  );
}
