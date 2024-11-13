import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "antd";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const Authentication = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => Authentication();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Dashboard Practice</h1>
        <Button onClick={() => navigate("/login")} type="primary">
          Login
        </Button>
      </nav>

      <div className="flex-grow relative flex items-center justify-center px-6 bg-gray-100">
        <div className="relative text-center py-12 px-8 bg-white rounded-lg shadow-lg backdrop-blur-md">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Welcome to My Dashboard!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Manage your projects effortlessly in a seamless and user-friendly
            environment.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Get started today by exploring exciting features, collaborating with
            others, and achieving your goals!
          </p>
          <Button
            onClick={() => navigate(user ? "/dashboard" : "/login")}
            type="primary"
          >
            {user ? "Go To Dashboard" : "Login First"}
          </Button>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-4 text-center">
        <p className="text-sm">
          &copy; 2024 Developed by Muhammad Ahmed. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
