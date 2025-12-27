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

export const login = () => {
  keycloak.login({
    redirectUri: window.location.origin + "/dashboard",
  });
};

export const register = () => {
  keycloak.register({
    redirectUri: window.location.origin + "/dashboard",
  });
};

export const logout = () => {
  sessionStorage.removeItem("balance");
  keycloak.logout({
    redirectUri: window.location.origin,
  });
};

export const isAuthenticated = (): boolean => {
  return keycloak.authenticated || false;
};

export const getToken = (): string | undefined => {
  return keycloak.token;
};

export const getUserInfo = () => {
  return keycloak.tokenParsed;
};

export const getRoles = () => {
  if (!isAuthenticated()) {
    return [];
  }
  const roles = keycloak.realmAccess?.roles || [];
  return roles;
};

export const isAdmin = () => {
  return isAuthenticated() && getRoles().includes("ADMIN");
};

export default keycloak;
