import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/TransactionDetails.css";
import { getToken, isAuthenticated } from "../keycloak/keycloak";
import type { Transaction } from "../services/transactionService";

const TransactionDetails = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [transaction, setTransaction] = useState<Transaction | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate("/");
			return;
		}

		const loadTransaction = async () => {
			try {
				const token = getToken();
				if (!token || !id) {
					navigate("/dashboard");
					return;
				}

				const response = await fetch(
					`https://springluck.onrender.com/transactions/${id}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Transaction not found");
				}

				const data = await response.json();
				setTransaction(data);
			} catch (error) {
				console.error("Error loading transaction:", error);
				navigate("/dashboard");
			} finally {
				setLoading(false);
			}
		};

		loadTransaction();
	}, [id, navigate]);

	if (loading) {
		return (
			<>
				<Navbar />
				<div className="transaction-details-container">
					<div className="transaction-details-loading">
						<div className="loader"></div>
					</div>
				</div>
				<Footer />
			</>
		);
	}

	if (!transaction) {
		return null;
	}

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return "Invalid date";
			return date.toLocaleDateString("fr-FR", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return "Invalid date";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status.toUpperCase()) {
			case "CONFIRMED":
			case "COMPLETED":
			case "SUCCEEDED":
				return "success";
			case "PENDING":
				return "pending";
			case "FAILED":
			case "CANCELLED":
				return "error";
			default:
				return "default";
		}
	};

	const getTypeIcon = (type: string, status: string) => {
		if (status === "PENDING") return "⏳";
		return type === "DEPOSIT" ? "💵" : "🎰";
	};

	return (
		<>
			<Navbar />
			<div className="transaction-details-container">
				<div className="transaction-details-content">
					<button
						className="back-button"
						onClick={() => navigate("/dashboard")}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M19 12H5M5 12L12 19M5 12L12 5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Back to Dashboard
					</button>

					<div className="transaction-header">
						<div className="transaction-icon-large">
							{getTypeIcon(transaction.type, transaction.status)}
						</div>
						<h1 className="transaction-title">Transaction Details</h1>
						<span
							className={`status-badge-large ${getStatusColor(
								transaction.status
							)}`}
						>
							{transaction.status}
						</span>
					</div>

					<div className="transaction-amount-section">
						<p className="amount-label">Amount</p>
						<p
							className={`amount-value ${
								transaction.type === "DEPOSIT" ||
								transaction.type === "BET_WIN" ||
								transaction.type === "REFUND" ||
								transaction.type === "BONUS" ||
								transaction.type === "CASHBACK" ||
								transaction.type === "PROMO"
									? "positive"
									: "negative"
							}`}
						>
							{transaction.type === "DEPOSIT" ||
							transaction.type === "BET_WIN" ||
							transaction.type === "REFUND" ||
							transaction.type === "BONUS" ||
							transaction.type === "CASHBACK" ||
							transaction.type === "PROMO"
								? "+"
								: "-"}
							€{(transaction.amount / 100).toFixed(2)}
						</p>
					</div>

					<div className="transaction-info-grid">
						<div className="info-card">
							<div className="info-card-header">
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M7 8H17M7 12H17M7 16H12M3 4H21V20H3V4Z"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="info-label">Transaction ID</span>
							</div>
							<p className="info-value monospace">{transaction.id}</p>
						</div>

						<div className="info-card">
							<div className="info-card-header">
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="info-label">Date</span>
							</div>
							<p className="info-value">{formatDate(transaction.date)}</p>
						</div>

						<div className="info-card">
							<div className="info-card-header">
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="info-label">Type</span>
							</div>
							<p className="info-value">{transaction.type}</p>
						</div>

						<div className="info-card">
							<div className="info-card-header">
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
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
								<span className="info-label">User ID</span>
							</div>
							<p className="info-value monospace">{transaction.userId}</p>
						</div>

						{transaction.stripeIntentId && (
							<div className="info-card">
								<div className="info-card-header">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M3 10H21M7 15H7.01M11 15H13M6 19H18C19.1046 19 20 18.1046 20 17V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19Z"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<span className="info-label">Stripe Intent ID</span>
								</div>
								<p className="info-value monospace">
									{transaction.stripeIntentId}
								</p>
							</div>
						)}

						{transaction.betId && (
							<div className="info-card">
								<div className="info-card-header">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M12 2L2 7L12 12L22 7L12 2Z"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M2 17L12 22L22 17"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M2 12L12 17L22 12"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<span className="info-label">Bet ID</span>
								</div>
								<p className="info-value monospace">{transaction.betId}</p>
							</div>
						)}
					</div>

					{transaction.description && (
						<div className="transaction-description-section">
							<h3 className="section-subtitle">Description</h3>
							<p className="description-text">{transaction.description}</p>
						</div>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default TransactionDetails;
