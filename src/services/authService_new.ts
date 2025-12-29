const API_BASE_URL = "https://springluck.onrender.com";

import { getUserInfo, isAuthenticated, getToken } from "../keycloak/keycloak";

export interface UserData {
  id: string;
  balance: number;
}

/**
 * Synchronise l'utilisateur Keycloak avec le backend Spring
 */
export const syncUser = async (): Promise<boolean> => {
  if (!isAuthenticated()) {
    console.error("User is not authenticated, cannot sync");
    return false;
  }
  try {
    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.email) {
      console.error("Cannot decode token for sync or missing email");
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ email: userInfo.email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("User sync failed:", errorData);
      return false;
    }
    console.log("✅ User synced successfully");
    return true;
  } catch (error) {
    console.error("Error syncing user:", error);
    return false;
  }
};

export const getUserData = async (): Promise<UserData | null> => {
  if (!isAuthenticated()) {
    console.error("User is not authenticated, cannot fetch user data");
    return null;
  }
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.email) {
    console.error("Cannot decode token to get user email");
    return null;
  }
  const userEmail = userInfo.email;
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userEmail}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user data");
      return null;
    }

    const data: UserData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export default {
  syncUser,
  getUserData,
};
