import React, { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./DonationPage.css";

// use your existing campaigns.json (you already import this in CampaignDetails)
import campaigns from "../../../data/campaigns.json";
// fallback tiers if a campaign has no rewardTiers
import tiersDB from "../../../data/donationRewards.json";

export default function DonationPage() {
  const { id } = useParams();
  const { state } = useLocation();

  // 1) find the right campaign by :id
  const campaign = useMemo(() => {
    const found = campaigns.campaigns?.find(
      (c) => String(c.id) === String(id)
    );
    return found || null;
  }, [id]);

  // 2) tiers source: prefer campaign.rewardTiers; else fallback JSON; else empty
  const tiers = useMemo(() => {
    if (campaign?.rewardTiers?.length) return campaign.rewardTiers
      .map(t => ({ amount: t.amount, title: t.title, description: t.description }));
    const fallback = tiersDB[id] || tiersDB.default || [];
    return fallback;
  }, [campaign, id]);

  // 3) starting amount (from router state or default to first tier amount)
  const initialAmount =
    typeof state?.amount === "number"
      ? state.amount
      : tiers[0]?.amount ?? 25;

  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(initialAmount);

  // form fields
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // current numeric amount
  const amount = useMemo(() => {
    const n = parseFloat(customAmount);
    return Number.isFinite(n) && n > 0 ? n : selectedAmount;
  }, [customAmount, selectedAmount]);

  // pick the highest tier whose amount <= current amount
  const currentReward = useMemo(() => {
    if (!tiers.length) return null;
    return tiers
      .filter(t => amount >= t.amount)
      .sort((a, b) => b.amount - a.amount)[0] || tiers[0];
  }, [tiers, amount]);

  // quick validators
  const isValidCardNumber = (num) => /^[0-9]{13,19}$/.test(num.replace(/\s/g, ""));
  const isValidExpiry = (val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val);
  const isValidCvv = (val) => /^[0-9]{3,4}$/.test(val);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidCardNumber(cardNumber)) return setError("Invalid card number");
    if (!nameOnCard.trim()) return setError("Please enter name on card");
    if (!isValidExpiry(expiry)) return setError("Invalid expiry format (MM/YY)");
    if (!isValidCvv(cvv)) return setError("Invalid CVV");
    if (!agreeTos) return setError("Please agree to the terms");

    setSuccess(
      `Thanks! You donated $${amount.toFixed(2)} to ${campaign?.name || "this shop"}`
    );
  };

  if (!campaign) {
    return (
      <div className="donation-page">
        <h2>Campaign not found</h2>
      </div>
    );
  }

  return (
    <div className="donation-page">
      <h1>Please confirm your donation!</h1>

      {/* HERO */}
      <div className="donation-hero">
        <img src={campaign.imageUrl} alt={campaign.name} />
        <div className="hero-overlay">
          <h2>{campaign.name}</h2>
          <p>Rent due: {new Date(campaign.rentDue).toLocaleDateString("en-SG")}</p>
        </div>
      </div>

      <h3>{campaign.campaignName || "Support Our Monthly Rent"}</h3>

      {/* TIERS */}
      <div className="tier-section">
        {tiers.map((t) => (
            <div
            key={t.amount}
            className={`tier ${amount >= t.amount && selectedAmount === t.amount ? "active" : ""}`}
            onClick={() => { setSelectedAmount(t.amount); setCustomAmount(""); }}
            >
            <strong>${t.amount}</strong>
            {/* reward title intentionally hidden */}
            </div>
        ))}
       </div>


      {/* CUSTOM AMOUNT */}
      <div className="custom-amount">
        <input
          type="number"
          min="1"
          placeholder="Or enter a custom amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
        />
      </div>

      {/* REWARD PREVIEW (auto changes with amount) */}
      <div className="reward-preview">
        <div className="reward-shop">
          <strong>{campaign.name}</strong>
          {currentReward ? (
            <>
              <p style={{ margin: 0 }}>{currentReward.title}</p>
              {currentReward.description && <p style={{ margin: 0, opacity: .8 }}>{currentReward.description}</p>}
            </>
          ) : (
            <p>{campaign.reward || "Thank you reward"}</p>
          )}
        </div>
        <div className="reward-badge">Reward</div>
      </div>

      {/* FORM */}
      <form className="donation-form" onSubmit={handleSubmit}>
        <label>Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />

        <label>Name on Card</label>
        <input
          type="text"
          placeholder="Full Name"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
        />

        <div className="row">
          <div>
            <label>Expiry (MM/YY)</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>
          <div>
            <label>CVV</label>
            <input
              type="text"
              placeholder="3 digits"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        </div>

        {/* CHECKBOXES */}
        <div className="checkboxes">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
            />
            <span>Save my card details</span>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={agreeTos}
              onChange={(e) => setAgreeTos(e.target.checked)}
            />
            <span>
              I have read and understood the{""}
              <a href="#" onClick={(e) => e.preventDefault()}>
                terms &amp; conditions
              </a>
            </span>
          </label>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" className="btn-donate">
          Donate ${amount.toFixed(2)}
        </button>
        <button type="button" className="btn-paypal">
          Continue with PayPal
        </button>
      </form>
    </div>
  );
}
