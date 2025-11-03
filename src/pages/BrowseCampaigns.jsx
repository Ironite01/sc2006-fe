import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BrowseCampaigns.css';
import { campaign as campaignApi } from '../paths';

export default function BrowseCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(campaignApi.list, {
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch campaigns');
      }

      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error('Error loading campaigns:', err);
      setError(err.message || 'Failed to load campaigns');
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

  const getDaysLeft = (endDate) => {
    const days = Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)));
    return days;
  };

  // Get unique tags from campaigns
  const tags = ['all', ...new Set(campaigns.map(c => c.tag || 'Other').filter(Boolean))];

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = !searchQuery ||
      campaign.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === 'all' || campaign.tag === selectedTag;

    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="browse-campaigns">
        <div className="loading">Loading campaigns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="browse-campaigns">
        <div className="error-state">
          <h2>Failed to Load Campaigns</h2>
          <p>{error}</p>
          <button onClick={loadCampaigns} className="retry-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-campaigns">
      <div className="browse-header">
        <h1>Browse Campaigns</h1>
        <p>Support local businesses in need</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="tag-filters">
          {tags.map(tag => (
            <button
              key={tag}
              className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag === 'all' ? 'All Categories' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>{filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Campaign Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="no-results">
          <p>No campaigns found matching your criteria.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedTag('all'); }} className="clear-filters">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="campaigns-grid">
          {filteredCampaigns.map(campaign => (
            <div
              key={campaign.id}
              className="campaign-card"
              onClick={() => navigate(`/campaign/${campaign.id}`)}
            >
              <div className="campaign-image">
                <img src={campaign.imageUrl || '/placeholder-shop.jpg'} alt={campaign.name} />
                {campaign.tag && <span className="campaign-tag">{campaign.tag}</span>}
              </div>

              <div className="campaign-content">
                <h3>{campaign.name}</h3>
                <p className="campaign-description">{campaign.description}</p>

                <div className="campaign-stats">
                  <div className="stat">
                    <span className="stat-value">{campaign.backerCount || 0}</span>
                    <span className="stat-label">Supporters</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{getDaysLeft(campaign.endDate)}</span>
                    <span className="stat-label">Days Left</span>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span className="amount-raised">{formatCurrency(campaign.amtRaised || 0)}</span>
                    <span className="goal">of {formatCurrency(campaign.goal)}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(campaign.progress || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <button className="view-campaign-btn">
                  View Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
