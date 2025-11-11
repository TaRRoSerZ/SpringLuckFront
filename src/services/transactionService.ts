// Service pour gérer les transactions utilisateur

const API_BASE_URL = "http://localhost:8083";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  betId?: string | null;
  stripeIntentId?: string | null;
  description?: string;
}

/**
 * Récupère les transactions d'un utilisateur
 */
export const fetchUserTransactions = async (
  userId: string,
  token: string
): Promise<Transaction[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions/user/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch transactions");
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

/**
 * Calcule le total des transactions (seulement les completed)
 */
export const calculateTotalBalance = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.status === "completed" || t.status === "succeeded")
    .reduce((total, transaction) => {
      // L'amount est en centimes, on divise par 100
      const amountInDollars = transaction.amount / 100;
      return transaction.type === "deposit"
        ? total + amountInDollars
        : total - amountInDollars;
    }, 0);
};

/**
 * Filtre les transactions récentes (7 derniers jours)
 */
export const getRecentTransactions = (
  transactions: Transaction[],
  days: number = 7
): Transaction[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return transactions
    .filter((t) => new Date(t.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default {
  fetchUserTransactions,
  calculateTotalBalance,
  getRecentTransactions,
};
