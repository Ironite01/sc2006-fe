import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminPages.css';
import API from '../../services/api';

export default function SuspendedCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuspendedCampaigns();
  }, []);

  const fetchSuspendedCampaigns = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.getAllCampaigns('suspended');

      if (response.success) {
        // Transform backend data to match component structure
        const transformedCampaigns = response.campaigns.map(campaign => ({
          id: campaign.campaignId,
          name: campaign.name,
          owner: campaign.creatorUsername || 'Unknown',
          shopName: campaign.shopName,
          status: campaign.status,
          image: campaign.imageUrl || ''
        }));

        setCampaigns(transformedCampaigns);
      } else {
        setError('Failed to load suspended campaigns');
      }
    } catch (err) {
      console.error('Error fetching suspended campaigns:', err);
      setError(err.message || 'Failed to load suspended campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (campaignId) => {
    try {
      const response = await API.suspendCampaign(campaignId);

      if (response.success) {
        // Update local state
        setCampaigns(prev =>
          prev.map(c => c.id === campaignId ? { ...c, status: 'suspended' } : c)
        );
      } else {
        alert('Failed to suspend campaign: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error suspending campaign:', err);
      alert('Failed to suspend campaign: ' + (err.message || 'Unknown error'));
    }
  };

  const handleUnsuspend = async (campaignId) => {
    try {
      const response = await API.unsuspendCampaign(campaignId);

      if (response.success) {
        // Update local state
        setCampaigns(prev =>
          prev.map(c => c.id === campaignId ? { ...c, status: 'approved' } : c)
        );
      } else {
        alert('Failed to unsuspend campaign: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error unsuspending campaign:', err);
      alert('Failed to unsuspend campaign: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="admin-page">
      <nav className="admin-nav">
        <button onClick={() => navigate('/admin/pending')}>Pending Campaigns</button>
        <button onClick={() => navigate('/admin/approved')}>Approved Campaigns</button>
        <button onClick={() => navigate('/admin/suspended')} className="active">Suspended Campaigns</button>
        <button onClick={() => navigate('/admin/stats')}>Platform Stats</button>
      </nav>

      <h1>Suspended Campaigns</h1>

      {loading ? (
        <p className="loading">Loading campaigns...</p>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchSuspendedCampaigns} className="retry-button">Retry</button>
        </div>
      ) : (
        <>
          <table className="campaigns-table">
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
                    {campaign.status === 'suspended' ? (
                      <button onClick={() => handleUnsuspend(campaign.id)} className="unsuspend-btn">
                        Unsuspend
                      </button>
                    ) : (
                      <button onClick={() => handleSuspend(campaign.id)} className="suspend-btn">
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {campaigns.length === 0 && <p className="no-data">No campaigns</p>}
        </>
      )}
    </div>
  );
}
