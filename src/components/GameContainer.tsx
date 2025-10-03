import { useParams } from "react-router-dom";
import SloppyBj from "./games/SloppyBj/SloppyBj";
import DiddySco from "./games/DiddySco/DiddySco";
import type { JSX } from "react";

const GameContainer = () => {
  const { id } = useParams<{ id: string }>();

  const gameMap: Record<string, JSX.Element> = {
    "2": <SloppyBj />,
    "3": <DiddySco />,
  };

  const gameComponent = gameMap[id || ""];

  if (!gameComponent) {
    return <div>Jeu non trouvé</div>;
  }

  return <div>{gameComponent}</div>;
};

export default GameContainer;
