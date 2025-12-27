import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { isAuthenticated, logout, login, isAdmin } from "../keycloak/keycloak";
import { useBalance } from "../contexts/BalanceContext";
import { GAMES } from "../constants/games";

const Navbar = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Auth and balance UI
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { balance } = useBalance();
  const [isBalanceMenuOpen, setIsBalanceMenuOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      return window.matchMedia("(max-width: 768px)").matches;
    }
    return false;
  });

  function normalizeSearchText(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function closeBanner() {
    setIsBannerVisible(false);
  }

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
  }, []);

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

  const searchResults = useMemo(() => {
    const q = normalizeSearchText(searchTerm);
    if (!q) return [];
    return GAMES.filter((g) => normalizeSearchText(g.title).includes(q));
  }, [searchTerm]);

  function closeSearch() {
    setIsSearchOpen(false);
  }

  function clearSearch() {
    setSearchTerm("");
    closeSearch();
  }

  function selectGame(gameId: number) {
    clearSearch();
    closeMenu();
    navigate(`/game/${gameId}`);
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
            <div className="search-container">
              <input
                className="search-input"
                type="text"
                name="search"
                id="search"
                placeholder="Search..."
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  setIsSearchOpen(value.trim().length > 0);
                }}
                onFocus={() => {
                  if (searchTerm.trim().length > 0) setIsSearchOpen(true);
                }}
                onBlur={() => {
                  // Petit délai pour permettre le click sur un résultat
                  window.setTimeout(() => closeSearch(), 120);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    clearSearch();
                    return;
                  }
                  if (e.key === "Enter") {
                    if (searchResults.length >= 1) {
                      selectGame(searchResults[0].id);
                    }
                  }
                }}
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

              {isSearchOpen && searchResults.length > 0 && (
                <ul className="search-results" role="listbox">
                  {searchResults.map((game) => (
                    <li key={game.id}>
                      <button
                        type="button"
                        className="search-result-item"
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => selectGame(game.id)}>
                        {game.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      role="menuitem"
                      onClick={handleBalanceAction}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M55.825 4.54375C54.3063 -1.51875 45.7 -1.51875 44.175 4.54375L43.7313 6.33125C43.4716 7.37004 42.9387 8.32043 42.1879 9.08379C41.437 9.84716 40.4956 10.3957 39.4612 10.6724C38.4268 10.9492 37.3373 10.9441 36.3055 10.6577C35.2738 10.3713 34.3375 9.81407 33.5938 9.04375L32.3125 7.725C27.9688 3.23125 20.5125 7.5375 22.2313 13.5437L22.7313 15.3187C23.0251 16.3472 23.0386 17.4354 22.7705 18.4708C22.5025 19.5062 21.9625 20.4512 21.2065 21.2078C20.4505 21.9644 19.5061 22.5052 18.4709 22.7741C17.4357 23.0431 16.3474 23.0304 15.3188 22.7375L13.5438 22.2312C7.54376 20.5125 3.23126 27.9687 7.72501 32.3125L9.04376 33.5937C9.81409 34.3375 10.3714 35.2738 10.6578 36.3055C10.9442 37.3372 10.9492 38.4268 10.6725 39.4612C10.3957 40.4955 9.84717 41.437 9.08381 42.1879C8.32045 42.9387 7.37006 43.4716 6.33126 43.7312L4.54376 44.175C-1.51874 45.6937 -1.51874 54.3 4.54376 55.825L6.33126 56.2687C7.37006 56.5284 8.32045 57.0613 9.08381 57.8121C9.84717 58.563 10.3957 59.5044 10.6725 60.5388C10.9492 61.5732 10.9442 62.6628 10.6578 63.6945C10.3714 64.7262 9.81409 65.6625 9.04376 66.4062L7.72501 67.6875C3.23126 72.0312 7.53751 79.4875 13.5438 77.7687L15.3188 77.2687C16.3478 76.9744 17.4369 76.9607 18.473 77.229C19.5092 77.4973 20.4547 78.0379 21.2115 78.7947C21.9684 79.5516 22.509 80.4971 22.7773 81.5332C23.0456 82.5694 23.0319 83.6584 22.7375 84.6875L22.2313 86.4562C20.5125 92.4562 27.9688 96.7687 32.3125 92.275L33.5938 90.9562C34.3375 90.1859 35.2738 89.6286 36.3055 89.3422C37.3373 89.0559 38.4268 89.0508 39.4612 89.3275C40.4956 89.6043 41.437 90.1528 42.1879 90.9162C42.9387 91.6796 43.4716 92.63 43.7313 93.6687L44.175 95.4562C45.6938 101.519 54.3 101.519 55.825 95.4562L56.2688 93.6687C56.5284 92.63 57.0613 91.6796 57.8122 90.9162C58.563 90.1528 59.5045 89.6043 60.5388 89.3275C61.5732 89.0508 62.6628 89.0559 63.6945 89.3422C64.7263 89.6286 65.6626 90.1859 66.4063 90.9562L67.6875 92.275C72.0313 96.7687 79.4875 92.4625 77.7688 86.4562L77.2688 84.6812C76.9744 83.6522 76.9607 82.5631 77.229 81.527C77.4973 80.4908 78.0379 79.5453 78.7948 78.7885C79.5516 78.0316 80.4971 77.491 81.5332 77.2227C82.5694 76.9544 83.6585 76.9681 84.6875 77.2625L86.4563 77.7687C92.4563 79.4875 96.7688 72.0312 92.275 67.6875L90.9563 66.4062C90.1859 65.6625 89.6287 64.7262 89.3423 63.6945C89.0559 62.6628 89.0508 61.5732 89.3276 60.5388C89.6043 59.5044 90.1529 58.563 90.9162 57.8121C91.6796 57.0613 92.63 56.5284 93.6688 56.2687L95.4563 55.825C101.519 54.3062 101.519 45.7 95.4563 44.175L93.6688 43.7312C92.63 43.4716 91.6796 42.9387 90.9162 42.1879C90.1529 41.437 89.6043 40.4955 89.3276 39.4612C89.0508 38.4268 89.0559 37.3372 89.3423 36.3055C89.6287 35.2738 90.1859 34.3375 90.9563 33.5937L92.275 32.3125C96.7688 27.9687 92.4625 20.5125 86.4563 22.2312L84.6813 22.7312C83.6528 23.025 82.5646 23.0386 81.5292 22.7705C80.4938 22.5024 79.5488 21.9625 78.7922 21.2065C78.0356 20.4505 77.4948 19.506 77.2259 18.4709C76.9569 17.4357 76.9696 16.3474 77.2625 15.3187L77.7688 13.5437C79.4875 7.54375 72.0313 3.23125 67.6875 7.725L66.4063 9.04375C65.6626 9.81407 64.7263 10.3713 63.6945 10.6577C62.6628 10.9441 61.5732 10.9492 60.5388 10.6724C59.5045 10.3957 58.563 9.84716 57.8122 9.08379C57.0613 8.32043 56.5284 7.37004 56.2688 6.33125L55.825 4.54375ZM50 81.2312C45.8611 81.2898 41.7518 80.5251 37.9109 78.9817C34.0701 77.4383 30.5743 75.147 27.6267 72.2408C24.6791 69.3346 22.3385 65.8716 20.7409 62.0529C19.1434 58.2343 18.3207 54.1362 18.3207 49.9969C18.3207 45.8575 19.1434 41.7595 20.7409 37.9408C22.3385 34.1222 24.6791 30.6591 27.6267 27.753C30.5743 24.8468 34.0701 22.5554 37.9109 21.012C41.7518 19.4686 45.8611 18.7039 50 18.7625C58.2847 18.7625 66.2301 22.0536 72.0883 27.9118C77.9464 33.7699 81.2375 41.7153 81.2375 50C81.2375 58.2847 77.9464 66.2301 72.0883 72.0882C66.2301 77.9464 58.2847 81.2375 50 81.2375V81.2312Z"
                          fill="currentColor"
                        />
                      </svg>
                      Administration
                    </Link>
                  )}
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
