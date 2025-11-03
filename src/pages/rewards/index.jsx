import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './rewards.css';
import Cookies from 'js-cookie';
import API from '../../services/api';

export default function MyRewards() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState({
    pending: [],
    completed: [],
    redeemed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        setUsername(userObj.username || 'User');
        setProfilePicture(userObj.picture || '');
        setUserId(userObj.userId);
      } catch (err) {
        console.error('Failed to parse user cookie:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    } else {
      // No user logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchRewards();
    }
  }, [userId]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.getUserRewards(userId);

      if (response.success) {
        // Backend returns { rewards: { pending: [], completed: [], redeemed: [] } }
        setRewards(response.rewards);
      } else {
        setError('Failed to load rewards');
      }
    } catch (err) {
      console.error('Error fetching rewards:', err);
      setError(err.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleRewardClick = (reward, status) => {
    if (status === 'completed') {
      navigate(`/rewards/${reward.userRewardId}`);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return <div className="rewards-page"><p className="loading">Loading rewards...</p></div>;
  }

  if (error) {
    return (
      <div className="rewards-page">
        <p className="error-message">{error}</p>
        <button onClick={fetchRewards} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="rewards-page">
      <div className="profile-section">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button className="edit-button" onClick={handleEditProfile}>Edit</button>
        </div>
        <div className="profile-info">
          {profilePicture && <img src={profilePicture} alt="Profile" className="profile-picture" />}
          {!profilePicture && <div className="profile-picture-placeholder"></div>}
          <p className="username">{username}</p>
        </div>
      </div>

      <div className="rewards-section">
        <h2>My Rewards:</h2>

        <div className="rewards-category">
          <h3>Pending</h3>
          <div className="rewards-grid">
            {rewards.pending.length > 0 ? (
              rewards.pending.map(reward => (
                <div key={reward.userRewardId} className="reward-card pending">
                  <div className="reward-image">
                    {reward.campaignImage ? <img src={reward.campaignImage} alt={reward.campaignName} /> : '📦'}
                  </div>
                  <div className="reward-details">
                    <h4>{reward.campaignName}</h4>
                    <p className="reward-name">{reward.rewardName}</p>
                    <span className="reward-status">Awaiting Approval</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-rewards">No pending rewards</p>
            )}
          </div>
        </div>

        <div className="rewards-category">
          <h3>Completed</h3>
          <div className="rewards-grid">
            {rewards.completed.length > 0 ? (
              rewards.completed.map(reward => (
                <div
                  key={reward.userRewardId}
                  className="reward-card completed clickable"
                  onClick={() => handleRewardClick(reward, 'completed')}
                >
                  <div className="reward-image">
                    {reward.campaignImage ? <img src={reward.campaignImage} alt={reward.campaignName} /> : '✅'}
                  </div>
                  <div className="reward-details">
                    <h4>{reward.campaignName}</h4>
                    <p className="reward-name">{reward.rewardName}</p>
                    <span className="reward-status">Ready to Use</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-rewards">No completed rewards</p>
            )}
          </div>
        </div>

        <div className="rewards-category">
          <h3>Redeemed</h3>
          <div className="rewards-grid">
            {rewards.redeemed.length > 0 ? (
              rewards.redeemed.map(reward => (
                <div key={reward.userRewardId} className="reward-card redeemed">
                  <div className="reward-image">
                    {reward.campaignImage ? <img src={reward.campaignImage} alt={reward.campaignName} /> : '🎁'}
                  </div>
                  <div className="reward-details">
                    <h4>{reward.campaignName}</h4>
                    <p className="reward-name">{reward.rewardName}</p>
                    <span className="reward-status">Used</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-rewards">No redeemed rewards</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
