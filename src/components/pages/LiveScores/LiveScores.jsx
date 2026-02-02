import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import api from "../../../API/axios"; 
import "./LiveScore.css";

const LiveScores = () => {
  const [housesRank, sethousesRank] = useState([]);

  useEffect(() => {
    const getScoresData = async () => {
      try {
        const data = await api.get("/api/live-points");

        let finalData = [];
        data.data.forEach((house) => {
          finalData.push({
            rank: house.rank,
            name: house.name,
            score: house.points,
          });
        });
        sethousesRank(finalData);
      } catch (error) {
        console.error("Error fetching live scores:", error);
      }
    };
    getScoresData();
  }, []);

  return (
    <>
      <div className="liveScores">
        <div className="heading">
          {" "}
          <h1>🏆 Live House Scores</h1>
          <p>Current standings of all Darsanians' Houses</p>
        </div>
        <div className="rank-table">
          <Table bordered>
            <thead>
              <tr>
                <th className="ranks-column">Ranks</th>
                <th className="name-column">Houses Name</th>
                <th className="scores-column">Scores</th>
              </tr>
            </thead>
            <tbody>
              {housesRank.map((house, i) => {
                return (
                  <tr key={i}>
                    <td className="text-center">{house.rank}</td>
                    <td>{house.name}</td>
                    <td>{house.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default LiveScores;