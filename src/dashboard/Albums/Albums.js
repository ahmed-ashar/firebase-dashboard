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

export default function Albums() {
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Selected album for editing
  const [newImage, setNewImage] = useState(null); // New image file for album
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      const userId = auth.currentUser?.uid; // Get current user's UID
      if (!userId) {
        console.log("User not authenticated");
        return;
      }

      try {
        const albumsRef = collection(db, "albums");
        const userAlbumsQuery = query(albumsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(userAlbumsQuery);

        if (querySnapshot.empty) {
          console.log("No albums found for the user.");
          setAlbums([]); // No albums found, clear the array
          return;
        }

        const userAlbums = [];
        querySnapshot.forEach((doc) => {
          userAlbums.push({ id: doc.id, ...doc.data() });
        });
        setLoading(false)
        setAlbums(userAlbums);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setLoading(false)
      }
    };

    fetchAlbums();
  }, []);

  const handleDelete = async (albumId) => {
    try {
      await deleteDoc(doc(db, "albums", albumId));
      setAlbums(albums.filter((album) => album.id !== albumId)); // Update UI
      alert("Album deleted successfully!");
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("Failed to delete album.");
    }
  };

  const handleEdit = (album) => {
    setEditMode(true);
    setSelectedAlbum(album);
    setNewImage(null); // Reset the new image file
  };

  const handleSaveEdit = async () => {
    try {
      let imageUrl = selectedAlbum.image; // Default to the existing image URL

      // Upload new image if a file is selected
      if (newImage) {
        const imageRef = ref(storage, `albums/${newImage.name}`);
        const snapshot = await uploadBytes(imageRef, newImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Update the album document in Firestore
      const albumRef = doc(db, "albums", selectedAlbum.id);
      await updateDoc(albumRef, {
        title: selectedAlbum.title,
        image: imageUrl,
      });

      // Update UI with the updated album details
      setAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album.id === selectedAlbum.id
            ? { ...album, title: selectedAlbum.title, image: imageUrl }
            : album
        )
      );
      setEditMode(false);
      setSelectedAlbum(null);
      alert("Album updated successfully!");
    } catch (error) {
      console.error("Error updating album:", error);
      alert("Failed to update album.");
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <p className="text-gray-600 text-lg">Loading...</p>
  </div>
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Albums</h2>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          onClick={() => navigate("add-album")}
        >
          Add Album
        </button>
      </nav>

      <div className="p-6">
        {editMode ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">Edit Album</h3>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Title:
            </label>
            <input
              type="text"
              value={selectedAlbum.title}
              onChange={(e) =>
                setSelectedAlbum({ ...selectedAlbum, title: e.target.value })
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
                  setSelectedAlbum(null);
                }}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {albums.length === 0 ? (
              <p className="text-gray-600">No albums found. Add some albums!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                  >
                    <img
                      src={album.image}
                      alt={album.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {album.title}
                    </h3>
                    <p className="text-sm text-gray-600">{album.userName}</p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEdit(album)}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(album.id)}
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
