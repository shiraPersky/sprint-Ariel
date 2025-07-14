import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import AdminViewUserProfile from "./pages/AdminProfileUser";


import Sidebar from "./pages/Sidebar";   
import UploadData from "./pages/UploadMemberData";
import UserSearchComponent from "./pages/SearchPage";

import UserProfileForm from "./pages/UserProfileForm";
import CommunityMembersPage from "./pages/CommunityPage";


function App() {
  return (
    <Router>
      <Routes>


       <Route path="/member/id:/data/" element={<UserProfileForm />} />
        <Route path="/UserSearch" element={<UserSearchComponent />} />
       <Route path="/manager/group/:idGroup" element={<CommunityMembersPage />} />
        <Route path="/member" element={<UploadData />} />
         <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/manager/members/:id" element={<AdminViewUserProfile />} />


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
