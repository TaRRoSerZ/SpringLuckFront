import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Dashboard.css";
import {
  getUserInfo,
  getToken,
  isAuthenticated,
  logout,
} from "../keycloak/keycloak";
import {
  fetchUserTransactions,
  type Transaction,
} from "../services/transactionService";

import type { UserData } from "../services/authService_new";
import { getUserData } from "../services/authService_new";

interface UserInfo {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: unknown;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const user = getUserInfo();
      setUserInfo(user as UserInfo | null);

      const userData = await getUserData();
      setUserData(userData);
      if (user && userData && userData.id) {
        const balance = (userData.balance / 100).toFixed(2);
        sessionStorage.setItem("balance", balance);
        const token = getToken();
        if (token) {
          const fetchedTransactions = await fetchUserTransactions(
            userData.id,
            token
          );
          setTransactions(fetchedTransactions);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStorageChange = useCallback(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    loadDashboardData();

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate, handleStorageChange]);

  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  );

  const formattedBalance = useMemo(() => {
    const balance = userData?.balance ? userData.balance / 100 : 0;
    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }).format(balance);
    } catch {
      return `${balance.toFixed(2)} €`;
    }
  }, [userData]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="dashboard-loading">
            <div className="loader"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const displayName =
    userInfo?.given_name ||
    userInfo?.preferred_username ||
    userInfo?.email?.split("@")[0] ||
    "User";

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1 className="welcome-title">
                Welcome back, <span className="user-name">{displayName}</span>!
                👋
              </h1>
              <p className="welcome-subtitle">
                Here's what's happening with your account today.
              </p>
            </div>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card balance-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <p className="stat-label">Total Balance</p>
                <p className="stat-value">{formattedBalance}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <p className="stat-label">Total Transactions</p>
                <p className="stat-value">{transactions.length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{pendingTransactions.length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <p className="stat-label">Completed</p>
                <p className="stat-value">
                  {transactions.filter((t) => t.status === "CONFIRMED").length}
                </p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2 className="section-title">Account Information</h2>
            <div className="user-info-grid">
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{userInfo?.email || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">
                  {userInfo?.preferred_username || "N/A"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">
                  {userInfo?.name ||
                    `${userInfo?.given_name || ""} ${
                      userInfo?.family_name || ""
                    }`.trim() ||
                    "N/A"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">User ID</span>
                <span className="info-value user-id">
                  {userData?.id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="transactions-section">
            <h2 className="section-title">
              Recent Transactions ({transactions.length} total)
            </h2>
            {transactions.length === 0 ? (
              <div className="empty-state">
                <p className="empty-icon">📭</p>
                <p className="empty-text">No transactions yet</p>
                <p className="empty-subtext">
                  Start by making a deposit to see your activity here.
                </p>
              </div>
            ) : (
              <>
                <div className="transactions-list">
                  {transactions
                    .slice(0, showAllTransactions ? transactions.length : 3)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className={`transaction-item ${transaction.type} ${transaction.status}`}
                        onClick={() =>
                          navigate(`/transaction/${transaction.id}`)
                        }>
                        <div className="transaction-icon">
                          {transaction.status === "PENDING"
                            ? "⏳"
                            : transaction.type === "DEPOSIT"
                            ? "💵"
                            : "🎰"}
                        </div>
                        <div className="transaction-details">
                          <p className="transaction-description">
                            {transaction.description || transaction.type}
                          </p>
                          <p className="transaction-date">
                            {(() => {
                              try {
                                // Le backend envoie une date au format "YYYY-MM-DD"
                                const date = new Date(transaction.date);

                                if (isNaN(date.getTime())) {
                                  return "Invalid date";
                                }

                                return date.toLocaleDateString("fr-FR", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                });
                              } catch {
                                return "Invalid date";
                              }
                            })()}
                          </p>
                        </div>
                        <div className="transaction-amount">
                          <p
                            className={`amount ${
                              transaction.status === "PENDING"
                                ? "pending"
                                : transaction.type === "DEPOSIT"
                                ? "positive"
                                : "negative"
                            }`}>
                            {transaction.type === "DEPOSIT" ? "+" : "-"}$
                            {(transaction.amount / 100).toFixed(2)}
                          </p>
                          <span
                            className={`status-badge ${transaction.status}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
                {transactions.length > 3 && (
                  <button
                    className="show-more-btn"
                    onClick={() =>
                      setShowAllTransactions(!showAllTransactions)
                    }>
                    {showAllTransactions ? (
                      <>
                        <span>Show less</span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M18 15L12 9L6 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Show all ({transactions.length})</span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              <button
                className="action-btn deposit"
                onClick={() => navigate("/deposit")}>
                <span className="action-icon">💳</span>
                <span className="action-text">Make a Deposit</span>
              </button>
              <button
                className="action-btn games"
                onClick={() => navigate("/")}>
                <span className="action-icon">🎮</span>
                <span className="action-text">Play Games</span>
              </button>
              <button className="action-btn transactions">
                <span className="action-icon">📜</span>
                <span className="action-text">View All Transactions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
