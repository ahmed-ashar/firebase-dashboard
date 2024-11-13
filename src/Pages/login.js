import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../config/firebase/firebasefunction";
import { Button, Input } from "antd";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSignin = async (e) => {
    setLoading(true);
    try {
      await loginUser(formData);
      alert("Logged In");
      setLoading(false);
      navigate("/dashboard/userprofile");
    } catch (err) {
      alert("Error In Login");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <Input
              type="email"
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <Input
              type="password"
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="primary"
            className="w-full"
            onClick={handleSignin}
            loading={loading}
          >
            Login
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
