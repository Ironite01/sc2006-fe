import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './verifyReward.css';
import API from '../services/api';

export default function VerifyReward() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    fetchAndRedeemReward();
  }, [id]);

  const fetchAndRedeemReward = async () => {
    try {
      setLoading(true);
      setError('');

      // First, fetch reward details
      const response = await API.getUserReward(id);

      if (response.success) {
        const rewardData = response.reward;

        // Set initial reward data
        const formattedReward = {
          userRewardId: rewardData.userRewardId,
          campaignName: rewardData.campaignName,
          campaignImage: rewardData.campaignImage || '',
          reward: rewardData.rewardName,
          rewardDetails: rewardData.rewardDescription,
          status: rewardData.status,
          username: rewardData.username,
          email: rewardData.email,
          shopName: rewardData.shopName,
          claimedAt: new Date(rewardData.claimedAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          approvedAt: rewardData.approvedAt ? new Date(rewardData.approvedAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : null
        };

        setReward(formattedReward);

        // If reward is completed (ready to redeem), automatically redeem it
        if (rewardData.status === 'completed') {
          setRedeeming(true);
          try {
            const redeemResponse = await API.redeemReward(id);
            if (redeemResponse.success) {
              setRedeemed(true);
              // Update status to redeemed
              setReward(prev => ({ ...prev, status: 'redeemed' }));
            } else {
              setError(redeemResponse.message || 'Failed to redeem reward');
            }
          } catch (redeemErr) {
            console.error('Error redeeming reward:', redeemErr);
            setError(redeemErr.message || 'Failed to redeem reward');
          } finally {
            setRedeeming(false);
          }
        } else if (rewardData.status === 'redeemed') {
          // Already redeemed
          setRedeemed(true);
        }
      } else {
        setError('Failed to load reward details');
      }
    } catch (err) {
      console.error('Error fetching reward details:', err);
      setError(err.message || 'Failed to load reward details');
    } finally {
      setLoading(false);
    }
  };


  if (loading || redeeming) {
    return (
      <div className="verify-reward-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading">
            {loading ? 'Loading reward details...' : 'Redeeming reward...'}
          </p>
        </div>
      </div>
    );
  }

  if (error && !reward) {
    return (
      <div className="verify-reward-page">
        <div className="error-container">
          <p className="error">{error}</p>
          <button onClick={fetchRewardDetails} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="verify-reward-page">
        <p className="error">Reward not found</p>
      </div>
    );
  }

  return (
    <div className="verify-reward-page">
      <div className="verify-container">
        <h1>Reward Verification</h1>

        <div className="verify-card">
          <div className="business-header">
            <h2>{reward.shopName}</h2>
            <p className="campaign-subtitle">{reward.campaignName}</p>
          </div>

          {reward.campaignImage && (
            <img
              src={reward.campaignImage}
              alt={reward.campaignName}
              className="campaign-image"
            />
          )}

          <div className="reward-details">
            <div className="detail-section">
              <h3>Reward</h3>
              <p className="reward-name">{reward.reward}</p>
              <p className="reward-description">{reward.rewardDetails}</p>
            </div>

            <div className="detail-section">
              <h3>Supporter</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{reward.username}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{reward.email}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Reward Status</h3>
              <div className="status-badge status-{reward.status}">
                {reward.status === 'completed' && 'Ready to Redeem'}
                {reward.status === 'redeemed' && 'Already Redeemed'}
                {reward.status === 'pending' && 'Pending Approval'}
              </div>
            </div>

            {reward.status === 'pending' && (
              <div className="alert alert-warning">
                <strong>⚠️ Not Approved Yet</strong>
                <p>This reward has not been approved by the business yet.</p>
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}
          </div>

          {redeemed && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Reward Redeemed Successfully!</h3>
              <p>This reward has been marked as redeemed and cannot be used again.</p>
              <p className="timestamp">Redeemed just now</p>
            </div>
          )}

          {reward.status === 'redeemed' && !redeemed && (
            <div className="already-redeemed-message">
              <div className="info-icon">ℹ️</div>
              <h3>Already Redeemed</h3>
              <p>This reward was previously redeemed and cannot be used again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
