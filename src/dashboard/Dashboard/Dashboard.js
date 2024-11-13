import { Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../../config/firebase/firebasefunction";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full bg-gray-800 text-white shadow-2xl rounded-r-lg w-64">
        <div className="flex flex-col items-start space-y-4 mt-10 px-4 py-6">
          <button
            onClick={() => navigate("/dashboard/userprofile")}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg transition duration-200"
          >
            User Profile
          </button>
          <button
            onClick={() => navigate("/dashboard/posts")}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg transition duration-200"
          >
            Posts
          </button>
          <button
            onClick={() => navigate("/dashboard/comments")}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg transition duration-200"
          >
            Comments
          </button>
          <button
            onClick={() => navigate("/dashboard/albums")}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg transition duration-200"
          >
            Albums
          </button>
          <button
            onClick={() => navigate("/dashboard/photos")}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg transition duration-200"
          >
            Photos
          </button>
          <button
            onClick={() => navigate("/dashboard/todos")}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg transition duration-200"
          >
            Todos
          </button>
          <button

            onClick={handleLogout}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg transition duration-200"
          >
            LogOut
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 ml-64">
        <Outlet /> {/* Nested Routes Render Here */}
      </main>
    </div>
  );
}
