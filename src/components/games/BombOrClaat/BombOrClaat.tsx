import React, { useCallback, useMemo, useState } from "react";
import "./BombOrClaat.css";
import Navbar from "../../Navbar";

type Cell = {
	id: number;
	row: number;
	col: number;
	hasBomb: boolean;
	revealed: boolean;
	flagged: boolean;
};

type GameState = "idle" | "running" | "lost" | "won" | "cashed";

type Props = {
	rows?: number;
	cols?: number;
	defaultBombs?: number;
};

function shuffleInPlace<T>(arr: T[], rng: () => number) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

function makeRng(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (1664525 * s + 1013904223) >>> 0;
		return (s & 0xfffffff) / 0x10000000;
	};
}

export default function BombOrClaat({
	rows = 5,
	cols = 5,
	defaultBombs = 3,
}: Props) {
	const [bombs, setBombs] = useState(defaultBombs);
	const [state, setState] = useState<GameState>("idle");
	const [cells, setCells] = useState<Cell[]>([]);
	const [safeRevealed, setSafeRevealed] = useState(0);
	const [seed, setSeed] = useState<number>(() => Date.now() % 2147483647);
	const total = rows * cols;

	const startGame = useCallback(() => {
		const rng = makeRng(seed);
		const base: Cell[] = Array.from({ length: total }, (_, i) => ({
			id: i,
			row: Math.floor(i / cols),
			col: i % cols,
			hasBomb: false,
			revealed: false,
			flagged: false,
		}));
		const ids = base.map((c) => c.id);
		shuffleInPlace(ids, rng);
		const bombSet = new Set<number>(ids.slice(0, bombs));
		const prepared = base.map((c) => ({ ...c, hasBomb: bombSet.has(c.id) }));

		setCells(prepared);
		setSafeRevealed(0);
		setState("running");
	}, [bombs, cols, seed, total]);

	const reset = useCallback(() => {
		setSeed((s) => (s * 1103515245 + 12345) % 2147483647);
		setCells([]);
		setSafeRevealed(0);
		setState("idle");
	}, []);

	const revealedCount = safeRevealed;
	const remainingTiles = total - revealedCount;
	const remainingBombs =
		bombs - cells.filter((c) => c.revealed && c.hasBomb).length;
	const remainingSafe = total - bombs - revealedCount;

	const currentMultiplier = useMemo(() => {
		if (revealedCount === 0) return 1;
		let m = 1;
		for (let k = 0; k < revealedCount; k++) {
			m *= (total - k) / (total - bombs - k);
		}
		return Number(m.toFixed(3));
	}, [revealedCount, total, bombs]);

	const nextPickMultiplier = useMemo(() => {
		if (state !== "running") return 0;
		if (remainingSafe <= 0) return 0;
		const oddsFactor =
			remainingTiles > remainingBombs
				? remainingTiles / (remainingTiles - remainingBombs)
				: 0;
		return Number((currentMultiplier * oddsFactor).toFixed(3));
	}, [currentMultiplier, remainingBombs, remainingSafe, remainingTiles, state]);

	const handleReveal = useCallback(
		(cell: Cell) => {
			if (state !== "running") return;
			if (cell.revealed) return;

			setCells((prev) =>
				prev.map((c) => (c.id === cell.id ? { ...c, revealed: true } : c))
			);

			if (cell.hasBomb) {
				setState("lost");
			} else {
				setSafeRevealed((n) => n + 1);
				if (safeRevealed + 1 >= total - bombs) {
					setState("won");
				}
			}
		},
		[bombs, safeRevealed, state, total]
	);

	const cashOut = useCallback(() => {
		if (state !== "running") return;
		setState("cashed");
	}, [state]);

	const statusText = useMemo(() => {
		switch (state) {
			case "idle":
				return "Choisis le nombre de bombes puis démarre la partie.";
			case "running":
				return "À toi de jouer ! Évite les bombes et trouve des diamants.";
			case "lost":
				return "💥 Boom ! Tu as touché une bombe. Réessaie !";
			case "won":
				return "🎉 Incroyable ! Tu as trouvé tous les diamants !";
			case "cashed":
				return "✅ Tu as encaissé tes gains.";
		}
	}, [state]);

	const canChangeBombs = state === "idle";

	return (
		<>
			<Navbar />
			<div className="wrapper">
				{/* Titre global en haut, sticky */}
				<div className="pageHeader">
					<h2 className="title">Bomb or claat</h2>
				</div>

				{/* Layout 2 colonnes : grille à gauche, panneau à droite */}
				<div className="content">
					<div className="left">
						<div className="gridOuter">
							<div
								className="grid"
								style={{
									gridTemplateColumns: `repeat(${cols}, 1fr)`,
									gridTemplateRows: `repeat(${rows}, 1fr)`,
									["--rows" as any]: rows,
									["--cols" as any]: cols,
								}}
								role="grid"
								aria-disabled={state !== "running"}
							>
								{(cells.length > 0
									? cells
									: Array.from({ length: total }, (_, i) => ({
											id: i,
											row: Math.floor(i / cols),
											col: i % cols,
											hasBomb: false,
											revealed: false,
											flagged: false,
									  }))
								).map((cell) => {
									const isDisabled = state !== "running" || cell.revealed;
									const cellStateClass = cell.revealed
										? cell.hasBomb
											? "bomb"
											: "diamond"
										: "hidden";

									return (
										<button
											key={cell.id}
											className={`cell ${cellStateClass}`}
											onClick={() => handleReveal(cell as Cell)}
											disabled={isDisabled}
											aria-label={
												cell.revealed
													? cell.hasBomb
														? "Bombe révélée"
														: "Diamant révélé"
													: "Case cachée"
											}
											role="gridcell"
										>
											<span
												className={`icon ${
													cell.revealed
														? cell.hasBomb
															? "icon--bomb"
															: "icon--diamond"
														: "icon--hidden"
												}`}
												aria-hidden="true"
											/>
										</button>
									);
								})}
							</div>
						</div>
					</div>

					<aside className="right sidebar">
						<div className="controls">
							<label className="control">
								<span>Bombes</span>
								<input
									type="number"
									min={1}
									max={Math.max(1, total - 1)}
									value={bombs}
									disabled={!canChangeBombs}
									onChange={(e) => {
										const v = Number(e.target.value);
										const clamped = Math.max(1, Math.min(v, total - 1));
										setBombs(clamped);
									}}
									className="input"
								/>
							</label>
							{state === "idle" ? (
								<button className="primary" onClick={startGame}>
									Démarrer
								</button>
							) : (
								<>
									<button className="secondary" onClick={reset}>
										Réinitialiser
									</button>
									{state === "running" && (
										<button className="cash" onClick={cashOut}>
											Encaisser ({currentMultiplier}×)
										</button>
									)}
								</>
							)}
						</div>

						<div className="statsRow" aria-live="polite">
							<div className="stat">
								<span className="statLabel">État</span>
								<span className="statValue">{statusText}</span>
							</div>
							<div className="stat">
								<span className="statLabel">Grille</span>
								<span className="statValue">
									{rows}×{cols} ({total} cases)
								</span>
							</div>
							<div className="stat">
								<span className="statLabel">Révélées</span>
								<span className="statValue">{revealedCount}</span>
							</div>
							<div className="stat">
								<span className="statLabel">Sûres restantes</span>
								<span className="statValue">{Math.max(0, remainingSafe)}</span>
							</div>
							<div className="stat">
								<span className="statLabel">Multiplicateur</span>
								<span className="statValue">
									{currentMultiplier}×
									{state === "running" && nextPickMultiplier > 0 && (
										<span className="nextHint">
											{" "}
											→ Prochain pick: {nextPickMultiplier}×
										</span>
									)}
								</span>
							</div>
						</div>
					</aside>
				</div>

				{(state === "lost" || state === "won" || state === "cashed") && (
					<div className="footer">
						{state === "lost" && (
							<button className="primary" onClick={reset}>
								Rejouer
							</button>
						)}
						{(state === "won" || state === "cashed") && (
							<>
								<div className="payout">
									Gain simulé: <strong>{currentMultiplier}×</strong>
								</div>
								<button className="primary" onClick={reset}>
									Nouvelle partie
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</>
	);
}
