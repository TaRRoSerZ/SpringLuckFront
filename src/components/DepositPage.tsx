import "../styles/DepositPage.css";
import AuthLayout from "./AuthLayout";
import { useState } from "react";

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    // Only allow numbers, max 16 digits
    if (value === "" || (/^\d+$/.test(value) && value.length <= 16)) {
      // Format with spaces every 4 digits
      const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    // Format as MM/YY
    if (value.length <= 4) {
      let formatted = value;
      if (value.length >= 2) {
        formatted = value.slice(0, 2) + "/" + value.slice(2);
      }
      setExpiry(formatted);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, max 4 digits
    if (value === "" || (/^\d+$/.test(value) && value.length <= 4)) {
      setCvc(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Stripe
    console.log("Deposit:", { amount, cardNumber, expiry, cvc });
    alert(`Depositing $${amount || "0"} - Stripe integration coming soon!`);
  };

  return (
    <AuthLayout title="Deposit Funds">
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
                required
              />
            </div>
          </div>

          {/* Card Number */}
          <div className="deposit-input-group">
            <label htmlFor="cardNumber" className="deposit-label">
              Card number
            </label>
            <input
              className="deposit-input"
              type="text"
              name="cardNumber"
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
            />
          </div>

          {/* Expiry & CVC Row */}
          <div className="deposit-inputs-row">
            <div className="deposit-input-group">
              <label htmlFor="expiry" className="deposit-label">
                Expiry date
              </label>
              <input
                className="deposit-input"
                type="text"
                name="expiry"
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                required
              />
            </div>
            <div className="deposit-input-group">
              <label htmlFor="cvc" className="deposit-label">
                CVC
              </label>
              <input
                className="deposit-input"
                type="text"
                name="cvc"
                id="cvc"
                placeholder="123"
                value={cvc}
                onChange={handleCvcChange}
                required
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
          <p className="info-text">
            Any future expiry date and any 3-digit CVC
          </p>
        </div>

        <button className="deposit-btn" type="submit">
          Deposit {amount ? `$${amount}` : ""}
        </button>
      </form>
    </AuthLayout>
  );
};

export default DepositPage;
