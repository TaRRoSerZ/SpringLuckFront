import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPage.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getToken, getUserInfo } from "../keycloak/keycloak";

interface User {
	id: number;
	email: string;
	balance: number;
}

interface Transaction {
	id: number;
	userId: number;
	amount: number;
	type: string;
	status: string;
	date: string;
	description: string;
}

interface UserDetails extends User {
	transactions: Transaction[];
}

type AdminView = "users" | "transactions" | "userDetails";

export default function AdminPage() {
	const navigate = useNavigate();
	const [activeView, setActiveView] = useState<AdminView>("users");
	const [users, setUsers] = useState<User[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	const API_URL = "http://localhost:8083";

	// Check if user is admin (vous pouvez adapter cette logique selon vos besoins)
	useEffect(() => {
		const userInfo = getUserInfo();
		// Pour le moment, nous permettons l'accès.
		// Vous pouvez ajouter une vérification des rôles ici
		if (!userInfo) {
			navigate("/");
		}
	}, [navigate]);

	// Fetch all users
	const fetchUsers = async () => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			const response = await fetch(`${API_URL}/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}

			const data = await response.json();
			setUsers(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Error fetching users:", err);
		} finally {
			setLoading(false);
		}
	};

	// Fetch all transactions
	const fetchTransactions = async () => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			const response = await fetch(`${API_URL}/transactions`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch transactions");
			}

			const data = await response.json();
			setTransactions(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Error fetching transactions:", err);
		} finally {
			setLoading(false);
		}
	};

	// Fetch user details
	const fetchUserDetails = async (email: string) => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			const response = await fetch(`${API_URL}/users/${email}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch user details");
			}

			const userData = await response.json();

			// Fetch user's transactions
			const transactionsResponse = await fetch(
				`${API_URL}/transactions/user/${userData.id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const userTransactions = transactionsResponse.ok
				? await transactionsResponse.json()
				: [];

			setSelectedUser({
				...userData,
				transactions: userTransactions,
			});
			setActiveView("userDetails");
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Error fetching user details:", err);
		} finally {
			setLoading(false);
		}
	};

	// Load data based on active view
	useEffect(() => {
		if (activeView === "users") {
			fetchUsers();
		} else if (activeView === "transactions") {
			fetchTransactions();
		}
	}, [activeView]);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("fr-FR", {
			style: "currency",
			currency: "EUR",
		}).format(amount / 100);
	};

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("fr-FR", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return "Invalid date";
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.id.toString().includes(searchTerm)
	);

	const filteredTransactions = transactions.filter(
		(transaction) =>
			transaction.id.toString().includes(searchTerm) ||
			transaction.userId.toString().includes(searchTerm) ||
			transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<>
			<Navbar />
			<div className="admin-container">
				<div className="admin-content">
					{/* Header */}
					<div className="admin-header">
						<div className="admin-title-section">
							<h1 className="admin-title">
								👨‍💼 <span className="highlight">Admin</span> Dashboard
							</h1>
							<p className="admin-subtitle">
								Manage users and monitor transactions
							</p>
						</div>
					</div>

					{/* Navigation Tabs */}
					<div className="admin-tabs">
						<button
							className={`admin-tab ${activeView === "users" ? "active" : ""}`}
							onClick={() => setActiveView("users")}
						>
							<span className="tab-icon">👥</span>
							<span>Users</span>
							{users.length > 0 && (
								<span className="tab-badge">{users.length}</span>
							)}
						</button>
						<button
							className={`admin-tab ${
								activeView === "transactions" ? "active" : ""
							}`}
							onClick={() => setActiveView("transactions")}
						>
							<span className="tab-icon">💳</span>
							<span>Transactions</span>
							{transactions.length > 0 && (
								<span className="tab-badge">{transactions.length}</span>
							)}
						</button>
						{selectedUser && (
							<button
								className={`admin-tab ${
									activeView === "userDetails" ? "active" : ""
								}`}
								onClick={() => setActiveView("userDetails")}
							>
								<span className="tab-icon">📊</span>
								<span>User Details</span>
							</button>
						)}
					</div>

					{/* Search Bar */}
					{activeView !== "userDetails" && (
						<div className="search-section">
							<div className="search-wrapper">
								<span className="search-icon">🔍</span>
								<input
									type="text"
									className="search-input"
									placeholder={
										activeView === "users"
											? "Search by email or ID..."
											: "Search by transaction ID, user ID, type, or status..."
									}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								{searchTerm && (
									<button
										className="search-clear"
										onClick={() => setSearchTerm("")}
									>
										✕
									</button>
								)}
							</div>
						</div>
					)}

					{/* Error Message */}
					{error && (
						<div className="error-message">
							<span className="error-icon">⚠️</span>
							<span>{error}</span>
						</div>
					)}

					{/* Loading State */}
					{loading && (
						<div className="loading-section">
							<div className="loader"></div>
							<p>Loading data...</p>
						</div>
					)}

					{/* Users View */}
					{!loading && activeView === "users" && (
						<div className="data-section">
							<div className="section-header">
								<h2 className="section-title">
									All Users ({filteredUsers.length})
								</h2>
							</div>
							{filteredUsers.length === 0 ? (
								<div className="empty-state">
									<span className="empty-icon">📭</span>
									<p className="empty-text">No users found</p>
								</div>
							) : (
								<div className="data-grid">
									{filteredUsers.map((user) => (
										<div
											key={user.id}
											className="data-card user-card"
											onClick={() => fetchUserDetails(user.email)}
										>
											<div className="card-header">
												<div className="user-avatar">
													{user.email.charAt(0).toUpperCase()}
												</div>
												<div className="user-info">
													<h3 className="user-email">{user.email}</h3>
													<p className="user-id">ID: {user.id}</p>
												</div>
											</div>
											<div className="card-body">
												<div className="balance-info">
													<span className="balance-label">Balance</span>
													<span className="balance-value">
														{formatCurrency(user.balance)}
													</span>
												</div>
											</div>
											<div className="card-footer">
												<button className="view-btn">View Details →</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* Transactions View */}
					{!loading && activeView === "transactions" && (
						<div className="data-section">
							<div className="section-header">
								<h2 className="section-title">
									All Transactions ({filteredTransactions.length})
								</h2>
							</div>
							{filteredTransactions.length === 0 ? (
								<div className="empty-state">
									<span className="empty-icon">📭</span>
									<p className="empty-text">No transactions found</p>
								</div>
							) : (
								<div className="transactions-table">
									<div className="table-header">
										<div className="table-cell">ID</div>
										<div className="table-cell">User ID</div>
										<div className="table-cell">Type</div>
										<div className="table-cell">Amount</div>
										<div className="table-cell">Status</div>
										<div className="table-cell">Date</div>
									</div>
									<div className="table-body">
										{filteredTransactions.map((transaction) => (
											<div
												key={transaction.id}
												className={`table-row ${transaction.status.toLowerCase()}`}
											>
												<div className="table-cell">#{transaction.id}</div>
												<div className="table-cell">{transaction.userId}</div>
												<div className="table-cell">
													<span className={`type-badge ${transaction.type}`}>
														{transaction.type}
													</span>
												</div>
												<div className="table-cell">
													<span
														className={`amount ${
															transaction.type === "DEPOSIT"
																? "positive"
																: "negative"
														}`}
													>
														{transaction.type === "DEPOSIT" ? "+" : "-"}
														{formatCurrency(transaction.amount)}
													</span>
												</div>
												<div className="table-cell">
													<span
														className={`status-badge ${transaction.status.toLowerCase()}`}
													>
														{transaction.status}
													</span>
												</div>
												<div className="table-cell">
													{formatDate(transaction.date)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{/* User Details View */}
					{!loading && activeView === "userDetails" && selectedUser && (
						<div className="data-section">
							<div className="section-header">
								<button
									className="back-btn"
									onClick={() => setActiveView("users")}
								>
									← Back to Users
								</button>
								<h2 className="section-title">User Details</h2>
							</div>

							<div className="user-details-grid">
								<div className="details-card">
									<div className="details-header">
										<div className="user-avatar-large">
											{selectedUser.email.charAt(0).toUpperCase()}
										</div>
										<div>
											<h3 className="details-email">{selectedUser.email}</h3>
											<p className="details-id">User ID: {selectedUser.id}</p>
										</div>
									</div>
									<div className="details-stats">
										<div className="stat-item">
											<span className="stat-label">Current Balance</span>
											<span className="stat-value balance">
												{formatCurrency(selectedUser.balance)}
											</span>
										</div>
										<div className="stat-item">
											<span className="stat-label">Total Transactions</span>
											<span className="stat-value">
												{selectedUser.transactions.length}
											</span>
										</div>
									</div>
								</div>

								<div className="details-transactions">
									<h3 className="transactions-title">
										Transaction History ({selectedUser.transactions.length})
									</h3>
									{selectedUser.transactions.length === 0 ? (
										<div className="empty-state small">
											<span className="empty-icon">📭</span>
											<p className="empty-text">No transactions yet</p>
										</div>
									) : (
										<div className="transactions-list-compact">
											{selectedUser.transactions.map((transaction) => (
												<div
													key={transaction.id}
													className={`transaction-compact ${transaction.status.toLowerCase()}`}
												>
													<div className="transaction-compact-header">
														<span className="transaction-compact-icon">
															{transaction.type === "DEPOSIT" ? "💵" : "🎰"}
														</span>
														<div className="transaction-compact-info">
															<span className="transaction-compact-type">
																{transaction.type}
															</span>
															<span className="transaction-compact-date">
																{formatDate(transaction.date)}
															</span>
														</div>
													</div>
													<div className="transaction-compact-details">
														<span
															className={`transaction-compact-amount ${
																transaction.type === "DEPOSIT"
																	? "positive"
																	: "negative"
															}`}
														>
															{transaction.type === "DEPOSIT" ? "+" : "-"}
															{formatCurrency(transaction.amount)}
														</span>
														<span
															className={`status-badge small ${transaction.status.toLowerCase()}`}
														>
															{transaction.status}
														</span>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
}
