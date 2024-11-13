import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../config/firebase/firebaseconfig";
import { getDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

export default function AddPhoto() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid; // Get current user's UID
      if (userId) {
        try {
          const userDoc = doc(db, "users", userId); // Firestore document reference
          const userSnapshot = await getDoc(userDoc); // Fetch document data
          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data()); // Set user data
          } else {
            console.error("No user data found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  // Handle adding a photo
  const handleAddPhoto = async () => {
    if (!title || !image) {
      alert("Please provide a title and select an image.");
      return;
    }

    if (!userData) {
      alert("User data is not loaded yet. Please try again in a moment.");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `photos/${auth.currentUser.uid}/${Date.now()}`);
      await uploadBytes(imageRef, image); // Upload the image
      const imageURL = await getDownloadURL(imageRef); // Get the image URL

      // Save photo details in Firestore
      const photoData = {
        userId: auth.currentUser.uid,
        title,
        image: imageURL,
        userName: userData.name || "Unknown User", // Default to avoid undefined
        userFname: userData.fname || "Unknown Fname", // Default to avoid undefined
        userProfilePic: userData.photo || null, // Handle missing profile pic
        createdAt: new Date(), // Add a timestamp
      };

      await addDoc(collection(db, "photos"), photoData); // Save photo data

      alert("Photo added successfully!");
      navigate("/dashboard/photos"); // Navigate back to Photos page
    } catch (error) {
      console.error("Error adding photo:", error);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Add Photo</h2>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          onClick={() => navigate("/photos")}
        >
          Back to Photos
        </button>
      </nav>

      <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
        <h3 className="text-lg font-bold mb-4">Add a New Photo</h3>
        <input
          type="text"
          placeholder="Enter photo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddPhoto}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Photo
        </button>
      </div>
    </div>
  );
}
