import "./DiddySco.css";
import Navbar from "../../Navbar";
import { useEffect, useRef, useState } from "react";

const DiddySco = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [winSymbol, setWinSymbol] = useState<string | null>(null); // État pour le symbole gagnant
  const [winMultiplier, setWinMultiplier] = useState<number>(0); // État pour le multiplicateur de gain

  const winningSymbolsRef = useRef<string[]>([]);

  const symbols = ["discoBall", "star", "musicNote", "headphones", "guitar"];

  class Column {
    x: number;
    y: number;
    width: number;
    height: number;
    symbols: string[];
    speed: number = 1;
    velocity: number = 0;
    delay: number;
    visibleSymbols: string[] = []; // Liste des symboles visibles à l'écran

    constructor(
      x: number,
      y: number,
      width: number,
      height: number,
      symbols: string[],
      delay: number
    ) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.symbols = symbols;
      this.delay = delay;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "hsl(214, 28%, 10%)";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "white";
      ctx.font = window.innerWidth < 768 ? "20px Arial" : "30px Arial";
    }

    drawSymbols(
      ctx: CanvasRenderingContext2D,
      highlightSymbols: string[], // passe la liste à jour en paramètre
      canvas: HTMLCanvasElement = canvasRef.current!
    ) {
      const symbolHeight = this.height / this.symbols.length;
      this.visibleSymbols = [];
      this.symbols.forEach((symbol, index) => {
        const img = images.find((img) => img.src.includes(symbol));
        if (img) {
          const divider = window.innerWidth < 768 ? 3 : 1.5;
          const symbolYPosition =
            this.y + index * symbolHeight + img.height / (divider * 1.5);

          if (symbolYPosition >= 0 && symbolYPosition <= canvas.height) {
            this.visibleSymbols.push(symbol);
          }

          ctx.drawImage(
            img,
            this.x + this.width / 2 - img.width / (divider * 2),
            symbolYPosition,
            img.width / divider,
            img.height / divider
          );

          // Highlight à partir du paramètre highlightSymbols
          if (highlightSymbols.includes(symbol)) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            ctx.fillRect(
              this.x,
              symbolYPosition - img.height / 3,
              this.width,
              symbolHeight
            );
          }
        }
      });
    }

    spinColumn() {
      if (this.delay > 0) {
        this.delay--;
        return false;
      }
      this.velocity += this.speed;
      this.y += this.velocity;

      if (this.y >= 0) {
        this.y = 0;
        return true; // Retourne true quand la colonne s'arrête
      }
      return false;
    }

    resetColumn() {
      this.y = -this.height; // Réinitialiser la colonne au départ
      this.velocity = 0; // Réinitialiser la vitesse
    }
  }

  function setCanvasSize(canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    canvas.width =
      window.innerWidth < 768
        ? window.innerWidth * 0.95
        : window.innerWidth * 0.8;
    canvas.height =
      window.innerWidth < 768
        ? window.innerHeight * 0.5
        : window.innerHeight * 0.7;
  }

  function shuffleArray(array: any[], count: number) {
    let newArray = [];
    for (let i = 0; i < count; i++) {
      newArray.push(array[Math.floor(Math.random() * array.length)]);
    }
    return newArray;
  }

  let columns: Column[] = [];

  function drawColumn(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    for (let i = 0; i < 5; i++) {
      const SYMBOLS_PER_COLUMN = 5;
      const COLUMN_MULTIPLIER = 5;

      const shuffledSymbols = shuffleArray(
        symbols,
        SYMBOLS_PER_COLUMN * COLUMN_MULTIPLIER
      );

      const columnWidth = canvas.width / 5;
      const columnHeight = canvas.height * COLUMN_MULTIPLIER;
      const x = i * columnWidth;
      const y = -columnHeight + canvas.height;

      const column = new Column(
        x,
        y,
        columnWidth,
        columnHeight,
        shuffledSymbols,
        i * 10
      );
      columns.push(column);
    }
    columns.forEach((column) => {
      column.draw(ctx);
      column.drawSymbols(ctx, winningSymbolsRef.current);
    });

    drawSeparatorLines(canvas, ctx);
  }

  function drawSeparatorLines(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    for (let i = 1; i <= 4; i++) {
      const x = (canvas.width / 5) * i;
      ctx.strokeStyle = "hsl(214, 12%, 22%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  }

  // Fonction pour charger les images
  useEffect(() => {
    let loadedImages = 0;
    const loadedImgs: HTMLImageElement[] = [];
    symbols.forEach((symbol) => {
      const img = new Image();
      img.src = "/symbols/" + symbol + ".svg";
      img.onload = () => {
        loadedImages++;
        loadedImgs.push(img);
        if (loadedImages === symbols.length) {
          setImages(loadedImgs);
          setImagesLoaded(true);
        }
      };
    });
  }, [symbols]);

  function animate(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allColumnsStopped = true;
    columns.forEach((column) => {
      if (!column.spinColumn()) allColumnsStopped = false;
      column.draw(ctx);
      // highlightSymbols vient du ref
      column.drawSymbols(ctx, winningSymbolsRef.current);
    });
    drawSeparatorLines(canvas, ctx);
    if (allColumnsStopped) {
      setSpinning(false);
      checkWin();
    } else {
      requestAnimationFrame(() => animate(canvas, ctx));
    }
  }

  function checkWin() {
    const visibleSymbols = columns.flatMap((column) => column.visibleSymbols);

    const counts = visibleSymbols.reduce(
      (acc, s) => ({ ...acc, [s]: (acc[s] || 0) + 1 }),
      {} as Record<string, number>
    );

    let totalMultiplier = 0;
    const newWinningSymbols: string[] = [];

    for (const [symbol, count] of Object.entries(counts)) {
      if (count >= 8) {
        let multiplier = 0;
        switch (symbol) {
          case "discoBall":
            multiplier = 0.25;
            break;
          case "star":
            multiplier = 0.5;
            break;
          case "musicNote":
            multiplier = 0.75;
            break;
          case "headphones":
            multiplier = 1;
            break;
          case "guitar":
            multiplier = 1.5;
            break;
          default:
            break;
        }

        // Si un symbole apparaît plus de 8 fois, on ajoute son multiplicateur
        const numberOfOccurrences = Math.floor(count / 8); // Calcul du nombre de groupes de 8
        totalMultiplier += multiplier * numberOfOccurrences;

        // Ajouter le symbole à la liste des symboles gagnants
        newWinningSymbols.push(symbol);
      }
    }

    // Mettre à jour immédiatement les symboles gagnants et le multiplicateur
    winningSymbolsRef.current = newWinningSymbols;
    setWinMultiplier(totalMultiplier); // Assurer que l'état du multiplicateur est bien mis à jour

    // Mise à jour du message de gain
    if (newWinningSymbols.length > 0) {
      setWinSymbol("Vous avez gagné !");
    } else {
      setWinSymbol(null);
    }

    // Redessiner immédiatement pour appliquer l'effet
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      columns.forEach((column) => {
        column.draw(ctx);
        column.drawSymbols(ctx, winningSymbolsRef.current); // Passer la liste des symboles gagnants
      });
      drawSeparatorLines(canvas, ctx);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;
    const newCtx = canvas.getContext("2d");
    if (!newCtx) return;

    setCanvasSize(canvas);
    drawColumn(canvas, newCtx);

    function handleResize() {
      setCanvasSize(canvas);
      if (canvas && newCtx) {
        columns = [];
        drawColumn(canvas, newCtx);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [imagesLoaded]);

  const handleSpin = () => {
    if (spinning) return;
    setWinSymbol(null);
    setWinMultiplier(0);
    winningSymbolsRef.current = [];
    // Réinitialiser les colonnes et démarrer l'animation
    columns.forEach((column) => column.resetColumn());
    setSpinning(true); // Activer l'animation
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;
    const newCtx = canvas.getContext("2d");
    if (!newCtx) return;
    drawColumn(canvas, newCtx); // Dessiner les colonnes initialement
    animate(canvas, newCtx); // Démarrer l'animation
  };

  return (
    <>
      <Navbar />
      <section className="diddy-sco">
        <canvas className="diddy-sco-canvas" ref={canvasRef}></canvas>
        <button
          className="diddy-sco-button"
          disabled={spinning} // Désactive le bouton pendant l'animation
          onClick={handleSpin}
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>
        {winSymbol && <div className="win-message">{winMultiplier}x</div>}
      </section>
    </>
  );
};

export default DiddySco;
