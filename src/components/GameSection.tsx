import "../styles/GameSection.css";
import GameCard from "./GameCard";

const cardsContent = [
  {
    id: 1,
    title: "Bomb or Claat",
    imageUrl: "/icons/BombOrClaat.svg",
  },
  {
    id: 2,
    title: "Sloppy BJ",
    imageUrl: "/icons/SloppyBJ.svg",
  },
  {
    id: 3,
    title: "Chicken Run",
    imageUrl: "/icons/ChickenRun.svg",
  },
];

const GameSection = () => {
  return (
    <section id="games" className="game-section">
      {cardsContent.map((card) => (
        <GameCard
          key={card.id}
          id={card.id}
          title={card.title}
          imageUrl={card.imageUrl}
        />
      ))}
    </section>
  );
};

export default GameSection;
