// Service pour gérer les transactions utilisateur

const API_BASE_URL = "http://localhost:8083";

export interface Transaction {
  id: number;
  userId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
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
 * Calcule le total des transactions
 */
export const calculateTotalBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === "deposit"
      ? total + transaction.amount
      : total - transaction.amount;
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
    .filter((t) => new Date(t.createdAt) >= cutoffDate)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export default {
  fetchUserTransactions,
  calculateTotalBalance,
  getRecentTransactions,
};
