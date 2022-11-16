import React from "react";
import "./MatchRankImage.css";

const rankTierFor = (rank: number) => {
  if (rank < 1500) {
    return "bronze";
  }
  if (rank < 2000) {
    return "silver";
  }
  if (rank < 2500) {
    return "gold";
  }
  if (rank < 3000) {
    return "platinum";
  }
  if (rank < 3500) {
    return "diamond";
  }
  if (rank < 4000) {
    return "master";
  }
  if (rank <= 5000) {
    return "grandmaster";
  }
};

export function rankSubTierFor(rank: number ):string {
  if (typeof rank === "undefined"){
    return "Error";
  }
  if (rank < 1100) {
    return "Bronze 5";
  }
  if (rank < 1200) {
    return "Bronze 4";
  }
  if (rank < 1300) {
    return "Bronze 3";
  }
  if (rank < 1400) {
    return "Bronze 2";
  }
  if (rank < 1500) {
    return "Bronze 1";
  }
  if (rank < 1600) {
    return "Silver 5";
  }
  if (rank < 1700) {
    return "Silver 4";
  }
  if (rank < 1800) {
    return "Silver 3";
  }
  if (rank < 1900) {
    return "Silver 2";
  }
  if (rank < 2000) {
    return "Silver 1";
  }
  if (rank < 2100) {
    return "Gold 5";
  }
  if (rank < 2200) {
    return "Gold 4";
  }
  if (rank < 2300) {
    return "Gold 3";
  }
  if (rank < 2400) {
    return "Gold 2";
  }
  if (rank < 2500) {
    return "Gold 1";
  }
  if (rank < 2600) {
    return "Platinum 5";
  }
  if (rank < 2700) {
    return "Platinum 4";
  }
  if (rank < 2800) {
    return "Platinum 3";
  }
  if (rank < 2900) {
    return "Platinum 2";
  }
  if (rank < 3000) {
    return "Platinum 1";
  }
  if (rank < 3100) {
    return "Diamond 5";
  }
  if (rank < 3200) {
    return "Diamond 4";
  }
  if (rank < 3300) {
    return "Diamond 3";
  }
  if (rank < 3400) {
    return "Diamond 2";
  }
  if (rank < 3500) {
    return "Diamond 1";
  }
  if (rank < 3600) {
    return "Master 5";
  }
  if (rank < 3700) {
    return "Master 4";
  }
  if (rank < 3800) {
    return "Master 3";
  }
  if (rank < 3900) {
    return "Master 2";
  }
  if (rank < 4000) {
    return "Master 1";
  }
  if (rank < 4100) {
    return "Grandmaster 5";
  }
  if (rank < 4200) {
    return "Grandmaster 4";
  }
  if (rank < 4300) {
    return "Grandmaster 3";
  }
  if (rank < 4400) {
    return "Grandmaster 2";
  }
  if (rank <= 5000) {
    return "Grandmaster 1";
  }
  return "Error";
};

interface Props {
  rank: number;
  priorRank?: number;
  className?: string;
}

const MatchRankImage = ({ rank, priorRank, className }: Props) => {
  const rankTier = rankTierFor(rank);
  const rankSubTier = rankSubTierFor(rank);
  
  if (!rankTier) {
    return null;
  }

  //if (priorRank && rankTier === rankTierFor(priorRank)) {
   // return null;
  //}

  const src = require(`../../images/ranks/ow2_without_tier/${rankTier}.png`);
  const imgClass = `rank-image rank-${rankTier} ${className}`;
  return (
    <span
      className="d-inline-block tooltipped-n tooltipped"
      aria-label={`${rankSubTier}`}
    >
      <img src={src} className={imgClass} alt={`${rank} (${rankTier})`} />
    </span>
  );
};

export default MatchRankImage;
