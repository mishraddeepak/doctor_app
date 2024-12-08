
import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
export default function AddDoctor() {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [isHeadDoctor, setIsHeadDoctor] = useState(false);


  const { backendUrl,aToken } = useContext(AdminContext);
  console.log("backendurl", backendUrl);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setDocImg(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      // formData.append("docImg", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address1", address1);
      formData.append("address2", address2);
      formData.append("isHeadDoctor", isHeadDoctor);
      formData.forEach((value, key) => {

        console.log("form elements are...", `${key}:${value}`);
      });

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      console.log("data is",data)
      if (data.success) {
        toast.success(data.message);
        setDocImg(null);
      setName("");
      setEmail("");
      setPassword("");
      setExperience("1 Year");
      setFees("");
      setAbout("");
      setSpeciality("General Physician");
      setDegree("");
      setAddress1("");
      setAddress2("");
      setIsHeadDoctor(false);
      }else{
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  return (
    <form className="m-5 w-full" onSubmit={handleSubmit}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-scroll">
        <div>
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Doctor"
            />
          </label>
          <input
            className="border rounded px-3 py-2"
            type="file"
            id="doc-img"
            hidden
            onChange={handleFileChange}
          />
          <p>
            Upload doctor
            <br /> picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                className="border rounded px-3 py-2"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {[...Array(10).keys()].map((i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                className="border rounded px-3 py-2"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Pediatricians">Pediatricians</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Education"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <p className="mt-4 mb-2">About</p>
          <textarea
            className="w-full px-4 pt-2 border rounded"
            placeholder="Write about the doctor"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
         {/* Head Doctor Checkbox */}
         <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="is-head-doctor"
            checked={isHeadDoctor}
            onChange={(e) => setIsHeadDoctor(e.target.checked)}
          />
          <label htmlFor="is-head-doctor" className="text-sm">
            Make Head Doctor
          </label>
        </div>
        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
}
