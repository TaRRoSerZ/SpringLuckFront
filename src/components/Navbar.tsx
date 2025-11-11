import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { isAuthenticated, logout, login } from "../keycloak/keycloak";
import { getUserData } from "../services/authService_new";

const Navbar = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Auth and balance UI
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [isBalanceMenuOpen, setIsBalanceMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      return window.matchMedia("(max-width: 768px)").matches;
    }
    return false;
  });

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function closeBanner() {
    setIsBannerVisible(false);
  }

  // Fonction pour charger la balance depuis le backend
  const loadBalance = useCallback(async () => {
    if (!isAuthenticated()) {
      setBalance(0);
      return;
    }

    try {
      const userData = await getUserData();
      if (userData && userData.balance !== undefined) {
        const balanceInEuros = userData.balance / 100;
        setBalance(balanceInEuros);
        sessionStorage.setItem("balance", balanceInEuros.toFixed(2));
      }
    } catch (error) {
      console.error("Error loading balance:", error);
      const rawBalance = sessionStorage.getItem("balance");
      const parsed = rawBalance ? Number(rawBalance) : 0;
      setBalance(Number.isFinite(parsed) ? parsed : 0);
    }
  }, []);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);

    if (authenticated) {
      loadBalance();
    } else {
      const rawBalance = sessionStorage.getItem("balance");
      const parsed = rawBalance ? Number(rawBalance) : 0;
      setBalance(Number.isFinite(parsed) ? parsed : 0);
    }

    const onStorage = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);

      if (authStatus) {
        loadBalance();
      } else {
        setBalance(0);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [loadBalance]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    type MQLDeprecated = MediaQueryList & {
      addListener: (
        listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
      ) => void;
      removeListener: (
        listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
      ) => void;
    };
    const mqlDep = mql as MQLDeprecated;
    mqlDep.addListener(handler);
    return () => mqlDep.removeListener(handler);
  }, []);

  const formattedBalance = useMemo(() => {
    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }).format(balance);
    } catch {
      return `${balance.toFixed(2)} €`;
    }
  }, [balance]);

  function toggleBalanceMenu() {
    setIsBalanceMenuOpen((v) => !v);
  }

  function closeBalanceMenu() {
    setIsBalanceMenuOpen(false);
  }

  function handleBalanceAction() {
    closeBalanceMenu();
    closeMenu();
  }
  return (
    <div className="navbar-container">
      <article
        className={`promotion-banner ${isBannerVisible ? "" : "hidden"}`}>
        <div className="promotion-text">
          <h2>Welcome to SpringLuck Casino !</h2>
          <p>Use code SPRING20 for 20% off!</p>
        </div>
        <svg
          onClick={closeBanner}
          className="close-icon"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13 1L1 13M1 1L13 13"
            stroke="#000A14"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </article>
      <nav className="navbar">
        <a href="/#home" className="logo">
          <img src="/icons/logo.svg" width={35} height={35} alt="Logo" />
          <h2>SpringLuck</h2>
        </a>
        <button
          className={`menu ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}>
          <svg viewBox="0 0 64 48">
            <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
            <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
            <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
          </svg>
        </button>
        <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li className="nav-item" onClick={closeMenu}>
              <a href="/#games">Games</a>
            </li>
            <li className="nav-item" onClick={closeMenu}>
              <Link to="/vip">VIP</Link>
            </li>
            <li className="nav-item" onClick={closeMenu}>
              <Link to="/support">Support</Link>
            </li>
            {!isLoggedIn && (
              <li className="nav-item" onClick={closeMenu}>
                <button
                  onClick={login}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    font: "inherit",
                  }}>
                  Login
                </button>
              </li>
            )}
          </ul>
          <div className="nav-buttons">
            <input
              className="search-input"
              type="text"
              name="search"
              id="search"
              placeholder="Search..."
              autoComplete="off"
            />
            <label className="search-label" htmlFor="search">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.0004 21L16.6504 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="#D6DDE6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
            {!isLoggedIn ? (
              <button
                className="login-button"
                onClick={login}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="#D6DDE6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <div
                className={`balance ${isBalanceMenuOpen ? "open" : ""}`}
                onMouseLeave={!isMobile ? closeBalanceMenu : undefined}>
                <button
                  className="balance-chip"
                  onMouseEnter={
                    !isMobile ? () => setIsBalanceMenuOpen(true) : undefined
                  }
                  onClick={!isMobile ? toggleBalanceMenu : undefined}
                  aria-expanded={isBalanceMenuOpen}
                  aria-haspopup="menu">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden>
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.5 10.5C9.5 9.39543 10.3954 8.5 11.5 8.5H13C14.1046 8.5 15 9.39543 15 10.5C15 11.6046 14.1046 12.5 13 12.5H11.5C10.3954 12.5 9.5 13.3954 9.5 14.5C9.5 15.6046 10.3954 16.5 11.5 16.5H15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="balance-amount">{formattedBalance}</span>
                  <svg
                    className="chevron"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className="balance-dropdown"
                  role="menu"
                  aria-hidden={!isBalanceMenuOpen}>
                  <Link
                    to="/deposit"
                    role="menuitem"
                    onClick={handleBalanceAction}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden>
                      <path
                        d="M3.75 7.5C3.75 6.25736 4.75736 5.25 6 5.25H17.25C18.4926 5.25 19.5 6.25736 19.5 7.5V9.5H15.75C14.5074 9.5 13.5 10.5074 13.5 11.75C13.5 12.9926 14.5074 14 15.75 14H19.5V16.5C19.5 17.7426 18.4926 18.75 17.25 18.75H6C4.75736 18.75 3.75 17.7426 3.75 16.5V7.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M15.75 11.25H21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Déposer de l'argent
                  </Link>
                  <Link
                    to="/dashboard"
                    role="menuitem"
                    onClick={handleBalanceAction}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden>
                      <path
                        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Mon profil
                  </Link>
                  <button
                    className="logout-dropdown-btn"
                    role="menuitem"
                    onClick={() => {
                      handleBalanceAction();
                      logout();
                    }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden>
                      <path
                        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
