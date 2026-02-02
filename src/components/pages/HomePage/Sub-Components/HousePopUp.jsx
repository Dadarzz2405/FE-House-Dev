import React, { useEffect } from "react";
import { Button } from "react-bootstrap";

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

export default function HousePopUpModal({ isOpen, onClose, house }) {
  if (!isOpen) return null;

  return (
    <div className="popup-bg" onClick={onClose}>
      <div className="main-content">
        <div className={`house-logo ${house.name.toLowerCase()}`}>
          <div
            className="logo"
            style={{
              backgroundImage: `url(${houseImages[house.name]})`,
            }}
            onClick={(e) => e.stopPropagation()}
          ></div>
        </div>
        <div className="content-container">
          <div className="content" onClick={(e) => e.stopPropagation()}>
            <h2>{house?.name}</h2>
            <p>{house?.description}</p>
            <div className="pupup-btn">
              <Button variant="outline-light" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
