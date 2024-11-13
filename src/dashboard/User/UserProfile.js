import React, { useState, useEffect } from "react";
import { auth } from "../../config/firebase/firebaseconfig";
import { dataGet } from "../../config/firebase/firebasefunction";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const fetchUserData = async () => {
    const userId = auth.currentUser?.uid;

    if (userId) {
      try {
        const fetchedData = await dataGet("users", userId);
        if (fetchedData) {
          setUser(fetchedData);
        }
      } catch (error) {
        alert("Error fetching user data");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold">User Profile</h2>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex items-center space-x-6">
          <img
            src={user.photo || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-300"
          />
          <div>
            <h3 className="font-semibold text-2xl">
              {user.name || "Not Available"}
            </h3>
            <p className="text-gray-500 text-lg">
              {user.username || "Not Available"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">Gender:</h3>
            <p>{user.gender || "Not Available"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">Email:</h3>
            <p>{user.email || "Not Available"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">Phone Number:</h3>
            <p>{user.phone || "Not Available"}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">Website:</h3>
            <p>{user.website || "Not Available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
