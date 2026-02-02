import React from "react";

import Al_Ghuraab from "../../../../Assets/Houses/Al-Ghuraab.png";
import Al_HudHud from "../../../../Assets/Houses/Al-HudHud.png";
import Al_Adiyat from "../../../../Assets/Houses/Al-Adiyat.png";
import An_Nun from "../../../../Assets/Houses/An-Nun.png";
import An_Nahl from "../../../../Assets/Houses/An-Nahl.png";
import An_Naml from "../../../../Assets/Houses/An-Naml.png";

const houseImages = {
  "Al-Ghuraab": Al_Ghuraab,
  "Al-Hudhud": Al_HudHud,
  "Al-Adiyat": Al_Adiyat,
  "An-Nun": An_Nun,
  "An-Nahl": An_Nahl,
  "An-Naml": An_Naml,
};

const HousesCard = ({ houses, house, i, onClick }) => {
  const originX = 50;
  const originY = 900;
  const change = 18;
  const middle = (houses.length - 1) / 2;

  const angle = (i - middle) * change;

  return (
    <div onClick={() => onClick(house)}>
      <div
        className="house-card"
        style={{
          transformOrigin: `${originX}% ${originY}px`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          zIndex: 0,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = `translate(0, 0) rotate(0deg)scale(1.3)`;
          e.target.style.transition = `transform 0.3s ease-out`;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = `scale(1)`;
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
    </div>
  );
};

export default HousesCard;
