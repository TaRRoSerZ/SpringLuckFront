import "../styles/GameSection.css";
import { Link } from "react-router-dom";

interface GameCardProps {
  title: string;
  imageUrl: string;
  id: number;
  tag?: string;
}

const GameCard = ({ title, imageUrl, id, tag }: GameCardProps) => {
  return (
    <figure className="game-card">
      {tag && <div className="game-card-tag">{tag}</div>}
      <Link to={`/game/${id}`} className="game-card-link">
        <img className="blurry-img" src={imageUrl} alt={title} />
        <img className="game-card-img" src={imageUrl} alt={title} />
      </Link>
      <figcaption className="game-card-title">
        #{id} : {title}
      </figcaption>
    </figure>
  );
};

export default GameCard;
