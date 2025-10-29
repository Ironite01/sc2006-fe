import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./RewardTier.css";

export default function RewardTier() {
  const { tierId } = useParams();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaignId');
  const navigate = useNavigate();

  const [reward, setReward] = useState(null);
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [tierId]);

  async function loadData() {
    try {
      setLoading(true);

      // Load reward details
      const rewardRes = await fetch(`http://localhost:3000/rewards/${tierId}`, {
        credentials: 'include'
      });

      if (!rewardRes.ok) {
        throw new Error('Failed to load reward details');
      }

      const rewardData = await rewardRes.json();
      setReward(rewardData.reward);

      // Load supporters for this reward
      const supportersRes = await fetch(`http://localhost:3000/rewards/${tierId}/supporters`, {
        credentials: 'include'
      });

      if (!supportersRes.ok) {
        throw new Error('Failed to load supporters');
      }

      const supportersData = await supportersRes.json();
      setSupporters(supportersData.supporters);

      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  async function markCompleted(userRewardId) {
    try {
      const res = await fetch(`http://localhost:3000/user-rewards/${userRewardId}/approve`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to approve reward');
      }

      // Update local state
      setSupporters(supporters.map(s =>
        s.userRewardId === userRewardId
          ? { ...s, status: 'completed', approvedAt: new Date().toISOString() }
          : s
      ));
    } catch (err) {
      console.error('Error approving reward:', err);
      alert('Failed to approve reward: ' + err.message);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  if (loading) {
    return (
      <div className="reward-tier-page">
        <div className="loading">Loading supporters...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reward-tier-page">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={loadData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reward-tier-page">
      <h1 className="page-title">{reward?.campaignName || 'My Campaign'}</h1>
      <h2 className="page-subtitle">Manage Rewards</h2>

      <div className="tier-header">
        <div className="tier-pill">{reward?.rewardName || `Reward ${tierId}`}</div>
        <button
          className="back-link"
          onClick={() => navigate(`/campaign/rewards${campaignId ? `?campaignId=${campaignId}` : ''}`)}
        >
          ← Back to Rewards
        </button>
      </div>

      <div className="table-wrap">
        <table className="supporters-table">
          <thead>
            <tr>
              <th>Supporter</th>
              <th>Contact Information</th>
              <th>Claim Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {supporters.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No supporters yet.
                </td>
              </tr>
            ) : (
              supporters.map((supporter) => (
                <tr key={supporter.userRewardId}>
                  <td>{supporter.username}</td>
                  <td>{supporter.email}</td>
                  <td>{formatDate(supporter.claimedAt)}</td>
                  <td>{formatStatus(supporter.status)}</td>
                  <td>
                    {supporter.status === 'pending' ? (
                      <button
                        className="mark-btn"
                        onClick={() => markCompleted(supporter.userRewardId)}
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <span style={{ color: '#999' }}>N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
