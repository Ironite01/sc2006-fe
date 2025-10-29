import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './viewSupporters.css';
import API from '../../../services/api';

export default function ViewSupporters() {
  const { tierId } = useParams();
  const navigate = useNavigate();
  const [supporters, setSupporters] = useState([]);
  const [rewardTierName, setRewardTierName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tierId) {
      fetchSupporters();
    }
  }, [tierId]);

  const fetchSupporters = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.getRewardSupporters(tierId);

      if (response.success) {
        // Transform backend data to match component structure
        const transformedSupporters = response.supporters.map(supporter => ({
          id: supporter.userRewardId,
          userRewardId: supporter.userRewardId,
          name: supporter.username,
          email: supporter.email,
          claimDate: new Date(supporter.claimedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          status: supporter.status.charAt(0).toUpperCase() + supporter.status.slice(1)
        }));

        setSupporters(transformedSupporters);

        // Set reward tier name from first supporter, or fetch separately if needed
        if (response.supporters.length > 0) {
          setRewardTierName(response.supporters[0].rewardName);
        } else {
          setRewardTierName('Reward Tier');
        }
      } else {
        setError('Failed to load supporters');
      }
    } catch (err) {
      console.error('Error fetching supporters:', err);
      setError(err.message || 'Failed to load supporters');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (userRewardId) => {
    try {
      const response = await API.updateRewardStatus(userRewardId, 'completed');

      if (response.success) {
        // Update local state
        setSupporters(prev =>
          prev.map(supporter =>
            supporter.userRewardId === userRewardId
              ? { ...supporter, status: 'Completed' }
              : supporter
          )
        );
      } else {
        alert('Failed to update status: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating reward status:', err);
      alert('Failed to update status: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) {
    return <div className="view-supporters-page"><p className="loading">Loading supporters...</p></div>;
  }

  if (error) {
    return (
      <div className="view-supporters-page">
        <p className="error-message">{error}</p>
        <button onClick={fetchSupporters} className="retry-button">Retry</button>
        <button onClick={() => navigate('/campaign/rewards')} className="back-button">
          ← Back to Manage Rewards
        </button>
      </div>
    );
  }

  return (
    <div className="view-supporters-page">
      <button onClick={() => navigate('/campaign/rewards')} className="back-button">
        ← Back to Manage Rewards
      </button>

      <h1>My Campaign</h1>
      <h2>Manage Rewards</h2>

      <div className="reward-tier-header">
        <h3>{rewardTierName}</h3>
      </div>

      <div className="supporters-table-container">
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
            {supporters.map(supporter => (
              <tr key={supporter.id}>
                <td>{supporter.name}</td>
                <td>{supporter.email}</td>
                <td>{supporter.claimDate}</td>
                <td>
                  <span className={`status-badge ${supporter.status.toLowerCase()}`}>
                    {supporter.status}
                  </span>
                </td>
                <td>
                  {supporter.status === 'Pending' ? (
                    <button
                      onClick={() => handleMarkCompleted(supporter.userRewardId)}
                      className="action-button complete"
                    >
                      Mark Completed
                    </button>
                  ) : (
                    <span className="na">NA</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {supporters.length === 0 && (
        <p className="no-supporters">No supporters have claimed this reward tier yet.</p>
      )}
    </div>
  );
}
