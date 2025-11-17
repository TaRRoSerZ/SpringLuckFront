import { useState, useEffect } from "react";
import { getUserData } from "../services/authService_new";
import { createTransaction } from "../services/transactionService";

/**
 * Hook personnalisé pour gérer la balance et les transactions dans les jeux
 * Centralise la logique commune à tous les jeux (SloppyBj, DiddySco, RiggedPaperScissors)
 */
export function useGameBalance() {
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true);

  // Recharger la balance depuis le backend
  async function reloadBalance() {
    try {
      const userData = await getUserData();
      if (userData && userData.balance !== undefined) {
        const balanceInEuros = userData.balance / 100;
        setBalance(balanceInEuros);
        sessionStorage.setItem("balance", balanceInEuros.toFixed(2));
      }
    } catch (error) {
      console.error("Error reloading balance:", error);
    }
  }

  // Charger la balance au montage du composant
  useEffect(() => {
    const loadInitialBalance = async () => {
      setIsLoadingBalance(true);
      await reloadBalance();
      setIsLoadingBalance(false);
    };
    loadInitialBalance();
  }, []);

  // Placer un pari (crée une transaction BET_PLACED)
  async function placeBet(amount: number): Promise<boolean> {
    if (amount <= 0 || amount > balance) return false;

    try {
      await createTransaction(amount, "BET_PLACED");
      await reloadBalance();
      return true;
    } catch (error) {
      console.error("Error placing bet:", error);
      return false;
    }
  }

  // Enregistrer un gain (crée une transaction BET_WIN)
  async function recordWin(winAmount: number): Promise<boolean> {
    try {
      await createTransaction(winAmount, "BET_WIN");
      await reloadBalance();
      return true;
    } catch (error) {
      console.error("Error recording win:", error);
      return false;
    }
  }

  return {
    balance,
    isLoadingBalance,
    reloadBalance,
    placeBet,
    recordWin,
  };
}
