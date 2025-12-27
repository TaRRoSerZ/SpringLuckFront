// SloppyBj.tsx
import { useState } from "react";
import "./SloppyBj.css";
import Navbar from "../../Navbar";
import BetSection from "../../BetSection";
import Player from "./Player";
import Dealer from "./Dealer";
import GameStatus from "./GameStatus";
import { useBalance } from "../../../contexts/BalanceContext";

type CardValue = number | "A";
type Card = { name: string; value: CardValue };

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

const getRandomCard = () => deck[Math.floor(Math.random() * deck.length)];

const calculateScore = (cards: Card[]) => {
  let total = 0;
  let aces = 0;

  cards.forEach((card) => {
    if (!card || !card.value) {
      console.error("Invalid card detected:", card);
      return;
    }

    if (card.value === "A") {
      aces += 1;
      total += 11;
    } else {
      total += card.value;
    }
  });

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
};

const dealerTurn = (
  bjCards: Card[],
  setBjCards: React.Dispatch<React.SetStateAction<Card[]>>,
  setBjScore: React.Dispatch<React.SetStateAction<number>>,
  yourScore: number,
  setGameStatus: React.Dispatch<React.SetStateAction<string>>,
  setIsDealerCardRevealed: React.Dispatch<React.SetStateAction<boolean>>
): string => {
  const newBjCards = [...bjCards];

  let newBjScore = calculateScore(newBjCards);

  while (newBjScore < 17) {
    const newCard = getRandomCard();
    newBjCards.push(newCard);
    newBjScore = calculateScore(newBjCards);
  }

  setBjCards(newBjCards);
  setBjScore(newBjScore);
  setIsDealerCardRevealed(true);

  let status = "";
  if (newBjScore > 21) {
    status = "Dealer Busts! You Win!";
  } else if (newBjScore === 21) {
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
  const [gameStatus, setGameStatus] = useState("");

  const [betAmount, setBetAmount] = useState<number>(0);

  // Utiliser le contexte pour la balance et les transactions
  const { balance, placeBet, recordWin } = useBalance();
  async function handlePlace(amount: number) {
    const success = await placeBet(amount);
    if (!success) return false;

    setBetAmount(amount);

    // Lancer automatiquement la partie
    setIsGameStarted(true);
    setGameStatus("");

    // Distribuer les cartes
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

    return true;
  }

  const handleStand = async () => {
    setIsDealerCardRevealed(true);
    const result = dealerTurn(
      bjCards,
      setBjCards,
      setBjScore,
      yourScore,
      setGameStatus,
      setIsDealerCardRevealed
    );

    console.log("Result from dealerTurn:", result);

    if (result.includes("You Win") || result.includes("Dealer Busts")) {
      await recordWin(betAmount * 2);
    }

    if (result.includes("Draw")) {
      await recordWin(betAmount);
    }

    setIsGameStarted(false);
    setBetAmount(0);
  };

  const handleHit = () => {
    const newCard = getRandomCard();
    const newCards = [...yourCards, newCard];
    setYourCards(newCards);
    const newScore = calculateScore(newCards);
    setYourScore(newScore);

    if (newScore > 21) {
      setIsDealerCardRevealed(true);
      setGameStatus("You Bust! Dealer Wins!");
      setIsGameStarted(false);
      setBetAmount(0);
    }
  };

  const handleRestart = () => {
    setIsGameStarted(false);
    setIsDealerCardRevealed(false);
    setGameStatus("");
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
            calculateScore={calculateScore}
          />
          <div className="sloppy-separator"></div>
          <Player cards={yourCards} score={yourScore} />
          <div className="sloppy-controls">
            {gameStatus ? (
              <GameStatus gameStatus={gameStatus} onRestart={handleRestart} />
            ) : isGameStarted ? (
              <>
                <button className="play-button" onClick={handleStand}>
                  Stand
                </button>
                <button className="play-button" onClick={handleHit}>
                  Hit
                </button>
              </>
            ) : null}
          </div>
        </div>
        <BetSection balance={balance} onPlace={handlePlace} currency="€" />
      </section>
    </>
  );
};

export default SloppyBj;
