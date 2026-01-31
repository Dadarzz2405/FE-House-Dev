import React, { useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get("");
    };
    getData();
  }, []);

  return (
    <>
      <h1>Home Page</h1>
    </>
  );
};

export default HomePage;
