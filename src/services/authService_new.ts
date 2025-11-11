// Service de synchronisation avec le backend Spring

const API_BASE_URL = "http://localhost:8083";

/**
 * Décode le JWT token pour extraire les informations utilisateur
 */
const decodeToken = (
  token: string
): { email?: string; sub?: string } | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Synchronise l'utilisateur Keycloak avec le backend Spring
 */
export const syncUser = async (accessToken: string): Promise<boolean> => {
  try {
    const userInfo = decodeToken(accessToken);
    if (!userInfo || !userInfo.email) {
      console.error("Cannot decode token for sync or missing email");
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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

export default {
  syncUser,
};
