import { useMemo, useState } from "react";
import "../styles/BetSection.css";

type Props = {
	balance?: number;
	currency?: string;
	initial?: number;
	/** should return true if place accepted, false otherwise */
	onPlace?: (amount: number) => boolean;
};

export default function BetSection({
	balance = 0,
	currency = "$",
	initial = 0,
	onPlace,
}: Props) {
	const [amount, setAmount] = useState<number>(initial);
	const [placed, setPlaced] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const clampedAmount = useMemo(
		() => Math.max(0, Number(amount || 0)),
		[amount]
	);

	const handleChange = (v: string) => {
		const n = Number(v);
		if (Number.isNaN(n)) return setAmount(0);
		setAmount(n);
	};

	const double = () => setAmount((a) => Math.round((a || 0) * 2 * 100) / 100);
	const half = () => setAmount((a) => Math.round(((a || 0) / 2) * 100) / 100);

	const canPlace = useMemo(
		() => clampedAmount > 0 && (balance <= 0 || clampedAmount <= balance),
		[clampedAmount, balance]
	);

	return (
		<div className="bet-panel">
			<div className="bet-header">
				<div className="bet-title">Checkout</div>
				<div className="bet-balance">
					<div className="balance-label">Total</div>
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
							aria-label="Double amount"
						>
							X2
						</button>
						<button
							type="button"
							className="quick-btn"
							onClick={half}
							aria-label="Half amount"
						>
							/2
						</button>
					</div>
				</div>

				<button
					className="place-btn"
					onClick={() => {
						setError(null);
						const accepted = onPlace ? onPlace(clampedAmount) : true;
						if (accepted) {
							setPlaced(true);
						} else {
							setPlaced(false);
							setError("Solde insuffisant");
						}
					}}
					disabled={!canPlace}
				>
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
	);
}
