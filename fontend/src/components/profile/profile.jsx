import React, { useState, useEffect } from "react";
import "../profile/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profilePhoto, setProfilePhoto] = useState("https://via.placeholder.com/150");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { user, profile } = response.data;
        setEmail(user.email);
        setUserName(user.name);
        setGender(profile.gender);
        setLocation(profile.location);
        setProfilePhoto(profile.profile_photo ? `http://127.0.0.1:8000/storage/${profile.profile_photo}` : "https://via.placeholder.com/150");
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);
    setProfilePhotoFile(file);
  };

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", userName);
    formData.append("gender", gender);
    formData.append("location", location);
    if (profilePhotoFile) {
      formData.append("profile_photo", profilePhotoFile);
    }

    axios
      .post("http://127.0.0.1:8000/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Profile updated successfully");
        navigate("/chat");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="profile">
      <div className="card" style={{ width: "24rem" }}>
        <div className="card-body">
          <div className="profile-photo text-center">
            <img src={profilePhoto} className="mb-3" alt="Profile Photo" id="profilePhoto" />
            <div className="camera-icon" onClick={() => document.getElementById("fileInput").click()}>
              <i className="bi bi-camera"></i>
            </div>
            <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange} />
          </div>
          <div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder={email}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput2" className="form-label">User Name</label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput2"
                placeholder={userName}
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput3" className="form-label">Gender</label>
              <select
                className="form-select"
                id="exampleFormControlInput3"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput4" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput4"
                placeholder={location}
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="text-center">
            <button type="button" className="btn btn-danger" onClick={handleSubmit}>Save details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
