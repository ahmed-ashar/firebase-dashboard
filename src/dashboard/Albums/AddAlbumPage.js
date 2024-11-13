import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage, db } from "../../config/firebase/firebaseconfig"; // Import Firebase config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../../config/firebase/firebaseconfig"; // Firebase Authentication

export default function AddAlbumPage() {
  const [title, setTitle] = useState(""); // Manage album title input
  const [description, setDescription] = useState(""); // Manage album description input
  const [imageFile, setImageFile] = useState(null); // Manage image file input
  const [imagePreview, setImagePreview] = useState(""); // Image preview URL for display
  const navigate = useNavigate();

  // Handle image file selection and create a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get selected file
    if (file) {
      setImageFile(file); // Store the file object
      setImagePreview(URL.createObjectURL(file)); // Generate temporary URL for preview
    }
  };

  // Handle form submission to add a new album
  const handleAddAlbum = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (title && description && imageFile) {
      try {
        // Step 1: Upload the image to Firebase Storage
        const storageRef = ref(storage, `album-covers/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        // Wait for image upload to complete
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress if needed (optional)
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            // Step 2: Get the image URL after upload is complete
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

            // Step 3: Add the album data to Firestore
            const albumData = {
              title,
              description,
              image: imageUrl, // Save image URL
              userId: auth.currentUser.uid, // Associate the album with the current logged-in user
              createdAt: new Date(),
            };

            // Add album data to Firestore
            const albumsCollection = collection(db, "albums");
            await addDoc(albumsCollection, albumData);

            // After successfully adding the album, navigate back to the albums page
            navigate("/dashboard/albums");
          }
        );
      } catch (error) {
        console.error("Error adding album:", error);
        alert("There was an error adding the album. Please try again.");
      }
    } else {
      alert("Please fill in all fields and upload an image.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Add New Album</h2>
      </nav>

      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Enter Album Details</h3>
          <form onSubmit={handleAddAlbum}>
            {/* Album Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="title">
                Album Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Album Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="description">
                Album Description
              </label>
              <textarea
                id="description"
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Image Upload Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="image">
                Upload Album Cover Image
              </label>
              <input
                type="file"
                id="image"
                className="w-full p-2 border border-gray-300 rounded-lg"
                accept="image/*" // Only accept image files
                onChange={handleImageChange}
                required
              />
              {/* Display image preview */}
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Album Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Add Album
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
