// src/pages/campaign/components/ManageRewards.jsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ManageRewards.css";

// If your backend runs somewhere else, change this:
const API_BASE_URL = "http://localhost:3000";

export default function ManageRewards() {
  const { campaignId } = useParams();           // from /campaign/:campaignId/rewards
  const [rewards, setRewards] = useState([]);   // [{ id, name, pending, completed, redeemed, total }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRewards() {
      try {
        setLoading(true);
        setError("");

        // 1) Get campaign + its rewardTiers
        const campaignRes = await fetch(
          `${API_BASE_URL}/campaigns/${campaignId}`,
          { credentials: "include" }
        );

        if (!campaignRes.ok) {
          throw new Error("Failed to load campaign");
        }

        const campaign = await campaignRes.json();
        const tiers = campaign.rewardTiers || [];

        // 2) For each reward tier, get its stats
        const rewardsWithStats = await Promise.all(
          tiers.map(async (tier, index) => {
            const statsRes = await fetch(
              `${API_BASE_URL}/rewards/${tier.rewardId}/stats`,
              { credentials: "include" }
            );

            if (!statsRes.ok) {
              throw new Error(`Failed to load stats for reward ${tier.rewardId}`);
            }

            const stats = await statsRes.json(); // { pending, completed, redeemed, total }

            return {
              id: tier.rewardId,
              name: tier.title || `Reward ${index + 1}`,
              pending: stats.pending,
              completed: stats.completed,
              redeemed: stats.redeemed,
              total: stats.total,
            };
          })
        );

        setRewards(rewardsWithStats);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadRewards();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="manage-rewards-page">
        <h1 className="page-title">My Campaign</h1>
        <h2 className="page-subtitle">Manage Rewards</h2>
        <p>Loading rewards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-rewards-page">
        <h1 className="page-title">My Campaign</h1>
        <h2 className="page-subtitle">Manage Rewards</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="manage-rewards-page">
      <h1 className="page-title">My Campaign</h1>
      <h2 className="page-subtitle">Manage Rewards</h2>

      <div className="rewards-list">
        {rewards.map((r) => (
          <div key={r.id} className="reward-row">
            <div className="reward-badge">{r.name}</div>

            <div className="reward-stats">
              <div>{r.pending} / {r.total} Pending Rewards</div>
              <div>{r.completed} / {r.total} Completed Rewards</div>
              <div>{r.redeemed} / {r.total} Redeemed Rewards</div>
            </div>

            <div className="reward-actions">
              {/* IMPORTANT: keep campaignId in the URL */}
              <Link
                className="view-btn"
                to={`/campaign/${campaignId}/rewards/${r.id}`}
              >
                View Supporters
              </Link>
            </div>
          </div>
        ))}

        {rewards.length === 0 && (
          <p>No rewards configured for this campaign yet.</p>
        )}
      </div>
    </div>
  );
}
