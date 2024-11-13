import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../config/firebase/firebaseconfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Selected photo for editing
  const [newImage, setNewImage] = useState(null); // New image file
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      const userId = auth.currentUser?.uid; // Get current user's UID
      if (!userId) {
        console.log("User not authenticated");
        return;
      }

      try {
        const photosRef = collection(db, "photos");
        const userPhotosQuery = query(photosRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(userPhotosQuery);

        if (querySnapshot.empty) {
          console.log("No photos found for the user.");
          setPhotos([]); // No photos found, clear the array
          return;
        }

        const userPhotos = [];
        querySnapshot.forEach((doc) => {
          userPhotos.push({ id: doc.id, ...doc.data() });
        });
        setLoading(false);
        setPhotos(userPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleDelete = async (photoId) => {
    try {
      await deleteDoc(doc(db, "photos", photoId));
      setPhotos(photos.filter((photo) => photo.id !== photoId)); // Update UI
      alert("Photo deleted successfully!");
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo.");
    }
  };

  const handleEdit = (photo) => {
    setEditMode(true);
    setSelectedPhoto(photo);
    setNewImage(null); // Reset the new image file
  };

  const handleSaveEdit = async () => {
    try {
      let imageUrl = selectedPhoto.image; // Default to the existing image URL

      // Upload new image if a file is selected
      if (newImage) {
        const imageRef = ref(storage, `photos/${newImage.name}`);
        const snapshot = await uploadBytes(imageRef, newImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Update the photo document in Firestore
      const photoRef = doc(db, "photos", selectedPhoto.id);
      await updateDoc(photoRef, {
        title: selectedPhoto.title,
        image: imageUrl,
      });

      // Update UI with the updated photo details
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === selectedPhoto.id
            ? { ...photo, title: selectedPhoto.title, image: imageUrl }
            : photo
        )
      );
      setEditMode(false);
      setSelectedPhoto(null);
      alert("Photo updated successfully!");
    } catch (error) {
      console.error("Error updating photo:", error);
      alert("Failed to update photo.");
    }
  };
  const [loading, setLoading] = useState(true);
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <p className="text-gray-600 text-lg">Loading...</p>
  </div>
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Photos</h2>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          onClick={() => navigate("add-photo")}
        >
          Add Photo
        </button>
      </nav>

      <div className="p-6">
        {editMode ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">Edit Photo</h3>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Title:
            </label>
            <input
              type="text"
              value={selectedPhoto.title}
              onChange={(e) =>
                setSelectedPhoto({ ...selectedPhoto, title: e.target.value })
              }
              className="w-full p-2 border rounded-lg mb-4"
            />
            <label className="block mb-2 text-sm font-medium text-gray-600">
              New Image (Optional):
            </label>
            <input
              type="file"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setSelectedPhoto(null);
                }}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {photos.length === 0 ? (
              <p className="text-gray-600">No photos found. Add some photos!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                  >
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {photo.title}
                    </h3>
                    <p className="text-sm text-gray-600">{photo.userName}</p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEdit(photo)}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
