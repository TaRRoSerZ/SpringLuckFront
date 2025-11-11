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

export default {
  fetchUserTransactions,
};
