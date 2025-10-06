import { useParams } from "react-router-dom";
import SloppyBj from "./games/SloppyBj/SloppyBj";
import DiddySco from "./games/DiddySco/DiddySco";
import RiggedPaperScissors from "./games/RiggedPaperScissors/RiggedPaperScissors";
import type { JSX } from "react";
import BombOrClaat from "./games/BombOrClaat/BombOrClaat";

const GameContainer = () => {
	const { id } = useParams<{ id: string }>();

	const gameMap: Record<string, JSX.Element> = {
		"1": <BombOrClaat />,
		"2": <SloppyBj />,
		"3": <DiddySco />,
		"4": <RiggedPaperScissors />,
	};

	const gameComponent = gameMap[id || ""];

	if (!gameComponent) {
		return <div>Jeu non trouvé</div>;
	}

	return <div>{gameComponent}</div>;
};

export default GameContainer;
