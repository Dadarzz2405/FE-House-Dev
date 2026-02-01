import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import "./HomePage.css";

import Al_Ghuraab from "../../../Assets/Houses/Al-Ghuraab.png";
import Al_HudHud from "../../../Assets/Houses/Al-Hudhud.png";
import Al_Adiyat from "../../../Assets/Houses/Al-Adiyat.png";
import An_Nun from "../../../Assets/Houses/An-Nun.png";
import An_Nahl from "../../../Assets/Houses/An-Nahl.png";
import An_Naml from "../../../Assets/Houses/An-Naml.png";

const houseImages = {
  "Al-Ghuraab": Al_Ghuraab,
  "Al-Hudhud": Al_HudHud,
  "Al-Adiyat": Al_Adiyat,
  "An-Nun": An_Nun,
  "An-Nahl": An_Nahl,
  "An-Naml": An_Naml,
};

function HomePage() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const getHouses = async () => {
      const response = await axios.get("http://localhost:5000/api/houses");
      setHouses(response.data);
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
              key={house.id ?? i}
              className="house-card"
              style={{
                width: "150px",
                height: "12rem",
                position: "absolute",
                left: `calc(50% + ${x}px)`,
                top: `calc(${y + topY}px)`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`
              }}
            >
              <Card.Body className="text-center">
                <img
                  src={houseImages[house.name]}
                  alt={house.name}
                  className="house-image"
                />
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
