import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './rewardProof.css';
import API from '../../services/api';

export default function RewardProof() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRewardProof();
  }, [id]);

  const fetchRewardProof = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.getRewardProof(id);

      if (response.success) {
        const rewardData = response.reward;
        // Format the claimed date
        const claimedDate = new Date(rewardData.claimedAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        setReward({
          userRewardId: rewardData.userRewardId,
          campaignName: rewardData.campaignName,
          campaignImage: rewardData.campaignImage || '',
          reward: rewardData.rewardName,
          rewardDetails: rewardData.rewardDescription,
          status: rewardData.status.charAt(0).toUpperCase() + rewardData.status.slice(1),
          claimedDate: claimedDate,
          qrCode: rewardData.qrCode,
          shopName: rewardData.shopName
        });
      } else {
        setError('Failed to load reward proof');
      }
    } catch (err) {
      console.error('Error fetching reward proof:', err);
      setError(err.message || 'Failed to load reward proof');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="reward-proof-page"><p className="loading">Loading reward...</p></div>;
  }

  if (error || !reward) {
    return (
      <div className="reward-proof-page">
        <p className="error">{error || 'Reward not found'}</p>
        <button onClick={fetchRewardProof} className="retry-button">Retry</button>
        <button onClick={() => navigate('/rewards')} className="back-button">
          Back to My Rewards
        </button>
      </div>
    );
  }

  return (
    <div className="reward-proof-page">
      <button onClick={() => navigate('/rewards')} className="back-button">
        ← Back to My Rewards
      </button>

      <div className="proof-container">
        <h1>My Rewards</h1>

        <div className="proof-card">
          <h2 className="campaign-name">{reward.campaignName}</h2>

          {reward.campaignImage && (
            <img src={reward.campaignImage} alt={reward.campaignName} className="campaign-image" />
          )}
          {!reward.campaignImage && (
            <div className="campaign-image-placeholder">
              <span>🏪</span>
            </div>
          )}

          <div className="reward-info">
            <div className="info-row">
              <span className="info-label">Reward:</span>
              <span className="info-value">{reward.reward}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Details:</span>
              <span className="info-value">{reward.rewardDetails}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className="info-value status">{reward.status}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Claimed on:</span>
              <span className="info-value">{reward.claimedDate}</span>
            </div>
          </div>

          <div className="qr-code-section">
            {reward.qrCode ? (
              <div className="qr-code-container">
                <img src={reward.qrCode} alt="Reward QR Code" className="qr-code-image" />
                <p className="qr-instruction">Show this to staff at the business location</p>
              </div>
            ) : (
              <div className="qr-code-placeholder">
                <p>QR Code Unavailable</p>
                <p className="qr-instruction">Contact support if you need assistance</p>
              </div>
            )}
          </div>

          <p className="proof-note">
            Present this proof at {reward.campaignName} to redeem your reward
          </p>
        </div>
      </div>
    </div>
  );
}
