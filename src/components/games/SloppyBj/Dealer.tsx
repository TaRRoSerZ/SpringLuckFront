// Dealer.tsx
import React from "react";
import BjCard from "./BjCard";

type DealerProps = {
  cards: { name: string; value: number | "A" }[];
  score: number;
  isDealerCardRevealed: boolean;
  calculateScore: (cards: { name: string; value: number | "A" }[]) => number;
};

const Dealer: React.FC<DealerProps> = ({
  cards,
  score,
  calculateScore,
  isDealerCardRevealed,
}) => {
  return (
    <div className="bj-guy cards-container">
      <img
        src="/icons/bjDealer.svg"
        alt="BlackJack Dealer"
        className="bj-dealer-icon player-icon"
      />
      <p className="bj-score">
        <span className="bj-guy-score-text">
          {isDealerCardRevealed
            ? score
            : cards.length > 0
            ? calculateScore([cards[0]])
            : 0}
        </span>
      </p>
      <div className="sloppy-cards">
        {cards.map((card, idx) => (
          <BjCard
            key={idx}
            card={card}
            delay={idx}
            isHidden={!isDealerCardRevealed && idx === 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Dealer;
