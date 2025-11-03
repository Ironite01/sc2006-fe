import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    rewardsEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);

    try {
      // Get user info from cookie
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));

      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUser(userData);

        // Load user's donations
        const donationsRes = await fetch(
          `http://localhost:3000/donations/user/${userData.userId}`,
          {
            credentials: 'include'
          }
        );

        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setDonations(donationsData.slice(0, 5)); // Show latest 5

          // Calculate stats
          const totalDonated = donationsData.reduce((sum, d) =>
            sum + (d.paymentStatus === 'completed' ? parseFloat(d.amount) : 0), 0
          );

          const campaignsSupported = new Set(
            donationsData
              .filter(d => d.paymentStatus === 'completed')
              .map(d => d.campaignId)
          ).size;

          setStats({
            totalDonated,
            campaignsSupported,
            rewardsEarned: donationsData.filter(d => d.rewardId).length
          });
        }
      } else {
        // Not logged in, redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard">
        <div className="error-state">
          <h2>Please log in</h2>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user.username}!</h1>
          <p>Here's your impact on local businesses</p>
        </div>
        <button
          className="browse-btn"
          onClick={() => navigate('/campaigns')}
        >
          Browse Campaigns
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalDonated)}</div>
            <div className="stat-label">Total Donated</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <div className="stat-value">{stats.campaignsSupported}</div>
            <div className="stat-label">Campaigns Supported</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div className="stat-content">
            <div className="stat-value">{stats.rewardsEarned}</div>
            <div className="stat-label">Rewards Earned</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button
            className="action-card"
            onClick={() => navigate('/campaigns')}
          >
            <div className="action-icon">🔍</div>
            <div className="action-text">
              <h3>Browse Campaigns</h3>
              <p>Find new businesses to support</p>
            </div>
          </button>

          <button
            className="action-card"
            onClick={() => navigate('/rewards')}
          >
            <div className="action-icon">🎁</div>
            <div className="action-text">
              <h3>My Rewards</h3>
              <p>View your earned rewards</p>
            </div>
          </button>

          <button
            className="action-card"
            onClick={() => navigate('/profile/edit')}
          >
            <div className="action-icon">⚙️</div>
            <div className="action-text">
              <h3>Profile Settings</h3>
              <p>Update your information</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="recent-activity">
        <div className="section-header">
          <h2>Recent Donations</h2>
          <button
            className="see-all-btn"
            onClick={() => navigate('/donations/history')}
          >
            See All
          </button>
        </div>

        {donations.length === 0 ? (
          <div className="empty-state">
            <p>You haven't made any donations yet</p>
            <button
              className="browse-campaigns-btn"
              onClick={() => navigate('/campaigns')}
            >
              Browse Campaigns
            </button>
          </div>
        ) : (
          <div className="donations-list">
            {donations.map((donation, index) => (
              <div key={index} className="donation-item">
                <div className="donation-info">
                  <h4>{donation.campaignName || `Campaign #${donation.campaignId}`}</h4>
                  <p className="donation-date">{formatDate(donation.donatedAt)}</p>
                </div>
                <div className="donation-details">
                  <div className="donation-amount">{formatCurrency(donation.amount)}</div>
                  <div className={`donation-status ${donation.paymentStatus}`}>
                    {donation.paymentStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <h2>Profile</h2>
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-field">
              <span className="field-label">Username:</span>
              <span className="field-value">{user.username}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{user.email}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Role:</span>
              <span className="field-value">{user.role}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Member since:</span>
              <span className="field-value">{formatDate(user.createdAt)}</span>
            </div>
          </div>
          <button
            className="edit-profile-btn"
            onClick={() => navigate('/profile/edit')}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
