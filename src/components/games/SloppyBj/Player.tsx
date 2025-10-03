// Player.tsx
import React from "react";
import BjCard from "./BjCard";

type PlayerProps = {
  cards: { name: string; value: number | "A" }[];
  score: number;
};

const Player: React.FC<PlayerProps> = ({ cards, score }) => {
  return (
    <div className="your-guy cards-container">
      <p className="bj-score">
        <span className="your-guy-score-text">{score}</span>
      </p>
      <div className="sloppy-cards">
        {cards.map((card, idx) => (
          <BjCard key={idx} card={card} delay={idx} />
        ))}
      </div>
      <img
        src="/icons/bjPlayer.svg"
        alt="BlackJack Player"
        className="bj-player-icon player-icon"
      />
    </div>
  );
};

export default Player;
