import React from "react";
import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import api from "../../../API/axios"; 
import "./Announcements.css";

const Announcements = () => {
  const [announce, setAnnounce] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnnounceData = async () => {
      try {
        const data = await api.get("/api/announcements");

        let finalData = [];
        data.data.forEach((a) => {
          finalData.push({
            title: a.title,
            content: a.content,
            image_url: a.image_url,  // ✅ Include image URL
            date: a.created_at,
            house: a.house?.name ?? "Unknown",
            captain: {
              name: a.captain?.name ?? "Unknown",
              username: a.captain?.username ?? "-",
            },
          });
        });

        setAnnounce(finalData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setLoading(false);
      }
    };
    getAnnounceData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading announcements...</h2>
      </div>
    );
  }

  return (
    <>
      <h1>Announcements</h1>
      
      {announce.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p style={{ fontSize: '1.2rem' }}>No announcements yet</p>
        </div>
      ) : (
        announce.map((value, i) => (
          <Card
            style={{
              width: "150px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
            className="announce-card"
            key={i}
          >
            <Card.Body>
              <Card.Title>{value.title}</Card.Title>
              <Card.Text>{value.content}</Card.Text>
              
              {/* ✅ Display image if available */}
              {value.image_url && (
                <div className="announcement-image">
                  <img 
                    src={value.image_url} 
                    alt="Announcement" 
                    className="announcement-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <Card.Text className="announcement-date">
                {new Date(value.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Card.Text>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>{value.house}</ListGroup.Item>
              <ListGroup.Item>
                {value.captain.username} - {value.captain.name}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        ))
      )}
    </>
  );
};

export default Announcements;