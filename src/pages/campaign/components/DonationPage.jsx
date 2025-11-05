import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./DonationPage.css";
import tiersDB from "../../../data/donationRewards.json";
import SubmitButton from "../../../components/SubmitButton";
import { campaigns, donation } from "../../../../paths";
import getUser from "../../../helpers/getUser";
import PaypalButton from "../../../components/PaypalButton";
import { toast } from "react-toastify";

export default function DonationPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    getCampaign();
  }, []);

  async function getCampaign() {
    try {
      const res = await fetch(campaigns.getById(id), {
        method: 'GET',
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error("Failed to get campaign");
      }
      const campaign = await res.json();

      setCampaign(campaign);
      if (!campaign?.rewardTiers.find((r) => state?.amount === r?.amount)) {
        setCustomAmount(state?.amount);
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

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

    if (!isValidCardNumber(cardNumber)) return toast.error("Invalid card number");
    if (!nameOnCard.trim()) return toast.error("Please enter name on card");
    if (!isValidExpiry(expiry)) return toast.error("Invalid expiry format (MM/YY)");
    if (!isValidCvv(cvv)) return toast.error("Invalid CVV");
    if (!agreeTos) return toast.error("Please agree to the terms");

    try {
      const user = await getUser(); // existing helper returning current user or null
      if (!user) {
        navigate("/login");
        return;
      }

      const body = {
        userId: user?.userId ?? null,
        amount,
        paymentGatewayOrderId: `CLIENT-${Date.now()}`,
        paymentMethod: "card"
      };

      const res = await fetch(donation.normal(id), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to submit donation" }));
        return toast.error(err.message || "Failed to submit donation");
      }

      toast.info("Donation successful");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Network error while submitting donation");
    }
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
        <img
          src={campaign.image || campaign.imageBlob}
          alt={campaign.name}
        />
        <div className="hero-overlay">
          <h2>{campaign.name}</h2>
          {/*<p>Rent due: {new Date(campaign.rentDue).toLocaleDateString("en-SG")}</p>*/ /*add this back if we have it*/}
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

        <SubmitButton type="submit" className="bg-[#6b5b4b]">
          Donate ${amount.toFixed(2)}
        </SubmitButton>
        <PaypalButton campaignId={id} amount={amount} />
      </form>
    </div>
  );
}