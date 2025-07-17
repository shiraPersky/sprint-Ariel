import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import MainPageUpload from "./pages/UploadPage/MainPageUpload";
import GroupDetailsPage from "./pages/GroupDetailsPage/GroupDetailsPage"
import UserSearchComponent from "./pages/Searchpage/UserSearchComponent";
// import UserProfileForm from "./pages/UserProfileForm"; 
import EventList from "./pages/EventPages/EventList";
import MainPageEditableUserProfile from "./pages/UserProfile/MainPageEditableUserProfile";
import "./pages/index.css"; 
import CvTemporaryPage from "./pages/cv/CvTemporaryPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cv-temp" element={<CvTemporaryPage />} />

       <Route path="/member/:id/data/" element={<MainPageEditableUserProfile />} />
       <Route path="/member/data/" element={<MainPageEditableUserProfile />} />

        <Route path="/UserSearch" element={<UserSearchComponent />} />
        {/* <Route path="/manager/group/:idGroup" element={<CommunityMembersPage />} /> */}
        <Route path="/member" element={<MainPageUpload />} />
        {/* <Route path="/sidebar" element={<Sidebar />} /> */}
        {/* <Route path="/manager/members/:id" element={<AdminViewUserProfile />} /> */}

        <Route path="/group/:groupId" element={<GroupDetailsPage />} />
        <Route path="/events" element={<EventList />} />

       {<Route path="/" element={<MainPageEditableUserProfile />} />}
        {/* <Route path="/member/data" element={<UploadData />} /> */}
         {/* <Route path="/" element={<Slider />} /> */}
        {/* <Route path="/manager/member" element={<UploadProfile />} /> */}
      {/* <Route path="/SearchPage" element={<SearchPage />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
