import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import AdminViewUserProfile from "./pages/AdminProfileUser";
// import Sidebar from "./pages/Sidebar";   
import UserProfileForm from "./pages/SearchPage";
import UploadData from "./pages/UploadMemberData";
import Slider from "./pages/Slider";
import './pages/index.css';
import SearchPage from "./pages/SearchPage"

import UserProfileForm from "./pages/UserProfileForm";
// import UploadData from "./pages/UploadMemberData";
// import Slider from "./pages/Slider";

function App() {
  return (
    <Router>
      <Routes>

       {<Route path="/" element={<UserProfileForm />} />}
        {/* <Route path="/member/data" element={<UploadData />} /> */}
         {/* <Route path="/" element={<Slider />} /> */}
        {/* <Route path="/manager/member" element={<UploadProfile />} /> */}
      <Route path="/SearchPage" element={<SearchPage />} />

      </Routes>
    </Router>
  );
}

export default App;
