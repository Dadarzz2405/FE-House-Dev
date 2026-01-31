import { useEffect, useState } from "react";

function HomePage() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/houses")
      .then(res => res.json())
      .then(data => setHouses(data));
  }, []);

  return (
    <div>
      <h1>Houses</h1>
      {houses.map(h => (
        <div key={h.id}>
          {h.name} — {h.points}
        </div>
      ))}
    </div>
  );
}

export default HomePage;
