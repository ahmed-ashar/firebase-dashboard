// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Dashboard from "./dashboard/Dashboard/Dashboard";
// import Posts from "./dashboard/Posts/Posts";
// import AddPostPage from "./dashboard/Posts/AddPostPage";
// import Albums from "./dashboard/Albums/Albums";
// import Photos from "./dashboard/Photos/Photos";
// import CommentsPage from "./dashboard/Comments/comments";
// import Todos from "./dashboard/Todos/Todos";
// import UserProfile from "./dashboard/User/UserProfile";
// import Home from "./Pages/Home";
// import Login from "./Pages/login";
// import Signup from "./Pages/signup";
// import AddComments from "./dashboard/Comments/AddComments";
// import AddAlbumPage from "./dashboard/Albums/AddAlbumPage";
// import AddPhoto from "./dashboard/Photos/AddPhoto";
import AppRouter from "./config/approuter/approuter";

function App() {
  return (
    <AppRouter />
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/signup" element={<Signup />} />
    //     <Route path="/dashboard" element={<Dashboard />}>
    //       <Route path="posts" element={<Posts />} />
    //       <Route path="posts/add-post" element={<AddPostPage />} />
    //       <Route path="userprofile" element={<UserProfile />} />
    //       <Route path="comments" element={<CommentsPage />} />
    //       <Route path="comments/add-comments" element={<AddComments />} />
    //       <Route path="albums" element={<Albums />} />
    //       <Route path="albums/add-albums" element={<AddAlbumPage />} />
    //       <Route path="photos" element={<Photos />} />
    //       <Route path="photos/add-photo" element={<AddPhoto />} />
    //       <Route path="todos" element={<Todos />} />
    //     </Route>
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
