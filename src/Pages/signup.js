import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../config/firebase/firebasefunction";
import { Button, Input } from "antd";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        photo: file,
      }));
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const user = await signUpUser(formData);
      console.log("User signed up:", user);
      alert("You are Successfully Signed Up!");
      setLoading(false);
      navigate("/dashboard/userprofile");
    } catch (err) {
      alert("Sign up failed:");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg w-[480px] shadow-lg ">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <div className="flex justify-between content-between">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mx-[10px]">
                  Full Name
                </label>
                <Input
                  type="text"
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mx-[10px]">
                  User Name
                </label>
                <Input
                  type="text"
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                  }}
                  placeholder="Enter your User name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mx-[10px]">Email</label>
                <Input
                  type="email"
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mx-[10px]">
                  Password
                </label>
                <Input
                  type="password"
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="w-[200px]">
              <div className="mb-4">
                <label className="block text-gray-700 mx-[10px]">Website</label>
                <Input
                  type="text"
                  onChange={(e) => {
                    setFormData({ ...formData, website: e.target.value });
                  }}
                  placeholder="Enter your website URL"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mx-[10px]">Gender</label>
                <select
                  name="gender"
                  onChange={(e) => {
                    setFormData({ ...formData, gender: e.target.value });
                  }}
                  className="w-full p-1 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mx-[10px]">Phone</label>
                <Input
                  type="number"
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                  }}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="mb-1">
                <label className="w-full text-gray-700 mx-[10px]">
                  Profile Photo
                </label>
                <Input type="file" onChange={handlePhotoChange} />
              </div>
            </div>
          </div>
          <Button
            type="primary"
            className="w-full"
            onClick={handleSignUp}
            loading={loading}
          >
            Sign Up
          </Button>

          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <a href="/LogIn" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
