// SloppyBj.tsx
import { useState } from "react";
import "./SloppyBj.css";
import Navbar from "../../Navbar";
import BetSection from "../../BetSection";
import Player from "./Player";
import Dealer from "./Dealer";
import GameStatus from "./GameStatus";

// Définition des types
type CardValue = number | "A"; // Ace est une valeur spéciale
type Card = { name: string; value: CardValue };

// Définition du deck de cartes
const deck: Card[] = [
	{ name: "2", value: 2 },
	{ name: "3", value: 3 },
	{ name: "4", value: 4 },
	{ name: "5", value: 5 },
	{ name: "6", value: 6 },
	{ name: "7", value: 7 },
	{ name: "8", value: 8 },
	{ name: "9", value: 9 },
	{ name: "10", value: 10 },
	{ name: "J", value: 10 },
	{ name: "Q", value: 10 },
	{ name: "K", value: 10 },
	{ name: "A", value: "A" },
];

// Fonction pour tirer une carte aléatoire
const getRandomCard = () => deck[Math.floor(Math.random() * deck.length)];

// Calcul du score en gérant les As (1 ou 11)
const calculateScore = (cards: Card[]) => {
	let total = 0;
	let aces = 0;

	cards.forEach((card) => {
		if (!card || !card.value) {
			console.error("Invalid card detected:", card);
			return; // Ignore invalid cards
		}

		if (card.value === "A") {
			aces += 1;
			total += 11; // On commence par l'As à 11
		} else {
			total += card.value;
		}
	});

	// Si le score dépasse 21 et que l'on a des As, on les transforme en 1
	while (total > 21 && aces > 0) {
		total -= 10;
		aces -= 1;
	}

	return total;
};

// Fonction pour gérer le tour du croupier
const dealerTurn = (
	bjCards: Card[],
	setBjCards: React.Dispatch<React.SetStateAction<Card[]>>,
	setBjScore: React.Dispatch<React.SetStateAction<number>>,
	yourScore: number, // Ajout du score du joueur ici pour comparaison
	setGameStatus: React.Dispatch<React.SetStateAction<string>>,
	setIsDealerCardRevealed: React.Dispatch<React.SetStateAction<boolean>> // Passer l'état pour révéler la carte
): string => {
	let newBjCards = [...bjCards];
	let newBjScore = calculateScore(newBjCards);

	// Le croupier tire tant que son score est inférieur à 17
	while (newBjScore < 17) {
		const newCard = getRandomCard();
		newBjCards.push(newCard);
		newBjScore = calculateScore(newBjCards);
	}

	setBjCards(newBjCards);
	setBjScore(newBjScore);
	setIsDealerCardRevealed(true); // Révéler la carte du croupier à la fin

	// Vérification si le croupier a bust
	let status = "";
	if (newBjScore > 21) {
		status = "Dealer Busts! You Win!";
	} else if (newBjScore === 21) {
		// Si le croupier a 21
		status = "Dealer has 21! Dealer Wins!";
	} else if (newBjScore === yourScore) {
		status = "Draw! It's a tie!";
	} else if (newBjScore > yourScore) {
		status = "Dealer Wins!";
	} else {
		status = "You Win!";
	}

	setGameStatus(status);
	return status;
};

