import { getUserInfo, getToken, isAuthenticated } from "../keycloak/keycloak";

const API_BASE_URL = "https://springluck.onrender.com";

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

export async function createTransaction(amount: number, type: string) {
  const userInfo = getUserInfo();
  const token = getToken();

  if (!userInfo || !token || !isAuthenticated()) {
    console.error("User info or token is missing, cannot create transaction");
    return null;
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/transaction?email=${
        userInfo.email
      }&type=${type}&amount=${amount * 100}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error creating transaction:", error);
    return null;
  }
}

export default {
  fetchUserTransactions,
  createTransaction,
};
