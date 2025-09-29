import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  function closeBanner() {
    setIsBannerVisible(false);
  }
  return (
    <div className="navbar-container">
      <article
        className={`promotion-banner ${isBannerVisible ? "" : "hidden"}`}
      >
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
          xmlns="http://www.w3.org/2000/svg"
        >
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
        <a href="#home" className="logo">
          <img src="/icons/logo.svg" width={35} height={35} alt="Logo" />
          <h2>SpringLuck</h2>
        </a>
        <ul className="nav-links">
          <li className="nav-item">
            <a href="#games">Games</a>
          </li>
          <li className="nav-item">
            <Link to="/vip">VIP</Link>
          </li>
          <li className="nav-item">
            <Link to="/support">Support</Link>
          </li>
          <li className="nav-item">
            <Link to="/login">Login</Link>
          </li>
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
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.0004 21L16.6504 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="#D6DDE6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </label>
          <Link className="login-button" to="/login">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="#D6DDE6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