const SloppyBj = () => {
	const [yourCards, setYourCards] = useState<Card[]>([]);
	const [bjCards, setBjCards] = useState<Card[]>([]);
	const [yourScore, setYourScore] = useState(0);
	const [bjScore, setBjScore] = useState(0);
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [isDealerCardRevealed, setIsDealerCardRevealed] = useState(false);
	const [gameStatus, setGameStatus] = useState(""); // Ajout de l'état pour afficher le statut du jeu

	// Betting / balance state
	const [betAmount, setBetAmount] = useState<number>(0);
	const [betPlaced, setBetPlaced] = useState<boolean>(false);

	const [balance, setBalance] = useState<number>(() => {
		const raw = localStorage.getItem("balance");
		const n = raw ? Number(raw) : 0;
		return Number.isFinite(n) ? n : 0;
	});

	function updateBalance(newBal: number) {
		setBalance(newBal);
		localStorage.setItem("balance", String(Number(newBal.toFixed(2))));
	}

	function handlePlace(amount: number) {
		if (amount <= 0) return false;
		if (amount > balance) return false;
		// deduct immediately
		updateBalance(Number((balance - amount).toFixed(2)));
		setBetAmount(amount);
		setBetPlaced(true);
		return true;
	}

	// (no modal for SloppyBj — the game uses its built-in GameStatus display)

	const startGame = () => {
		// require that a bet has been placed
		if (!betPlaced || betAmount <= 0) return;
		setIsGameStarted(true);
		setGameStatus(""); // Réinitialiser le statut du jeu
		dealCard(); // Distribution des cartes au début
	};

	const dealCard = () => {
		const yourCard1 = getRandomCard();
		const yourCard2 = getRandomCard();
		const bjCard1 = getRandomCard();
		const bjCard2 = getRandomCard();

		const yourNewCards = [yourCard1, yourCard2];
		const bjNewCards = [bjCard1, bjCard2];

		setYourCards(yourNewCards);
		setBjCards(bjNewCards);
		setYourScore(calculateScore(yourNewCards));
		setBjScore(calculateScore(bjNewCards));
	};

	const handleStand = () => {
		setIsDealerCardRevealed(true);
		const result = dealerTurn(
			bjCards,
			setBjCards,
			setBjScore,
			yourScore,
			setGameStatus,
			setIsDealerCardRevealed
		);

		// resolve payout based on result; do not show a separate payout modal for SloppyBj
		let payout = 0;
		if (result.includes("You Win") || result.includes("Dealer Busts")) {
			// Win: simple 2x payout (bet returned + equal winnings)
			payout = Number((betAmount * 2).toFixed(2));
			updateBalance(Number((balance + payout).toFixed(2)));
		} else if (result.includes("Draw") || result.includes("tie")) {
			// Push: return original bet
			payout = Number(betAmount.toFixed(2));
			updateBalance(Number((balance + payout).toFixed(2)));
		} else {
			// Lost: bet already deducted
		}

		setIsGameStarted(false);
		// clear bet state on resolution
		setBetPlaced(false);
		setBetAmount(0);
	};

	const handleHit = () => {
		const newCard = getRandomCard();
		const newCards = [...yourCards, newCard];
		setYourCards(newCards);
		const newScore = calculateScore(newCards);
		setYourScore(newScore);

		if (newScore > 21) {
			setIsDealerCardRevealed(true); // Révéler la carte du croupier quand le joueur bust
			setGameStatus("You Bust! Dealer Wins!");
			setIsGameStarted(false); // Stopper la partie si le joueur bust
			// player busted -> bet is lost (already deducted on place)
			setBetPlaced(false);
			setBetAmount(0);
		}
	};

	const handleRestart = () => {
		setIsGameStarted(false);
		setIsDealerCardRevealed(false);
		setGameStatus(""); // Réinitialiser le statut du jeu
		setYourCards([]);
		setBjCards([]);
		setYourScore(0);
		setBjScore(0);
	};

	return (
		<>
			<Navbar />
			<section className="sloppy-bj">
				<div className="sloppy-game-container">
					<Dealer
						cards={bjCards}
						score={bjScore}
						isDealerCardRevealed={isDealerCardRevealed}
						calculateScore={calculateScore} // Passer la fonction en prop
					/>
					<div className="sloppy-separator"></div>
					<Player cards={yourCards} score={yourScore} />
					<div className="sloppy-controls">
						{gameStatus ? (
							<GameStatus gameStatus={gameStatus} onRestart={handleRestart} />
						) : !isGameStarted ? (
							<>
								<button
									className="play-button"
									onClick={startGame}
									disabled={!betPlaced || betAmount <= 0}
								>
									Start the Game
								</button>
								<div style={{ marginTop: 12 }}>
									<small>Balance: {balance.toFixed(2)} $</small>
								</div>
							</>
						) : (
							<>
								<button className="play-button" onClick={handleStand}>
									Stand
								</button>
								<button className="play-button" onClick={handleHit}>
									Hit
								</button>
							</>
						)}
					</div>
				</div>
				{/* Bet section placed under the game container */}
				<div style={{ width: "100%", marginTop: 16 }}>
					<BetSection balance={balance} onPlace={handlePlace} />
				</div>

				{/* No separate payout modal here — SloppyBj uses GameStatus for results */}
			</section>
		</>
	);
};

export default SloppyBj;
