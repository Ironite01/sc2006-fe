import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminPages.css';
import API from '../../services/api';

export default function PlatformStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.getPlatformStats();

      if (response.success) {
        // Transform backend data to match component structure
        const statsData = response.stats;
        setStats({
          campaigns: statsData.campaigns.total,
          donations: statsData.donations.total,
          netVolume: statsData.donations.volume,
          supporters: statsData.supporters.unique,
          campaignBreakdown: {
            pending: statsData.campaigns.byStatus.pending || 0,
            approved: statsData.campaigns.byStatus.approved || 0,
            rejected: statsData.campaigns.byStatus.rejected || 0,
            suspended: statsData.campaigns.byStatus.suspended || 0
          },
          refundRate: parseFloat(statsData.refundRate),
          platformRevenue: 0, // Calculate if needed
          topCampaigns: statsData.topCampaigns || [],
          recentActivity: statsData.recentActivity || []
        });
      } else {
        setError('Failed to load platform statistics');
      }
    } catch (err) {
      console.error('Error fetching platform stats:', err);
      setError(err.message || 'Failed to load platform statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="loading">Loading stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <nav className="admin-nav">
          <button onClick={() => navigate('/admin/pending')}>Pending Campaigns</button>
          <button onClick={() => navigate('/admin/approved')}>Approved Campaigns</button>
          <button onClick={() => navigate('/admin/suspended')}>Suspended Campaigns</button>
          <button onClick={() => navigate('/admin/stats')} className="active">Platform Stats</button>
        </nav>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchPlatformStats} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-page">
        <p className="loading">No stats available</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <nav className="admin-nav">
        <button onClick={() => navigate('/admin/pending')}>Pending Campaigns</button>
        <button onClick={() => navigate('/admin/approved')}>Approved Campaigns</button>
        <button onClick={() => navigate('/admin/suspended')}>Suspended Campaigns</button>
        <button onClick={() => navigate('/admin/stats')} className="active">Platform Stats</button>
      </nav>

      <h1>Platform Stats</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Campaigns</h3>
          <p className="stat-number">{stats.campaigns}</p>
        </div>
        <div className="stat-card">
          <h3>Donations</h3>
          <p className="stat-number">{stats.donations.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Net Volume</h3>
          <p className="stat-number">${stats.netVolume.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Supporters</h3>
          <p className="stat-number">{stats.supporters.toLocaleString()}</p>
        </div>
      </div>

      <div className="stats-section">
        <h2>Donations Over Time</h2>
        <div className="chart-placeholder">
          <p>📊 Line graph visualization</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stats-section half">
          <h2>Conversion Funnel</h2>
          <div className="funnel">
            <div className="funnel-item">
              <span>Campaign Visits</span>
              <strong>50,000</strong>
            </div>
            <div className="funnel-item">
              <span>Donations</span>
              <strong>22,500</strong>
            </div>
            <div className="funnel-item">
              <span>Completed Donations</span>
              <strong>3,450</strong>
            </div>
          </div>
          <div className="metric">
            <span>Platform Revenue</span>
            <strong>${stats.platformRevenue.toLocaleString()}</strong>
          </div>
          <div className="metric">
            <span>Refund Rate</span>
            <strong>{stats.refundRate}%</strong>
          </div>
        </div>

        <div className="stats-section half">
          <h2>Campaigns</h2>
          <div className="campaign-breakdown">
            <div className="breakdown-item">
              <span>Pending</span>
              <strong>{stats.campaignBreakdown.pending}</strong>
            </div>
            <div className="breakdown-item">
              <span>Approved</span>
              <strong>{stats.campaignBreakdown.approved}</strong>
            </div>
            <div className="breakdown-item">
              <span>Rejected</span>
              <strong>{stats.campaignBreakdown.rejected}</strong>
            </div>
            <div className="breakdown-item">
              <span>Suspended</span>
              <strong>{stats.campaignBreakdown.suspended}</strong>
            </div>
          </div>
          <div className="metric">
            <span>Refund Rate</span>
            <strong>{stats.refundRate}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
