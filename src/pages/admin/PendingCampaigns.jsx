import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminPages.css';
import API from '../../services/api';

export default function PendingCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const fetchPendingCampaigns = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.getPendingCampaigns();

      if (response.success) {
        // Transform backend data to match component structure
        const transformedCampaigns = response.campaigns.map(campaign => ({
          id: campaign.campaignId,
          name: campaign.name,
          owner: campaign.creatorUsername || 'Unknown',
          shopName: campaign.shopName,
          submittedDate: new Date(campaign.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          image: campaign.imageUrl || ''
        }));

        setCampaigns(transformedCampaigns);
      } else {
        setError('Failed to load pending campaigns');
      }
    } catch (err) {
      console.error('Error fetching pending campaigns:', err);
      setError(err.message || 'Failed to load pending campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (campaignId) => {
    try {
      const response = await API.approveCampaign(campaignId);

      if (response.success) {
        // Remove from local state
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      } else {
        alert('Failed to approve campaign: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error approving campaign:', err);
      alert('Failed to approve campaign: ' + (err.message || 'Unknown error'));
    }
  };

  const handleReject = async (campaignId) => {
    try {
      const response = await API.rejectCampaign(campaignId);

      if (response.success) {
        // Remove from local state
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      } else {
        alert('Failed to reject campaign: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error rejecting campaign:', err);
      alert('Failed to reject campaign: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="admin-page">
      <nav className="admin-nav">
        <button onClick={() => navigate('/admin/pending')} className="active">Pending Campaigns</button>
        <button onClick={() => navigate('/admin/approved')}>Approved Campaigns</button>
        <button onClick={() => navigate('/admin/suspended')}>Suspended Campaigns</button>
        <button onClick={() => navigate('/admin/stats')}>Platform Stats</button>
      </nav>

      <h1>Pending Campaigns</h1>

      {loading ? (
        <p className="loading">Loading campaigns...</p>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchPendingCampaigns} className="retry-button">Retry</button>
        </div>
      ) : (
        <>
          <div className="campaigns-table">
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Owner</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>{campaign.owner}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleApprove(campaign.id)} className="approve-btn">Approve</button>
                        <button onClick={() => handleReject(campaign.id)} className="reject-btn">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="campaigns-grid">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-image">{campaign.image || '🏪'}</div>
                <h3>{campaign.name}</h3>
                <p>Pending {campaign.submittedDate}</p>
                <div className="card-actions">
                  <button onClick={() => handleApprove(campaign.id)} className="approve-btn">Approve</button>
                  <button onClick={() => handleReject(campaign.id)} className="reject-btn">Reject</button>
                </div>
              </div>
            ))}
          </div>

          {campaigns.length === 0 && <p className="no-data">No pending campaigns</p>}
        </>
      )}
    </div>
  );
}
