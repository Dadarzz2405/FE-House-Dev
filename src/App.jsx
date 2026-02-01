import { useState, useEffect } from "react";
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/navbar/navbar";

import HomePage from "./components/pages/HomePage/HomePage";
import LiveScores from "./components/pages/LiveScores/LiveScores";
import Announcement from "./components/pages/Announcements/Announcements";

const App = () => {
  const [activatedPage, setActivatedPage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    setActivatedPage(path);
  }, [location]);

  return (
    <>
      <Navbar activatedPage={activatedPage} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/livescores" element={<LiveScores />} />
        <Route path="/announcement" element={<Announcement />} />
      </Routes>
    </>
  );
};

export default App;