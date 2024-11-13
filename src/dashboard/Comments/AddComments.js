import React, { useState } from "react";
import { db, auth } from "../../config/firebase/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

export default function AddComments() {
  const [username, setUsername] = useState("");
  const [commentText, setCommentText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Check if a user is logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user);
      setUsername(user.displayName || user.email);
    } else {
      setCurrentUser(null);
    }
  });

  // Handle form submission to add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (commentText && currentUser) {
      try {
        await addDoc(collection(db, "comments"), {
          userId: currentUser.uid,
          username,
          text: commentText,
          createdAt: new Date(),
        });

        setCommentText(""); // Clear the comment input
        navigate("/dashboard/comments"); // Redirect to comments page
      } catch (e) {
        console.error("Error adding comment: ", e);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Add a Comment</h2>
      </nav>

      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Comment</h3>
          <form onSubmit={handleAddComment}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="username">
                Your Name
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={username}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="commentText">
                Your Comment
              </label>
              <textarea
                id="commentText"
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="4"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
