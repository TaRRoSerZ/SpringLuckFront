export type GameInfo = {
  id: number;
  title: string;
  imageUrl: string;
  tag?: string;
};

export const GAMES: GameInfo[] = [
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
