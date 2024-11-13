import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../config/firebase/firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function CommentsPage() {
  const { postId } = useParams(); // Access the post ID from the URL parameter
  const [comments, setComments] = useState([]); // Store the comments
  const [currentUser, setCurrentUser] = useState(null); // Store the logged-in user
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Fetch the logged-in user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  // Fetch comments from Firestore
  useEffect(() => {
    const fetchComments = async () => {
      if (currentUser) {
        try {
          const commentsQuery = query(
            collection(db, "comments"),
            where("userId", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(commentsQuery);
          const userComments = querySnapshot.docs.map((doc) => doc.data());
          setComments(userComments); 
          setLoading(false);// Update state with the user's comments
        } catch (e) {
          console.error("Error fetching comments:", e);
        }
      }
    };

    fetchComments();
  }, [currentUser]);
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <p className="text-gray-600 text-lg">Loading...</p>
  </div>
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Comments for Post {postId}</h2>
        <div>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            onClick={() => navigate("add-comments")}
          >
            Add Comment
          </button>
        </div>
      </nav>

      <div className="p-6">
        {/* Comments Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {comments.length === 0 ? (
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-200 py-4">
                <p className="font-semibold text-gray-800">{comment.username}</p>
                <p className="text-gray-600 mt-2">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
