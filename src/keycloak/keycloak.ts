import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:9090",
  realm: "springluck",
  clientId: "springluck-app",
});

// Flag pour empêcher la double initialisation
let isInitialized = false;

/**
 * Initialise Keycloak avec les options par défaut
 */
export const initKeycloak = async (
  onAuthSuccess?: () => void,
  onAuthError?: () => void
): Promise<boolean> => {
  // Empêcher la double initialisation
  if (isInitialized) {
    console.log("⚠️ Keycloak already initialized");
    const authenticated = keycloak.authenticated || false;
    if (authenticated) {
      onAuthSuccess?.();
    } else {
      onAuthError?.();
    }
    return authenticated;
  }

  try {
    const authenticated = await keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
    });

    isInitialized = true;

    if (authenticated) {
      console.log("✅ User is authenticated");
      // Stocker les tokens dans sessionStorage
      if (keycloak.token) {
        sessionStorage.setItem("access_token", keycloak.token);
      }
      if (keycloak.refreshToken) {
        sessionStorage.setItem("refresh_token", keycloak.refreshToken);
      }
      onAuthSuccess?.();
    } else {
      console.log("ℹ️ User is not authenticated");
      onAuthError?.();
    }

    // Rafraîchir le token automatiquement
    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed && keycloak.token) {
            console.log("✅ Token refreshed");
            sessionStorage.setItem("access_token", keycloak.token);
            if (keycloak.refreshToken) {
              sessionStorage.setItem("refresh_token", keycloak.refreshToken);
            }
          }
        })
        .catch(() => {
          console.error("❌ Failed to refresh token");
        });
    };

    return authenticated;
  } catch (error) {
    console.error("Failed to initialize Keycloak:", error);
    onAuthError?.();
    return false;
  }
};

/**
 * Redirige vers la page de login Keycloak
 */
export const login = () => {
  keycloak.login({
    redirectUri: window.location.origin + "/dashboard",
  });
};

/**
 * Redirige vers la page d'inscription Keycloak
 */
export const register = () => {
  keycloak.register({
    redirectUri: window.location.origin + "/dashboard",
  });
};

/**
 * Déconnecte l'utilisateur
 */
export const logout = () => {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("balance");
  keycloak.logout({
    redirectUri: window.location.origin,
  });
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  return keycloak.authenticated || false;
};

/**
 * Récupère le token d'accès
 */
export const getToken = (): string | undefined => {
  return keycloak.token;
};

/**
 * Récupère les informations utilisateur depuis le token
 */
export const getUserInfo = () => {
  return keycloak.tokenParsed;
};

export default keycloak;
