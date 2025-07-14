import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminViewUserProfile from "./pages/AdminProfileUser";
<<<<<<< Updated upstream
// import Sidebar from "./pages/Sidebar";   

=======
import Sidebar from "./pages/Sidebar";   
import UploadData from "./pages/UploadMemberData";
import UserSearchComponent from "./pages/SearchPage";
>>>>>>> Stashed changes
import UserProfileForm from "./pages/UserProfileForm";
import CommunityMembersPage from "./pages/CommunityPage";


function App() {
  return (
    <Router>
      <Routes>
<<<<<<< Updated upstream
       <Route path="/" element={<UserProfileForm />} />
        {/* <Route path="/member/uploadData" element={<UploadData />} /> */}
         {/* <Route path="/" element={<AdminViewUserProfile userId={null} />} /> */}
        {/* <Route path="/member/id:/data/" element={<UserProfileForm />} /> */}
=======

       <Route path="/member/id:/data/" element={<UserProfileForm />} />
        <Route path="/UserSearch" element={<UserSearchComponent />} />
       <Route path="/manager/group/:idGroup" element={<CommunityMembersPage />} />
        <Route path="/member" element={<UploadData />} />
         <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/manager/members/:id" element={<AdminViewUserProfile />} />
    
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;
