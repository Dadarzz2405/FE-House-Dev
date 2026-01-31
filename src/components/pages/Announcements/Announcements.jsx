import React from "react";
import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import "./Announcements.css";

const Announcements = () => {
  const [announce, setAnnounce] = useState([]);

  useEffect(() => {
    const getAnnounceData = async () => {
      const data = await axios.get("http://localhost:5000/api/announcements");

      let finalData = [];
      data.data.forEach((a) => {
        finalData.push({
          title: a.title,
          content: a.content,
          date: a.created_at,
          house: a.house?.name ?? "Unknown",
          captain: {
            name: a.captain?.name ?? "Unknown",
            username: a.captain?.username ?? "-",
          },
        });
      });

      setAnnounce(finalData);
      console.log(data);
    };
    getAnnounceData();
  }, []);

  return (
    <>
      <h1>Announcements</h1>
      {announce.map((value, i) => {
        const topY = 100;
        const changeY = 100;
        const changeX = 200;
        const middle = (announce.length - 1) / 2;
        const y = Math.abs(i - middle) * changeY;
        const x = (i - middle) * changeX;
        const angle = (i - middle) * 10;

        return (
          <Card
            style={{
              width: "150px",
            }}
            className="announce-card"
            key={i}
          >
            <Card.Body>
              <Card.Title>{value.title}</Card.Title>
              <Card.Text>{value.content}</Card.Text>
              <Card.Text>{value.date}</Card.Text>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>{value.house}</ListGroup.Item>
              <ListGroup.Item>
                {value.captain.username} - {value.captain.name}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        );
      })}
    </>
  );
};

export default Announcements;
