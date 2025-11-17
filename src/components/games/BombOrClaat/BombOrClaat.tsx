import "./BombOrClaat.css";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import BetSection from "../../BetSection";
import { useEffect, useRef, useState } from "react";

interface Tile {
	isBomb: boolean;
	isRevealed: boolean;
}

interface Level {
	name: string;
	numberOfBomb: number;
}

export default function BombOrClaat() {
	const [numberOfBomb, setNumberOfBomb] = useState<number>(3);
	const numberOfTiles = 32;
	const [safePicks, setSafePicks] = useState<number>(0);
	const [tiles, setTiles] = useState<Tile[]>([]);
	const [multiplier, setMultiplier] = useState<number>(0);
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [isGameActive, setIsGameActive] = useState<boolean>(false);
	const [activeLevel, setActiveLevel] = useState<string>("easy");
	const levels: Level[] = [
		{ name: "easy", numberOfBomb: 3 },
		{ name: "medium", numberOfBomb: 5 },
		{ name: "hard", numberOfBomb: 8 },
		{ name: "expert", numberOfBomb: 12 },
	];

	function shuffle(array: any[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	function probabilityOfKSafePicks() {
		let safe = numberOfTiles - numberOfBomb;
		let prob = 1;

		for (let i = 0; i < safePicks; i++) {
			prob *= (safe - i) / (numberOfTiles - i);
		}
		return prob;
	}

	function payout(rtp = 0.995) {
		const prob = probabilityOfKSafePicks();
		console.log(rtp / prob);
		return rtp / prob;
	}

	function handleTileClick(index: number) {
		const newTiles = [...tiles];
		if (newTiles[index].isRevealed) return;
		newTiles[index].isRevealed = true;
		setTiles(newTiles);
		if (!newTiles[index].isBomb) {
			setSafePicks((prev) => prev + 1);
			setMultiplier(payout());
		} else {
			setGameOver(true);
		}
	}

	function handleChangeLevel(level: Level) {
		if (level.name === activeLevel) return;
		setActiveLevel(level.name);
		setNumberOfBomb(level.numberOfBomb);
	}

	function createTiles() {
		const newTiles: Tile[] = [];

		for (let i = 0; i < numberOfTiles; i++) {
			newTiles.push({ isBomb: i < numberOfBomb, isRevealed: false });
		}
		const shuffledTiles = shuffle([...newTiles]);
		setTiles(shuffledTiles);
	}

	useEffect(() => {
		createTiles();
	}, [numberOfBomb]);

	return (
		<>
			<Navbar />
			<section className="bomb-or-claat-game">
				<div className="bomb-or-claat-content">
					{tiles.map((tile, index) => (
						<div
							key={index}
							className={`${tile.isBomb ? "bomb" : ""} box ${
								tile.isRevealed ? "revealed" : ""
							}`}
							onClick={() => handleTileClick(index)}
						>
							{tile.isRevealed ? (
								tile.isBomb ? (
									<img src="/icons/bomb.svg" alt="bombe" width={50} />
								) : (
									<img src="/icons/diamond.svg" alt="diamant" width={50} />
								)
							) : (
								""
							)}
						</div>
					))}
				</div>
				<div className="bomb-or-claat-settings-tab">
					<div className="bomb-or-claat-settings-buttons">
						{levels.map((level, index) => (
							<button
								key={index}
								className={`level-button ${
									activeLevel === level.name ? "active" : ""
								}`}
								onClick={() => {
									handleChangeLevel(level);
								}}
							>
								{level.name}
							</button>
						))}
					</div>
					<div className="bomb-or-claat-settings-actions">
						<p>Multiplier : {multiplier.toFixed(2)}x</p>
						<button className="bomb-or-claat-cash-out-button">Cash out</button>
					</div>
				</div>
				<div className={`bomb-or-claat-game-over ${gameOver ? "on" : "off"}`}>
					<div className="bomb-or-claat-lose-card">
						<h2>Game Over !</h2>
						<button
							onClick={() => (
								setGameOver(false),
								createTiles(),
								setMultiplier(0),
								setSafePicks(0)
							)}
						>
							Close
						</button>
					</div>
				</div>
			</section>
			<BetSection />
			<Footer />
		</>
	);
}
