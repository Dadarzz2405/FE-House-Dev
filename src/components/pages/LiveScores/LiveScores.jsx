import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "./livescore.css";

const LiveScores = () => {
  const [housesRank, sethousesRank] = useState([]);

  useEffect(() => {
    const getScoresData = async () => {
      const data = await axios.get("");

      const rankedData = data.sort(
        (house1, house2) => house2.score - house1.score,
      );

      let finalData = [];
      data.forEach((house, i) => {
        finalData.push({
          rank: i + 1,
          name: house.name,
          score: house.house_points,
        });
      });
      sethousesRank(finalData);
    };
  }, []);
  return (
    <>
      <div className="liveScores">
        <div class="heading">
          <h1>🏆 Live House Scores</h1>
          <p>Current standings of all Darsanians' Houses</p>
        </div>
        <div className="rank-table">
          <Table>
            <thead>
              <tr>
                <th className="ranks-column">Ranks</th>
                <th className="name-column">Houses Name</th>
                <th className="scores-column">Scores</th>
              </tr>
            </thead>
            <tbody>
              {housesRank.map((house) => {
                return (
                  <tr>
                    <td>{house.rank}</td>
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
