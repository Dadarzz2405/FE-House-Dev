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

const ScoreBar = ({ score, scoreStats, rank, house }) => {
  const { minScore, maxScore, range } = scoreStats;
  let barLength = 0;
  let barRange;

  let minBarScore;
  let maxBarScore;

  minBarScore = Math.trunc((minScore / range) * range);
  if (minScore - minBarScore < 0.2 * range) {
    minBarScore = minScore - 0.2 * range;
  }
  maxBarScore = minBarScore + 150;

  if (range > 150) {
    maxBarScore = maxScore + 0.2 * range;
  }

  barRange = maxBarScore - minBarScore;

  barLength = ((score - minBarScore) / barRange) * 100;

  return (
    <div className={`ranking r-${rank}`}>
      <div className="score-bar">
        <img src={houseImages[house]} alt={house} />
        <div className="bar" style={{ height: `${barLength}%` }}>
          <p>{score}</p>
        </div>
      </div>
      <div className="rank">{rank}</div>
    </div>
  );
};

export default ScoreBar;
