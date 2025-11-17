import { useBalance } from "../contexts/BalanceContext";

/**
 * Hook personnalisé pour gérer la balance et les transactions dans les jeux
 * Utilise maintenant le BalanceContext pour partager la balance globalement
 * @deprecated Utilisez directement useBalance() du contexte
 */
export function useGameBalance() {
  return useBalance();
}
