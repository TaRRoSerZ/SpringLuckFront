import "../styles/DepositPage.css";
import AuthLayout from "./AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getUserInfo } from "../keycloak/keycloak";

// Initialiser Stripe avec la clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const DepositForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe is not loaded yet. Please wait.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1️⃣ Récupérer l'userId depuis le token Keycloak
      const userInfo = getUserInfo();
      if (!userInfo || !userInfo.sub) {
        setMessage("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      // 2️⃣ Appeler le backend pour créer un PaymentIntent
      const response = await fetch(
        "http://localhost:8083/stripe/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            amount: Math.round(parseFloat(amount) * 100), // Convertir en centimes
            userId: userInfo.sub,
            userEmail: userInfo.email,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      // 3️⃣ Confirmer le paiement avec Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      // 4️⃣ Gérer le résultat
      if (error) {
        setMessage(`Payment failed: ${error.message}`);
        console.error("Payment error:", error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("✅ Deposit successful! Redirecting to dashboard...");

        // Mettre à jour le solde dans sessionStorage
        // L'amount est en dollars, on le garde tel quel
        const currentBalance = parseFloat(
          sessionStorage.getItem("balance") || "0"
        );
        const newBalance = currentBalance + parseFloat(amount);
        sessionStorage.setItem("balance", newBalance.toString());

        // Déclencher un événement pour notifier le Navbar
        window.dispatchEvent(new Event("storage"));

        // Rediriger vers le dashboard après 1.5 secondes
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Deposit error:", error);
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="deposit-form" onSubmit={handleSubmit}>
      <div className="deposit-inputs">
        {/* Amount Input */}
        <div className="deposit-input-group">
          <label htmlFor="amount" className="deposit-label">
            Amount to deposit
          </label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              className="deposit-input amount-input"
              type="text"
              name="amount"
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Card Element de Stripe */}
        <div className="deposit-input-group">
          <label htmlFor="card-element" className="deposit-label">
            Card details
          </label>
          <div className="stripe-card-element">
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#d6dde6",
                    fontFamily:
                      '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    "::placeholder": {
                      color: "#6b7280",
                    },
                  },
                  invalid: {
                    color: "#ff4444",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Test card info */}
      <div className="test-card-info">
        <p className="info-title">Test Mode</p>
        <p className="info-text">
          Use card: <strong>4242 4242 4242 4242</strong>
        </p>
        <p className="info-text">Any future expiry date and any 3-digit CVC</p>
      </div>

      {/* Message de retour */}
      {message && (
        <div
          className={`deposit-message ${
            message.includes("✅") || message.includes("successful")
              ? "success"
              : "error"
          }`}>
          {message}
        </div>
      )}

      <button
        className="deposit-btn"
        type="submit"
        disabled={loading || !stripe}>
        {loading ? "Processing..." : `Deposit ${amount ? `$${amount}` : ""}`}
      </button>
    </form>
  );
};

const DepositPage = () => {
  return (
    <AuthLayout title="Deposit Funds">
      <Elements stripe={stripePromise}>
        <DepositForm />
      </Elements>
    </AuthLayout>
  );
};

export default DepositPage;
