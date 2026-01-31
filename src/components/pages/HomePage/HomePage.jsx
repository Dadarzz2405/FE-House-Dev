import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import "./HomePage.css";

function HomePage() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const getHouses = async () => {
      const response = await axios.get("http://localhost:5000/api/houses");
      const data = response.data;
      setHouses(data);
    };
    getHouses();
  }, []);

  return (
    <div className="home-page">
      <div className="houses-display">
        {houses.map((house, i) => {
          const topY = 100;
          const changeY = 100;
          const changeX = 200;
          const middle = (houses.length - 1) / 2;
          const y = Math.abs(i - middle) * changeY;
          const x = (i - middle) * changeX;
          const angle = (i - middle) * 10;

          return (
            <Card
              style={{
                width: "150px",
                height: "12rem",
                position: "absolute",
                left: `calc(50% + ${x}px)`,
                top: `calc(${y + topY}px)`,
                transform: "translate(-50%, -50%)",
                transformOrigin: "0% 0%",
                rotate: `${angle}deg`,
              }}
              className="house-card"
              key={i}
            >
              <Card.Body>
                <Card.Title>{house.name}</Card.Title>
              </Card.Body>
            </Card>
          );
        })}
      </div>
      <div className="home-title">
        <h1>Houses</h1>
      </div>
    </div>
  );
}

export default HomePage;
