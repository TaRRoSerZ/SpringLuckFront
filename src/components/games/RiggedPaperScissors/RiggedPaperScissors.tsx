import "./RiggedPaperScissors.css";
import Navbar from "../../Navbar";
import { useState } from "react";

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
      </section>
    </>
  );
}
