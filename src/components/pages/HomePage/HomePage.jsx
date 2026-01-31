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
      <h1>Houses</h1>
      <div className="houses-display">
        {houses.map((house, i) => {
          return (
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{house.name}</Card.Title>
                <Card.Text>{house.description}</Card.Text>
                <Button
                  variant="primary"
                  style={{ padding: "2px 5px 2px 5px" }}
                >
                  Details
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
