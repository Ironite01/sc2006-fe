import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminPages.css';
import API from '../../services/api';

export default function ApprovedCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApprovedCampaigns();
  }, []);

  const fetchApprovedCampaigns = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.getApprovedCampaigns();

      if (response.success) {
        // Transform backend data to match component structure
        const transformedCampaigns = response.campaigns.map(campaign => ({
          id: campaign.campaignId,
          name: campaign.name,
          owner: campaign.creatorUsername || 'Unknown',
          shopName: campaign.shopName,
          approvedDate: new Date(campaign.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          image: campaign.imageUrl || ''
        }));

        setCampaigns(transformedCampaigns);
      } else {
        setError('Failed to load approved campaigns');
      }
    } catch (err) {
      console.error('Error fetching approved campaigns:', err);
      setError(err.message || 'Failed to load approved campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCampaign = (campaignId) => {
    navigate(`/campaign/${campaignId}`);
  };

  return (
    <div className="admin-page">
      <nav className="admin-nav">
        <button onClick={() => navigate('/admin/pending')}>Pending Campaigns</button>
        <button onClick={() => navigate('/admin/approved')} className="active">Approved Campaigns</button>
        <button onClick={() => navigate('/admin/suspended')}>Suspended Campaigns</button>
        <button onClick={() => navigate('/admin/stats')}>Platform Stats</button>
      </nav>

      <h1>Approved Campaigns</h1>

      {loading ? (
        <p className="loading">Loading campaigns...</p>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchApprovedCampaigns} className="retry-button">Retry</button>
        </div>
      ) : (
        <>
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Owner</th>
                <th>Date Approved</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(campaign => (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>{campaign.owner}</td>
                  <td>{campaign.approvedDate}</td>
                  <td>
                    <button onClick={() => handleViewCampaign(campaign.id)} className="view-btn">
                      View Campaign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {campaigns.length === 0 && <p className="no-data">No approved campaigns</p>}
        </>
      )}
    </div>
  );
}
