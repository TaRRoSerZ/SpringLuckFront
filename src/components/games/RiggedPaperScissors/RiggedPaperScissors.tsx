import "./RiggedPaperScissors.css";
import Navbar from "../../Navbar";
import { useState } from "react";
import BetSection from "../../BetSection";

type Choice = "rock" | "paper" | "scissors";

const choices: Choice[] = ["rock", "paper", "scissors"];

// Ce que X bat
const beats: Record<Choice, Choice> = {
	rock: "scissors",
	paper: "rock",
	scissors: "paper",
};

// Le contre-coup qui bat X
const counter: Record<Choice, Choice> = {
	rock: "paper",
	paper: "scissors",
	scissors: "rock",
};

const RIGGED_PROB = 0.6;

export default function RiggedPaperScissors() {
	const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
	const [dealerChoice, setDealerChoice] = useState<Choice | null>(null);
	const [gameStarted, setGameStarted] = useState(false);
	const [result, setResult] = useState<string | null>(null);

	// Betting / balance state
	const [betAmount, setBetAmount] = useState<number>(0);

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
		updateBalance(Number((balance - amount).toFixed(2)));
		setBetAmount(amount);
		return true;
	}

	function startGame() {
		setGameStarted(true);
		setPlayerChoice(null);
		setDealerChoice(null);
		setResult(null);
	}

	function resetGame() {
		setGameStarted(false);
		setPlayerChoice(null);
		setDealerChoice(null);
		setResult(null);
	}

	function handlePlayerChoice(choice: Choice) {
		if (!gameStarted) return;

		// Dealer choisi (rigged par défaut)
		let dealer: Choice;
		if (Math.random() < RIGGED_PROB) {
			dealer = counter[choice]; // te bat
		} else {
			dealer = choices[Math.floor(Math.random() * choices.length)];
		}

		// Résultat
		let outcome: string;
		if (dealer === choice) {
			outcome = "It's a Draw!";
		} else if (beats[choice] === dealer) {
			outcome = "You Win!";
		} else {
			outcome = "You Lose!";
		}

		// MAJ états en une fois
		setPlayerChoice(choice);
		setDealerChoice(dealer);
		setResult(outcome);

		// payout handling: win => 2x, draw => return bet, loss => nothing
		if (outcome === "You Win!") {
			const payout = Number((betAmount * 2).toFixed(2));
			updateBalance(Number((balance + payout).toFixed(2)));
		} else if (outcome === "It's a Draw!") {
			const payout = Number(betAmount.toFixed(2));
			updateBalance(Number((balance + payout).toFixed(2)));
		}

		// clear placed bet after result
		setBetAmount(0);
	}

	return (
		<>
			<Navbar />
			<section className="rigged-paper-scissors">
				<div className="rigged-container">
					<div className="rigged-game-status">
						{!gameStarted && (
							<button
								className="start-game-button game-button"
								onClick={startGame}
							>
								Start Game
							</button>
						)}
						{playerChoice && gameStarted && (
							<>
								<div className="rigged-actions">
									<p>{result}</p>
									<button className="game-button" onClick={resetGame}>
										Play again
									</button>
								</div>
							</>
						)}
					</div>

					{/* Dealer */}
					<div className="rigged-dealer-container">
						<div
							className={`${
								dealerChoice === "rock" ? "selected" : ""
							} rigged-choices`}
						>
							<img src="/icons/rock.svg" alt="Rock" />
						</div>
						<div
							className={`${
								dealerChoice === "paper" ? "selected" : ""
							} rigged-choices`}
						>
							<img src="/icons/paper.svg" alt="Paper" />
						</div>
						<div
							className={`${
								dealerChoice === "scissors" ? "selected" : ""
							} rigged-choices`}
						>
							<img src="/icons/scissors.svg" alt="Scissors" />
						</div>
					</div>

					<div className="rigged-separator" />

					{/* Player */}
					<div className="rigged-player-container">
						<div
							className={`${
								playerChoice === "rock" ? "selected" : ""
							} rigged-choices`}
							onClick={() => handlePlayerChoice("rock")}
						>
							<img src="/icons/rock.svg" alt="Rock" />
						</div>
						<div
							className={`${
								playerChoice === "paper" ? "selected" : ""
							} rigged-choices`}
							onClick={() => handlePlayerChoice("paper")}
						>
							<img src="/icons/paper.svg" alt="Paper" />
						</div>
						<div
							className={`${
								playerChoice === "scissors" ? "selected" : ""
							} rigged-choices`}
							onClick={() => handlePlayerChoice("scissors")}
						>
							<img src="/icons/scissors.svg" alt="Scissors" />
						</div>
					</div>
				</div>
				{/* BetSection under the game */}
				<div style={{ width: "100%", marginTop: 16 }}>
					<BetSection balance={balance} onPlace={handlePlace} />
				</div>
			</section>
		</>
	);
}
