import "../styles/GameSection.css";
import { Link } from "react-router-dom";

interface GameCardProps {
  title: string;
  imageUrl: string;
  id: number;
}

const GameCard = ({ title, imageUrl, id }: GameCardProps) => {
  return (
    <div className="game-card">
      <Link to={`/game/${id}`} className="game-card-link">
        <img className="blurry-img" src={imageUrl} alt={title} />
        <img className="game-card-img" src={imageUrl} alt={title} />
      </Link>
      <p className="game-card-title">{title}</p>
    </div>
  );
};

export default GameCard;
