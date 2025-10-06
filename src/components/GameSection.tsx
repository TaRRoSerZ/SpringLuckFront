import "../styles/GameSection.css";
import GameCard from "./GameCard";
import { useRef, useEffect, useState, useCallback } from "react";

const cardsContent = [
  {
    id: 1,
    title: "Bomb or Claat",
    imageUrl: "/icons/BombOrClaat.svg",
    tag: "New",
  },
  {
    id: 2,
    title: "Sloppy BJ",
    imageUrl: "/icons/SloppyBJ.svg",
    tag: "Hot",
  },
  {
    id: 3,
    title: "Diddy Scothèque",
    imageUrl: "/icons/diddySco.svg",
  },
  {
    id: 4,
    title: "Rigged Paper Scissors",
    imageUrl: "/icons/rigged-paper-scissors.svg",
  },
];

const GameSection = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateCanScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxLeft = scrollWidth - clientWidth;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft < maxLeft - 1); // -1 pour tolérance flottante
  }, []);

  useEffect(() => {
    updateCanScroll();
    const el = listRef.current;
    if (!el) return;

    // écoute le scroll + resize
    el.addEventListener("scroll", updateCanScroll, { passive: true });
    window.addEventListener("resize", updateCanScroll);
    // mutation (si des cartes se chargent async)
    const mo = new ResizeObserver(updateCanScroll);
    mo.observe(el);

    return () => {
      el.removeEventListener("scroll", updateCanScroll);
      window.removeEventListener("resize", updateCanScroll);
      mo.disconnect();
    };
  }, [updateCanScroll]);

  const scrollByOneCard = useCallback((dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>(".game-card");
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(el).gap || "0");
    const delta = (cardWidth + gap) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);
  return (
    <section
      id="games"
      className="game-section"
      data-can-left={canLeft ? "true" : "false"}
      data-can-right={canRight ? "true" : "false"}
    >
      <div className="scroll-buttons">
        <button
          className={`scroll-button left ${canLeft ? "is-visible" : ""}`}
          aria-label="Scroll Left"
          onClick={() => scrollByOneCard(-1)}
          disabled={!canLeft}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 8H1M1 8L8 1M1 8L8 15"
              stroke="#D6DDE6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className={`scroll-button right ${canRight ? "is-visible" : ""}`}
          aria-label="Scroll Right"
          onClick={() => scrollByOneCard(1)}
          disabled={!canRight}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 8H15M15 8L8 1M15 8L8 15"
              stroke="#D6DDE6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div
        className={`game-shadow right ${canRight ? "is-visible" : ""}`}
      ></div>
      <div className={`game-shadow left ${canLeft ? "is-visible" : ""}`}></div>
      <div className="game-cards-container" ref={listRef}>
        {cardsContent.map((card) => (
          <GameCard
            key={card.id}
            id={card.id}
            title={card.title}
            imageUrl={card.imageUrl}
            tag={card.tag}
          />
        ))}
      </div>
    </section>
  );
};

export default GameSection;
