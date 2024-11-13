import React, { useState, useEffect } from "react";
import { db, auth, storage } from '../../config/firebase/firebaseconfig'; // Firebase setup import
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore"; // Firestore imports
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage imports
import { useNavigate } from "react-router-dom";

// Firebase Firestore imports
 // Firebase Storage import

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [editPost, setEditPost] = useState(null); // Store the post being edited
  const [editedContent, setEditedContent] = useState(""); // Store updated content
  const [editedImage, setEditedImage] = useState(null); // Store the updated image
  const [loading, setLoading] = useState(false); // Handle loading state
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchPosts = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        return;
      }

      try {
        const postsCollection = collection(db, "posts");
        const postsQuery = query(postsCollection, where("userId", "==", userId));
        const querySnapshot = await getDocs(postsQuery);

        const fetchedPosts = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ ...doc.data(), id: doc.id });
        });
        setLoading(false);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts(posts.filter((post) => post.id !== postId)); // Update the UI
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Handle image upload to Firebase Storage
  const handleImageUpload = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `postImages/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // Handle edit post submission
  const handleEditPost = async () => {
    setLoading(true); // Set loading state to true
    try {
      let imageUrl = editPost.image;
      if (editedImage) {
        imageUrl = await handleImageUpload(editedImage);
      }

      await updateDoc(doc(db, "posts", editPost.id), { 
        content: editedContent, 
        image: imageUrl 
      });

      // After the update, fetch the updated posts again to reflect changes
      const postsCollection = collection(db, "posts");
      const querySnapshot = await getDocs(postsCollection);
      const updatedPosts = [];
      querySnapshot.forEach((doc) => {
        updatedPosts.push({ ...doc.data(), id: doc.id });
      });

      setPosts(updatedPosts); // Update posts state with the latest data
      setEditPost(null); // Close the edit form
      setEditedContent(""); // Clear the input
      setEditedImage(null); // Clear the image
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <p className="text-gray-600 text-lg">Loading...</p>
  </div>
  }
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold">Your Posts</h2>
        <button
          onClick={() => navigate("add-post")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add New Post
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            {/* Post Image */}
            <img
              src={post.image || "https://via.placeholder.com/150"}
              alt="Post Image"
              className="w-full h-48 object-cover rounded mb-4"
            />

            {/* Post Title */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {post.title}
            </h3>

            {/* Post Content */}
            <p className="text-gray-700 mb-4">{post.content}</p>

            {/* Post Actions */}
            <div className="flex items-center justify-between text-gray-500">
              <button
                onClick={() => {
                  setEditPost(post); // Open the edit form
                  setEditedContent(post.content); // Pre-fill with current content
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePost(post.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Post Modal */}
      {editPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Post</h3>
            
            {/* Post Content Textarea */}
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              rows="4"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            ></textarea>

            {/* Image Upload */}
            <input
              type="file"
              onChange={(e) => setEditedImage(e.target.files[0])}
              className="mb-4"
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditPost(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                disabled={loading} // Disable the button when loading
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
