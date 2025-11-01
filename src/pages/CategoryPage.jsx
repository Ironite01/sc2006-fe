import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CategoryPage.css';
import { shop as shopApi, backendPath } from '../paths';

// Category display information
const CATEGORY_INFO = {
  media: {
    title: 'Culture & Creativity',
    description: 'Independent stores preserving physical media and literary culture',
    icon: '📚'
  },
  sustainable: {
    title: 'Sustainable Living',
    description: 'Eco-conscious businesses fighting fast fashion and throwaway culture',
    icon: '♻️'
  },
  craft: {
    title: 'Masters of Craft',
    description: 'Skilled artisans preserving traditional repair and tailoring crafts',
    icon: '🔧'
  },
  community: {
    title: 'Community Spaces',
    description: 'Gathering places fostering real human connection',
    icon: '🤝'
  },
  heritage: {
    title: 'Local Gems Worth Saving',
    description: 'Traditional Singaporean businesses with deep community roots',
    icon: '🏪'
  },
  food: {
    title: 'Flavours You\'ll Love',
    description: 'Authentic cuisine from passionate food artisans',
    icon: '🍜'
  }
};

export default function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryInfo = CATEGORY_INFO[categoryName] || {
    title: categoryName,
    description: 'Browse campaigns in this category',
    icon: '📍'
  };

  useEffect(() => {
    loadCampaignsByCategory();
  }, [categoryName]);

  async function loadCampaignsByCategory() {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Fetch all shops
      const shopsRes = await fetch(`${shopApi.list}?limit=100&page=1`, {
        credentials: 'include'
      });

      if (!shopsRes.ok) {
        throw new Error('Failed to fetch shops');
      }

      const shopsData = await shopsRes.json();

      // Step 2: Filter shops by displayCategory
      const categoryShops = shopsData.filter(
        shopData => shopData.shop?.displayCategory === categoryName
      );

      if (categoryShops.length === 0) {
        setCampaigns([]);
        setLoading(false);
        return;
      }

      // Step 3: Fetch campaigns for each shop in this category
      const campaignPromises = categoryShops.map(async (shopData) => {
        try {
          const campaignsRes = await fetch(
            `${backendPath}/shops/${shopData.id}/campaigns`,
            { credentials: 'include' }
          );

          if (!campaignsRes.ok) {
            console.warn(`Failed to fetch campaigns for shop ${shopData.id}`);
            return [];
          }

          const shopCampaigns = await campaignsRes.json();

          // Add shop information to each campaign for display
          return shopCampaigns.map(campaign => ({
            ...campaign,
            shopName: shopData.shop?.name,
            tag: shopData.shop?.tag || campaign.tag
          }));
        } catch (err) {
          console.error(`Error fetching campaigns for shop ${shopData.id}:`, err);
          return [];
        }
      });

      // Step 4: Wait for all campaign fetches and flatten results
      const campaignArrays = await Promise.all(campaignPromises);
      const allCampaigns = campaignArrays.flat();

      // Filter only approved campaigns
      const approvedCampaigns = allCampaigns.filter(c => c.status === 'approved');

      setCampaigns(approvedCampaigns);
    } catch (err) {
      console.error('Error loading campaigns by category:', err);
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

  if (loading) {
    return (
      <div className="category-page">
        <div className="category-loading">Loading campaigns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="category-error-state">
          <h2>Failed to Load Campaigns</h2>
          <p>{error}</p>
          <button onClick={loadCampaignsByCategory} className="category-retry-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-icon-large">{categoryInfo.icon}</div>
        <h1>{categoryInfo.title}</h1>
        <p>{categoryInfo.description}</p>
      </div>

      {/* Results Count */}
      <div className="category-results-info">
        <p>{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Campaign Grid */}
      {campaigns.length === 0 ? (
        <div className="category-no-results">
          <p>No active campaigns found in this category yet.</p>
          <button onClick={() => navigate('/campaigns')} className="category-browse-all-btn">
            Browse All Campaigns
          </button>
        </div>
      ) : (
        <div className="category-campaigns-grid">
          {campaigns.map(campaign => (
            <div
              key={campaign.id || campaign.campaignId}
              className="category-campaign-card"
              onClick={() => navigate(`/campaign/${campaign.id || campaign.campaignId}`)}
            >
              <div className="category-campaign-thumb">
                <img src={campaign.imageUrl || '/placeholder-shop.jpg'} alt={campaign.name} />
              </div>

              <div className="category-campaign-meta">
                {campaign.tag && <div className="category-campaign-tag">{campaign.tag}</div>}

                <h3 className="category-campaign-name">{campaign.name}</h3>

                {campaign.shopName && (
                  <p className="category-campaign-shop">by {campaign.shopName}</p>
                )}

                <p className="category-campaign-description">{campaign.description}</p>

                <div className="category-campaign-stats">
                  <div className="category-campaign-stat">
                    <span className="category-campaign-stat-value">{campaign.backerCount || 0}</span>
                    <span className="category-campaign-stat-label">Supporters</span>
                  </div>
                  <div className="category-campaign-stat">
                    <span className="category-campaign-stat-value">{getDaysLeft(campaign.endDate)}</span>
                    <span className="category-campaign-stat-label">Days Left</span>
                  </div>
                </div>

                <div className="category-campaign-progress">
                  <div className="category-campaign-progress-header">
                    <span className="category-campaign-amount-raised">{formatCurrency(campaign.amtRaised || 0)}</span>
                    <span className="category-campaign-goal">of {formatCurrency(campaign.goal)}</span>
                  </div>
                  <div className="category-campaign-progress-bar">
                    <div
                      className="category-campaign-progress-fill"
                      style={{ width: `${Math.min(campaign.progress || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
