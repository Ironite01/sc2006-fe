import { useState, useEffect } from 'react';
import './updates.css';
import Cookies from 'js-cookie';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Updates() {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        setUserId(userObj.userId);
      } catch (err) {
        console.error('Failed to parse user cookie:', err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchUpdates();
    }
  }, [userId]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.getSupporterUpdates(userId);

      if (response.success) {
        // Transform backend data to match component structure
        const transformedUpdates = response.updates.map(update => ({
          id: update.updateId,
          campaignId: update.campaignId,
          campaignName: update.campaignName,
          campaignImage: update.campaignImage || '',
          title: update.title,
          date: `Posted ${new Date(update.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
          content: update.content,
          image: update.imageUrl || '',
          likes: update.likeCount,
          isLiked: update.isLiked || false
        }));
        setUpdates(transformedUpdates);
      } else {
        setError('Failed to load updates');
      }
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError(err.message || 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailToggle = () => {
    setEmailNotifications(!emailNotifications);
    // TODO: Update email notification preference in backend
  };

  const handleLike = async (updateId) => {
    try {
      const response = await API.toggleUpdateLike(updateId, userId);

      if (response.success) {
        // Update the local state to reflect the like change
        setUpdates(prevUpdates =>
          prevUpdates.map(update => {
            if (update.id === updateId) {
              return {
                ...update,
                likes: response.action === 'liked' ? update.likes + 1 : update.likes - 1,
                isLiked: response.action === 'liked'
              };
            }
            return update;
          })
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleComment = (updateId, campaignId) => {
    // Navigate to campaign detail page where comments are displayed
    navigate(`/campaign/${campaignId}`);
  };

  if (loading) {
    return <div className="updates-page"><p className="loading">Loading updates...</p></div>;
  }

  if (error) {
    return (
      <div className="updates-page">
        <p className="error-message">{error}</p>
        <button onClick={fetchUpdates} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="updates-page">
      <h1>Updates</h1>
      <p className="subtitle">Campaign updates from businesses you've supported</p>

      <div className="email-subscription">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={handleEmailToggle}
          />
          <span>Email me when this business posts an update</span>
        </label>
        <p className="subscription-note">Most recent</p>
      </div>

      <div className="updates-list">
        {updates.length > 0 ? (
          updates.map(update => (
            <div key={update.id} className="update-card">
              <div className="update-header">
                {update.campaignImage && (
                  <img src={update.campaignImage} alt={update.campaignName} className="campaign-thumbnail" />
                )}
                {!update.campaignImage && (
                  <div className="campaign-thumbnail-placeholder">🏪</div>
                )}
                <h2>{update.campaignName}</h2>
              </div>

              <div className="update-content">
                <h3>{update.title}</h3>
                <p className="update-date">{update.date}</p>
                <p className="update-text">{update.content}</p>

                {update.image && (
                  <img src={update.image} alt="Update" className="update-image" />
                )}
              </div>

              <div className="update-actions">
                <button
                  className={`action-button ${update.isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(update.id)}
                >
                  <span className="icon">{update.isLiked ? '❤️' : '🤍'}</span>
                  {update.likes} {update.likes === 1 ? 'Like' : 'Likes'}
                </button>
                <button className="action-button" onClick={() => handleComment(update.id, update.campaignId)}>
                  <span className="icon">💬</span> Comment
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-updates">No updates available. Support campaigns to see their updates!</p>
        )}
      </div>
    </div>
  );
}
