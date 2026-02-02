import { useState, useEffect } from "react";
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/navbar/navbar";

import HomePage from "./components/pages/HomePage/HomePage";
import LiveScores from "./components/pages/LiveScores/LiveScores";
import Announcement from "./components/pages/Announcements/Announcements";
import Login from "./components/pages/Login/Login";
import AdminDB from "./components/pages/AdminDashboard/AdminDashboard";
import CaptainDB from "./components/pages/CaptainDashboard/CaptainDashboard";
import CreateAnn from "./components/pages/CreateAnnouncemen/CreateAnnouncement";

const App = () => {
  const [activatedPage, setActivatedPage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    setActivatedPage(path);
  }, [location]);

  // Don't show navbar on login page
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      {showNavbar && <Navbar activatedPage={activatedPage} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/livescores" element={<LiveScores />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admindb" element={<AdminDB />} />
        <Route path="/captaindb" element={<CaptainDB />} />
        <Route path="/createann" element={<CreateAnn />} />
      </Routes>
    </>
  );
};

export default App;