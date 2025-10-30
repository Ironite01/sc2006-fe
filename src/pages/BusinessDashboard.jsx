import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessDashboard.css';
import './campaign/components/CampaignManager.css';

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

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return 'status-draft';
    }
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

      {/* Campaign Manager Section */}
      <div className="campaign-manager-content">
        {/* Create Your Campaign Section */}
        <div className="create-section">
          <h2 className="section-title">Create Your Campaign</h2>
          <p className="section-description">
            A campaign is your opportunity to share your business story and
            rally support from the community. By creating a campaign, you can
            explain why you need funding, set your fundraising goal, showcase
            photos of your business, and offer rewards for different donation
            amounts. This helps supporters understand your vision and
            motivates them to contribute towards your success.
          </p>

          <div className="campaign-card">
            <div className="campaign-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-lines">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line short"></div>
                </div>
              </div>
              <div className="campaign-label">Campaign</div>
              <div className="progress-bar-placeholder">
                <div className="progress-fill"></div>
              </div>
            </div>
            <button
              className="create-campaign-btn"
              onClick={() => navigate('/campaign/create')}
            >
              Create your campaign
            </button>
          </div>
        </div>

        {/* My Campaigns Section */}
        {campaigns.length > 0 ? (
          <div className="my-campaigns-section">
            <h2 className="my-campaigns-title">My Campaigns ({campaigns.length})</h2>

            <div className="campaigns-list">
              {campaigns.map((campaign) => {
                const progress = (parseFloat(campaign.amtRaised || 0) / parseFloat(campaign.goal || 1)) * 100;
                const daysLeft = getDaysLeft(campaign.endDate);

                return (
                  <div key={campaign.id} className="campaign-item">
                    <div className="campaign-item-image">
                      {campaign.imageUrl ? (
                        <img src={campaign.imageUrl} alt={campaign.name} />
                      ) : (
                        <div className="campaign-placeholder-small">
                          <div className="placeholder-content">
                            <div className="placeholder-lines">
                              <div className="line"></div>
                              <div className="line"></div>
                              <div className="line short"></div>
                            </div>
                          </div>
                          <div className="campaign-label">No Image</div>
                        </div>
                      )}
                      <span className={`status-badge ${getStatusBadgeClass(campaign.status)}`}>
                        {campaign.status || 'draft'}
                      </span>
                    </div>

                    <div className="campaign-item-content">
                      <div className="campaign-header">
                        <h3 className="campaign-name">{campaign.name}</h3>
                        <div className="campaign-stats-inline">
                          <span className="stat-item">
                            <span className="stat-icon">👥</span> {campaign.backerCount || 0} backers
                          </span>
                          <span className="stat-item">
                            <span className="stat-icon">📅</span> {daysLeft} days left
                          </span>
                        </div>
                      </div>

                      <p className="campaign-description">{campaign.description}</p>

                      <div className="campaign-progress">
                        <div className="progress-bar">
                          <div className="progress-fill-active" style={{width: `${Math.min(progress, 100)}%`}}></div>
                        </div>
                        <div className="progress-text">
                          <span className="raised-amount">{formatCurrency(campaign.amtRaised || 0)} raised</span>
                          <span className="goal-amount">of {formatCurrency(campaign.goal)} goal ({progress.toFixed(0)}%)</span>
                        </div>
                      </div>

                      <div className="campaign-actions">
                        <button
                          className="action-btn btn-view-analytics"
                          onClick={() => navigate(`/campaign/${campaign.id}/analytics`)}
                        >
                          View Analytics
                        </button>
                        <button
                          className="action-btn btn-edit"
                          onClick={() => navigate(`/campaign/edit?id=${campaign.id}`)}
                        >
                          Edit Campaign
                        </button>
                        <button
                          className="action-btn btn-rewards"
                          onClick={() => navigate(`/campaign/rewards?campaignId=${campaign.id}`)}
                        >
                          Manage Rewards
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="no-campaigns-state">
            <p>You haven't created any campaigns yet</p>
            <p className="subtext">Click the "Create your campaign" button above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
