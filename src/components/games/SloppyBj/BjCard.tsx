// Card.tsx
import React from "react";

type CardProps = {
  card: { name: string; value: number | "A" };
  delay: number;
  isHidden?: boolean; // Pour gérer la carte cachée du croupier
};

const BjCard: React.FC<CardProps> = ({ card, isHidden = false, delay }) => {
  return (
    <div
      className={`sloppy-card`}
      style={{ animationDelay: `${delay * 150}ms` }}
    >
      {isHidden ? (
        <img src="/icons/cardStar.svg" alt="Back of Card" />
      ) : (
        card.name
      )}
    </div>
  );
};

export default BjCard;
