import React, { useState } from "react";
import { db, auth, storage } from '../../config/firebase/firebaseconfig'; // Import Firebase setup
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);  // State to store the file
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);  // Store the selected file
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const userId = auth.currentUser?.uid;  // Get the current user's UID

    if (!userId) {
      alert("Please log in to post!");
      return;
    }

    try {
      let imageUrl = null;
      if (imageFile) {
        // Create a reference to Firebase Storage
        const imageRef = ref(storage, `posts/${userId}-${Date.now()}-${imageFile.name}`);

        // Upload the image file
        const snapshot = await uploadBytes(imageRef, imageFile);

        // Get the image URL after upload
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Save post data to Firestore
      const postRef = doc(db, "posts", `${userId}-${Date.now()}`);
      await setDoc(postRef, {
        title,
        content,
        image: imageUrl, // Save the image URL
        userId,
        createdAt: new Date(),
      });

      // After posting, navigate to Posts page
      navigate("/dashboard/posts");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Post</h2>
        <form onSubmit={handlePostSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="content">Content</label>
            <textarea
              id="content"
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={handleImageUpload}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Submit Post
          </button>
        </form>
      </div>
    </div>
  );
}
