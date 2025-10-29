import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "./ManageRewards.css";

export default function ManageRewards() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const campaignId = searchParams.get('campaignId');

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaignName, setCampaignName] = useState('');

  useEffect(() => {
    if (!campaignId) {
      setError('Campaign ID is required');
      setLoading(false);
      return;
    }
    loadRewards();
  }, [campaignId]);

  async function loadRewards() {
    try {
      setLoading(true);

      // Load campaign info
      const campaignRes = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
        credentials: 'include'
      });

      if (campaignRes.ok) {
        const campaignData = await campaignRes.json();
        setCampaignName(campaignData.name);
      }

      // Load rewards for this campaign
      const rewardsRes = await fetch(`http://localhost:3000/rewards?campaignId=${campaignId}`, {
        credentials: 'include'
      });

      if (!rewardsRes.ok) {
        throw new Error('Failed to load rewards');
      }

      const rewardsData = await rewardsRes.json();

      // For each reward, get the count of user_rewards by status
      const rewardsWithStats = await Promise.all(
        rewardsData.map(async (reward) => {
          const statsRes = await fetch(
            `http://localhost:3000/rewards/${reward.rewardId}/stats`,
            { credentials: 'include' }
          );

          let stats = { pending: 0, completed: 0, redeemed: 0, total: 0 };
          if (statsRes.ok) {
            stats = await statsRes.json();
          }

          return {
            ...reward,
            ...stats
          };
        })
      );

      setRewards(rewardsWithStats);
      setLoading(false);
    } catch (err) {
      console.error('Error loading rewards:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="manage-rewards-page">
        <div className="loading">Loading rewards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-rewards-page">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/campaign')}>Back to Campaigns</button>
        </div>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="manage-rewards-page">
        <h1 className="page-title">{campaignName || 'My Campaign'}</h1>
        <h2 className="page-subtitle">Manage Rewards</h2>
        <div className="empty-state">
          <p>No rewards configured for this campaign yet.</p>
          <button onClick={() => navigate(`/campaign/edit?id=${campaignId}`)}>
            Add Rewards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-rewards-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{campaignName || 'My Campaign'}</h1>
          <h2 className="page-subtitle">Manage Rewards</h2>
        </div>
        <button
          className="back-btn"
          onClick={() => navigate('/business/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="rewards-list">
        {rewards.map((reward) => (
          <div key={reward.rewardId} className="reward-row">
            <div className="reward-badge">
              <div className="reward-title">{reward.rewardName}</div>
              <div className="reward-amount">${parseFloat(reward.donationAmount).toFixed(2)}+</div>
            </div>

            <div className="reward-stats">
              <div className="stat-item">
                <span className="stat-value pending">{reward.pending}</span>
                <span className="stat-label">/ {reward.total} Pending</span>
              </div>
              <div className="stat-item">
                <span className="stat-value completed">{reward.completed}</span>
                <span className="stat-label">/ {reward.total} Approved</span>
              </div>
              <div className="stat-item">
                <span className="stat-value redeemed">{reward.redeemed}</span>
                <span className="stat-label">/ {reward.total} Redeemed</span>
              </div>
            </div>

            <div className="reward-actions">
              <Link
                className="view-btn"
                to={`/campaign/rewards/${reward.rewardId}?campaignId=${campaignId}`}
              >
                View Supporters
                {reward.pending > 0 && (
                  <span className="pending-badge">{reward.pending}</span>
                )}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
