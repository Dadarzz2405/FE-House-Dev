import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/navbar";

import HomePage from "./components/pages/HomePage/HomePage";
import LiveScores from "./components/pages/LiveScores/LiveScores";
import Announcement from "./components/pages/Announcements/Announcements";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" Component={HomePage}></Route>
        <Route path="/leaderboard" Component={LiveScores}></Route>
        <Route path="/announcement" Component={Announcement}></Route>
      </Routes>
    </>
  );
}

export default App;
