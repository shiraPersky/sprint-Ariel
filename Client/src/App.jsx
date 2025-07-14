import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminViewUserProfile from "./pages/AdminProfileUser";
// import Sidebar from "./pages/Sidebar";   

import UserProfileForm from "./pages/UserProfileForm";
// import UploadData from "./pages/UploadMemberData";
// import Slider from "./pages/Slider";

function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<UserProfileForm />} />
        {/* <Route path="/member/uploadData" element={<UploadData />} /> */}
         {/* <Route path="/" element={<AdminViewUserProfile userId={null} />} /> */}
        {/* <Route path="/member/id:/data/" element={<UserProfileForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
