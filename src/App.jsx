import { useState } from "react";
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/navbar/navbar";

import HomePage from "./components/pages/HomePage/HomePage";
import LiveScores from "./components/pages/LiveScores/LiveScores";
import Announcement from "./components/pages/Announcements/Announcements";
import Login from "./components/pages/Login/Login";

const App = () => {
  const [activatedPage, setActivatedPage] = useState("");
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    setActivatedPage(path);
  }, [location]);

  return (
    <>
      <Navbar activatedPage={activatedPage} />
      <Routes>
        <Route path="/" Component={HomePage}></Route>
        <Route path="/livescores" Component={LiveScores}></Route>
        <Route path="/announcement" Component={Announcement}></Route>
        <Route path="/login" Component={Login}></Route>
      </Routes>
    </>
  );
};

export default App;
