import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import api from "../../../API/axios";
import "./LiveScore.css";
import ScoreBar from "./Sub-Component/ScoreBar";

const LiveScores = () => {
  const [housesRank, sethousesRank] = useState([
    { rank: 1, name: "Al-Ghuraab", score: 500 },
    { rank: 2, name: "An-Nun", score: 450 },
    { rank: 3, name: "Al-Hudhud", score: 430 },
    { rank: 4, name: "An-Naml", score: 430 },
    { rank: 5, name: "Al-Adiyat", score: 400 },
    { rank: 6, name: "An-Nahl", score: 390 },
  ]);
  const [scoreStats, setScoreStats] = useState({});

  // useEffect(() => {
  //   const getScoresData = async () => {
  //     try {
  //       const data = await api.get("/api/live-points");

  //       let finalData = [];
  //       data.data.forEach((house) => {
  //         finalData.push({
  //           rank: house.rank,
  //           name: house.name,
  //           score: house.points,
  //         });
  //       });
  //       sethousesRank(finalData);
  //     } catch (error) {
  //       console.error("Error fetching live scores:", error);
  //     }
  //   };
  //   getScoresData();
  // }, []);

  useEffect(() => {
    const scoreRange = () => {
      let scores = housesRank.map((house) => house.score);
      let minScore = Math.min(...scores);
      let maxScore = Math.max(...scores);
      let range = maxScore - minScore;
      setScoreStats({ minScore, maxScore, range });
    };
    scoreRange();
  }, [housesRank]);

  return (
    <>
      <div className="liveScores">
        <div className="heading">
          {" "}
          <h1>🏆 Live House Scores</h1>
          <p>Current standings of all Darsanians' Houses</p>
        </div>
        <div className="house-rankings">
          {housesRank.map((house, index) => (
            <ScoreBar
              key={index}
              rank={house.rank}
              score={house.score}
              scoreStats={scoreStats}
              house={house.name}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default LiveScores;
