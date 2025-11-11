import { useEffect, useState } from "react";
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
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie l'authentification
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    const loadDashboardData = async () => {
      try {
        // Récupère les infos utilisateur depuis le token Keycloak
        const user = getUserInfo();
        setUserInfo(user as UserInfo | null);

        const token = getToken();
        const userEmail = user?.email;

        if (userEmail && token) {
          // 1️⃣ Récupérer les infos complètes du user depuis le backend (avec la balance)
          const userResponse = await fetch(
            `http://localhost:8083/users/${userEmail}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (userResponse.ok) {
            const userData = await userResponse.json();
            const userBalance = userData.balance / 100 || 0;
            setBalance(userBalance);
            sessionStorage.setItem("balance", userBalance.toString());
          }

          // 2️⃣ Récupérer les transactions
          const userId = user?.sub;
          if (userId) {
            const txs = await fetchUserTransactions(userId, token);
            setTransactions(txs);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Écouter les changements de storage (après dépôt)
    const handleStorageChange = () => {
      loadDashboardData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);
  const handleLogout = () => {
    logout();
  };

  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="dashboard-loading">
            <p>Loading your dashboard...</p>
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
          {/* Header Section */}
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
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card balance-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <p className="stat-label">Total Balance</p>
                <p className="stat-value">${balance.toFixed(2)}</p>
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
                  {
                    transactions.filter(
                      (t) =>
                        t.status === "completed" || t.status === "succeeded"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* User Info Section */}
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
                  {userInfo?.sub?.substring(0, 8) || "N/A"}...
                </span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
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
              <div className="transactions-list">
                {transactions.slice(0, 10).map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`transaction-item ${transaction.type}`}>
                    <div className="transaction-icon">
                      {transaction.type === "deposit" ? "💵" : "🎰"}
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

                            return date.toLocaleDateString("en-US", {
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
                          transaction.type === "deposit"
                            ? "positive"
                            : "negative"
                        }`}>
                        {transaction.type === "deposit" ? "+" : "-"}$
                        {(transaction.amount / 100).toFixed(2)}
                      </p>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
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
