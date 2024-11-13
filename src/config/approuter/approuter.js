import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../../Pages/Home";
import Login from "../../Pages/login";
import Signup from "../../Pages/signup";
import Dashboard from "../../dashboard/Dashboard/Dashboard";
import Posts from "../../dashboard/Posts/Posts";
import UserProfile from "../../dashboard/User/UserProfile";
import CommentsPage from "../../dashboard/Comments/comments";
import AddComments from "../../dashboard/Comments/AddComments";
import Albums from "../../dashboard/Albums/Albums";
import AddAlbumPage from "../../dashboard/Albums/AddAlbumPage";
import Photos from "../../dashboard/Photos/Photos";
import AddPhoto from "../../dashboard/Photos/AddPhoto";
import Todos from "../../dashboard/Todos/Todos";
import AddPost from "../../dashboard/Posts/AddPostPage";
// import Dashboard from "./Dashboard";
// import Posts from "../../dashboard/Posts";
// import UserProfile from "../../dashboard/UserProfile";
// import Comments from "../../dashboard/comments";
// import Albums from "../../dashboard/Albums";
// import Photos from "../../dashboard/Photos";
// import Todos from "../../dashboard/Todos";
// import Login from "../../Pages/login";
// import Signup from "../../Pages/signup";
// import AddPostPage from "../../dashboard/AddPostPage";
// import AddComments from "../../dashboard/AddComments";
// import AddAlbumPage from "../../dashboard/AddAlbumPage";
// import AddPhoto from "../../dashboard/AddPhoto";
// import Home from "../../Pages/Home";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Route with Nested Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="posts" element={<Posts />} />
          <Route path="posts/add-post" element={<AddPost />} /> {/* Moved outside "Posts" */}
          <Route path="userprofile" element={<UserProfile />} />
          <Route path="comments" element={<CommentsPage />} />
          <Route path="comments/add-comments" element={<AddComments />} />
          <Route path="albums" element={<Albums />} />
          <Route path="albums/add-albums" element={<AddAlbumPage />} />
          <Route path="photos" element={<Photos />} />
          <Route path="photos/add-photo" element={<AddPhoto />} />
          <Route path="todos" element={<Todos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
