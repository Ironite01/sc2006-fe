import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessDashboard.css';

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalBackers: 0,
    activeCampaigns: 0,
    completedCampaigns: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    setError(null);

    try {
      // Get user info from cookie
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));

      if (!userCookie) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      setUser(userData);

      // Check if user is business representative
      if (userData.role !== 'BUSINESS_REPRESENTATIVE') {
        setError('Access denied. Business representatives only.');
        return;
      }

      // Load user's campaigns
      const campaignsRes = await fetch(
        `http://localhost:3000/campaigns?userId=${userData.userId}`,
        { credentials: 'include' }
      );

      if (!campaignsRes.ok) {
        throw new Error('Failed to load campaigns');
      }

      const campaignsData = await campaignsRes.json();
      setCampaigns(campaignsData);

      // Calculate statistics
      let totalRaised = 0;
      let totalBackers = 0;
      let activeCampaigns = 0;
      let completedCampaigns = 0;

      campaignsData.forEach(campaign => {
        totalRaised += parseFloat(campaign.amtRaised || 0);
        totalBackers += parseInt(campaign.backerCount || 0);

        if (campaign.status === 'approved') {
          // Check if campaign is still active (not past end date)
          const endDate = new Date(campaign.endDate);
          const now = new Date();
          if (endDate > now) {
            activeCampaigns++;
          } else {
            completedCampaigns++;
          }
        }
      });

      setStats({
        totalRaised,
        totalBackers,
        activeCampaigns,
        completedCampaigns
      });

    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending Review', className: 'status-pending' },
      approved: { text: 'Active', className: 'status-approved' },
      rejected: { text: 'Rejected', className: 'status-rejected' },
      onHold: { text: 'On Hold', className: 'status-onhold' }
    };
    return badges[status] || { text: status, className: 'status-default' };
  };

  const getDaysLeft = (endDate) => {
    const days = Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)));
    return days;
  };

  if (loading) {
    return (
      <div className="business-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="business-dashboard">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="action-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="business-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Business Dashboard</h1>
          <p>Manage your campaigns and track performance</p>
        </div>
        <button
          className="create-btn"
          onClick={() => navigate('/campaign/create')}
        >
          + Create Campaign
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalRaised)}</div>
            <div className="stat-label">Total Raised</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalBackers}</div>
            <div className="stat-label">Total Backers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeCampaigns}</div>
            <div className="stat-label">Active Campaigns</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedCampaigns}</div>
            <div className="stat-label">Completed Campaigns</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button
            className="action-card"
            onClick={() => navigate('/campaign')}
          >
            <div className="action-icon">📋</div>
            <div className="action-text">
              <h3>My Campaigns</h3>
              <p>View and manage all campaigns</p>
            </div>
          </button>

          <button
            className="action-card"
            onClick={() => navigate('/campaign/create')}
          >
            <div className="action-icon">➕</div>
            <div className="action-text">
              <h3>Create Campaign</h3>
              <p>Start a new fundraising campaign</p>
            </div>
          </button>

          <button
            className="action-card"
            onClick={() => navigate('/campaign/rewards')}
          >
            <div className="action-icon">🎁</div>
            <div className="action-text">
              <h3>Manage Rewards</h3>
              <p>Configure reward tiers</p>
            </div>
          </button>
        </div>
      </div>

      {/* Campaign List */}
      <div className="campaigns-section">
        <div className="section-header">
          <h2>Your Campaigns</h2>
          <button
            className="view-all-btn"
            onClick={() => navigate('/campaign')}
          >
            View All
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any campaigns yet.</p>
            <button
              className="create-campaign-btn"
              onClick={() => navigate('/campaign/create')}
            >
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="campaigns-grid">
            {campaigns.slice(0, 6).map(campaign => {
              const statusBadge = getStatusBadge(campaign.status);
              const progress = campaign.goal > 0
                ? Math.round((campaign.amtRaised / campaign.goal) * 100)
                : 0;

              return (
                <div
                  key={campaign.id}
                  className="campaign-card"
                  onClick={() => navigate(`/campaign/${campaign.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="campaign-image">
                    {campaign.imageUrl ? (
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="placeholder-image">
                        <span>📷</span>
                        <p>No Image</p>
                      </div>
                    )}
                    <span className={`status-badge ${statusBadge.className}`}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <div className="campaign-info">
                    <h3>{campaign.name || 'Untitled Campaign'}</h3>

                    <div className="campaign-stats">
                      <div className="stat-row">
                        <span className="label">Raised:</span>
                        <span className="value">{formatCurrency(campaign.amtRaised || 0)}</span>
                      </div>
                      <div className="stat-row">
                        <span className="label">Goal:</span>
                        <span className="value">{formatCurrency(campaign.goal)}</span>
                      </div>
                      <div className="stat-row">
                        <span className="label">Backers:</span>
                        <span className="value">{campaign.backerCount || 0}</span>
                      </div>
                      <div className="stat-row">
                        <span className="label">Days Left:</span>
                        <span className="value">{getDaysLeft(campaign.endDate)}</span>
                      </div>
                    </div>

                    <div className="progress-section">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{progress}% funded</span>
                    </div>

                    <div className="campaign-actions">
                      <button
                        className="btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/campaign/${campaign.id}/analytics`);
                        }}
                      >
                        View Analytics
                      </button>
                      <button
                        className="btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/campaign/edit?id=${campaign.id}`);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
