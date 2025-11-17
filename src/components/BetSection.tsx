import { useMemo, useState } from "react";
import "../styles/BetSection.css";

type Props = {
  balance?: number;
  currency?: string;
  initial?: number;
  /** should return true if place accepted, false otherwise (can be async) */
  onPlace?: (amount: number) => boolean | Promise<boolean>;
};

export default function BetSection({
  balance = 0,
  currency = "€",
  initial = 0,
  onPlace,
}: Props) {
  const [amount, setAmount] = useState<string>(
    initial > 0 ? initial.toString() : ""
  );
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clampedAmount = useMemo(
    () => Math.max(0, Number(amount || 0)),
    [amount]
  );

  const handleChange = (v: string) => {
    // Permettre les nombres avec virgule ou point
    if (v === "" || /^\d*[.,]?\d*$/.test(v)) {
      setAmount(v);
    }
  };

  const double = () => {
    const current = Number(amount.replace(",", ".")) || 0;
    setAmount((Math.round(current * 2 * 100) / 100).toString());
  };

  const half = () => {
    const current = Number(amount.replace(",", ".")) || 0;
    setAmount((Math.round((current / 2) * 100) / 100).toString());
  };

  const canPlace = useMemo(
    () => clampedAmount > 0 && (balance <= 0 || clampedAmount <= balance),
    [clampedAmount, balance]
  );

  return (
    <div className="bet-panel">
      <div className="bet-panel-inner">
        <div className="bet-header">
          <div className="bet-title">Place Your Bet</div>
          <div className="bet-balance">
            <div className="balance-label">Available Balance</div>
            <div className="balance-amount">
              {balance.toFixed(2)} {currency}
            </div>
          </div>
        </div>

        <div className="bet-body">
          <label className="input-label" htmlFor="bet-amount">
            Amount of bet
          </label>

          <div className="input-row">
            <input
              id="bet-amount"
              className="bet-input"
              type="number"
              min={0}
              step={0.01}
              value={amount}
              onChange={(e) => handleChange(e.target.value)}
              aria-label="Amount of bet"
            />

            <div className="quick-controls">
              <button
                type="button"
                className="quick-btn"
                onClick={double}
                aria-label="Double amount">
                X2
              </button>
              <button
                type="button"
                className="quick-btn"
                onClick={half}
                aria-label="Half amount">
                /2
              </button>
            </div>
          </div>

          <button
            className="place-btn"
            onClick={async () => {
              setError(null);
              const result = onPlace ? onPlace(clampedAmount) : true;
              const accepted =
                result instanceof Promise ? await result : result;
              if (accepted) {
                setPlaced(true);
                setTimeout(() => setPlaced(false), 2000);
              } else {
                setPlaced(false);
                setError("Solde insuffisant");
              }
            }}
            disabled={!canPlace}>
            Place order
          </button>

          {placed && (
            <div className="bet-placed">
              Mise placée: {clampedAmount} {currency}
            </div>
          )}
          {error && <div className="bet-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
