import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./DonationPage.css";

import tiersDB from "../../../data/donationRewards.json";
import { campaign as campaignApi, donation as donationApi } from "../../../paths";

export default function DonationPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // State for campaign data
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch campaign data from API
  useEffect(() => {
    let alive = true;

    async function loadCampaign() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(campaignApi.one(id), {
          credentials: 'include'
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch campaign');
        }

        const data = await res.json();

        if (alive) {
          // Map backend data to frontend expected structure
          const mappedCampaign = {
            id: data.campaignId,
            campaignId: data.campaignId,
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl || '/placeholder-shop.jpg',
            tag: data.tag || 'Local Business',
            fundingGoal: data.goal,
            currentFunding: data.amtRaised || 0,
            progress: data.progress || 0,
            rentDue: data.endDate,
            endDate: data.endDate,
            status: data.status,
            campaignName: data.name,
            rewardTiers: data.rewardTiers || []
          };

          setCampaign(mappedCampaign);
        }
      } catch (err) {
        if (alive) {
          console.error('Error loading campaign:', err);
          setError(err.message || 'Failed to load campaign');
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadCampaign();

    return () => {
      alive = false;
    };
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
  const [formError, setFormError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    if (!isValidCardNumber(cardNumber)) return setFormError("Invalid card number");
    if (!nameOnCard.trim()) return setFormError("Please enter name on card");
    if (!isValidExpiry(expiry)) return setFormError("Invalid expiry format (MM/YY)");
    if (!isValidCvv(cvv)) return setFormError("Invalid CVV");
    if (!agreeTos) return setFormError("Please agree to the terms");

    // Submit donation to backend
    setSubmitting(true);
    try {
      const res = await fetch(donationApi.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          campaignId: id,
          amount: amount,
          cardDetails: {
            cardNumber,
            nameOnCard,
            expiry,
            cvv
          }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to process donation');
      }

      setSuccess(
        `Thanks! You donated $${amount.toFixed(2)} to ${campaign?.name || "this shop"}`
      );

      // Redirect to campaign page after 2 seconds to show updated stats
      setTimeout(() => {
        navigate(`/campaign/${id}`);
      }, 2000);

    } catch (err) {
      console.error('Donation error:', err);
      setFormError(err.message || 'Failed to process donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="donation-page">
        <h2>Loading campaign details...</h2>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="donation-page">
        <h2>Campaign not found</h2>
        {error && <p>{error}</p>}
        <a href="/" style={{ color: '#4F46E5', textDecoration: 'underline' }}>
          Return to Home
        </a>
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

        {formError && <p className="error-msg">{formError}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" className="btn-donate" disabled={submitting}>
          {submitting ? 'Processing...' : `Donate $${amount.toFixed(2)}`}
        </button>
        <button type="button" className="btn-paypal" disabled={submitting}>
          Continue with PayPal
        </button>
      </form>
    </div>
  );
}
