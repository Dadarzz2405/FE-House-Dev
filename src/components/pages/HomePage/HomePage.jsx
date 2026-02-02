import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import api from "../../../API/axios";
import "./HomePage.css";
import HousesCard from "./Sub-Components/HousesCard";

function HomePage() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const getHouses = async () => {
      const response = await api.get("/api/houses");
      let data = [];
      response.data.forEach((house) => {
        data.push({
          id: Math.floor(Math.random() * 10000),
          name: house.name,
        });
      });
      console.log(data);
      let dataSorted = data.sort((a, b) => a.id - b.id);
      setHouses(dataSorted);
    };
    getHouses();
  }, []);

  return (
    <div className="home-page">
      <div className="houses-display">
        {houses.map((house, i) => {
          return (
            <HousesCard key={house.id} i={i} houses={houses} house={house} />
          );
        })}
      </div>

      <div className="houses-title">
        <h1>HOUSES</h1>
      </div>
    </div>
  );
}

export default HomePage;
