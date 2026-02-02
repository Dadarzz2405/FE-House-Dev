import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import "./HomePage.css";
import HousesCard from "./Sub-Components/HousesCard";
import HousePopUpModal from "./Sub-Components/HousePopUp";

function HomePage() {
  const [houses, setHouses] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");

  const popUp = (house) => {
    setSelectedHouse(house);
    setIsPopUp(true);
  };

  const closePopUp = () => {
    setIsPopUp(false);
    setSelectedHouse("");
  };

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
          return (
            <HousesCard
              key={house.id}
              i={i}
              houses={houses}
              house={house}
              onClick={popUp}
            />
          );
        })}
      </div>

      <HousePopUpModal
        isOpen={isPopUp}
        onClose={closePopUp}
        house={selectedHouse}
      />

      <div className="houses-title">
        <h1>HOUSES</h1>
      </div>
    </div>
  );
}

export default HomePage;
