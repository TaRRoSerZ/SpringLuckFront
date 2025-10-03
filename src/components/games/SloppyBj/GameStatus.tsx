// GameStatus.tsx
import React from "react";

type GameStatusProps = {
  gameStatus: string;
  onRestart: () => void;
};

const GameStatus: React.FC<GameStatusProps> = ({ gameStatus, onRestart }) => {
  return (
    <div className="game-status">
      <p className="status-message">{gameStatus}</p>
      <button className="play-button" onClick={onRestart}>
        Restart Game
      </button>
    </div>
  );
};

export default GameStatus;
