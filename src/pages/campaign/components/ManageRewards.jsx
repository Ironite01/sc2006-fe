// src/pages/campaign/components/ManageRewards.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ManageRewards.css";
import { campaigns, rewards as rewardsPath } from "../../../../paths";
import { toast } from "react-toastify";
import { USER_ROLES } from "../../../helpers/constants";
import getUser from "../../../helpers/getUser";

export default function ManageRewards() {
  const navigate = useNavigate();
  const { campaignId } = useParams();           // from /campaign/:campaignId/rewards
  const [rewards, setRewards] = useState([]);   // [{ id, name, pending, completed, redeemed, total }]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authorize();
  }, []);

  async function authorize() {
    const user = await getUser();
    if (!user || user.role !== USER_ROLES.BUSINESS_REPRESENTATIVE) {
      toast.error("This page is only for business representatives!");
      navigate("/", { replace: true });
    }
  }

  useEffect(() => {
    async function loadRewards() {
      try {
        setLoading(true);

        // 1) Get campaign + its rewardTiers
        const campaignRes = await fetch(
          campaigns.getById(campaignId),
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
              rewardsPath.stats(tier.rewardId),
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
        toast.error(err.message || "Something went wrong");
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
