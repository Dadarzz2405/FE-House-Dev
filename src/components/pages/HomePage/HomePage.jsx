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
import { data } from "react-router-dom";

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
          const originX = 50;
          const originY = 900;
          const change = 15;
          const middle = (houses.length - 1) / 2;

          const angle = (i - middle) * change;

          return (
            <div
              key={house.id ?? i}
              className="house-card"
              style={{
                width: "187.5px",
                height: "250px",
                position: "absolute",
                left: `50%`,
                top: `15rem`,
                transformOrigin: `${originX}% ${originY}px`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = `scale(1.3)`;
                e.target.style.zIndex = 10;
                e.target.style.transition = `transform 0.3s ease-out`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = `scale(1)`;
                e.target.style.zIndex = 0;
              }}
            >
              <div
                className="text-center"
                style={{
                  padding: "0",
                  backgroundImage: `url(${houseImages[house.name]})`,
                  backgroundClip: "border-box",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  height: "100%",
                  width: "100%",
                }}
              ></div>
            </div>
          );
        })}
      </div>

      <div className="home-title">
        <h1>DARSANIAN'S</h1>
        <h2>HOUSES</h2>
      </div>
    </div>
  );
}

export default HomePage;
