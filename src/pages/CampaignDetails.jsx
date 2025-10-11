import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CampaignDetails.css';
import campaigns from '../data/campaigns.json';

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState(25);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // Handle both string and numeric IDs
    const foundCampaign = campaigns.campaigns.find(c => {
      // Try exact match first (for string IDs)
      if (c.id === id) return true;
      // Try numeric match (for numeric IDs)
      if (c.id === parseInt(id)) return true;
      return false;
    });
    setCampaign(foundCampaign);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="loading">Loading campaign details...</div>;
  }

  if (!campaign) {
    return (
      <div className="loading">
        <h2>Campaign Not Found</h2>
        <p>This campaign is coming soon! Check back later.</p>
        <a href="/" style={{ color: '#4F46E5', textDecoration: 'underline' }}>
          Return to Home
        </a>
      </div>
    );
  }

  const handleDonationChange = (e) => {
    setDonationAmount(parseInt(e.target.value));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log('Comment submitted:', commentText);
    setCommentText('');
  };

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
      month: 'long',
      day: 'numeric'
    });
  };

  const getSelectedReward = () => {
    return campaign.rewardTiers.reduce((prev, curr) => {
      return donationAmount >= curr.amount && curr.amount > (prev?.amount || 0) ? curr : prev;
    }, null);
  };

  return (
    <div className="campaign-details">
      {/* Hero Section */}
      <section className="hero">
        <img src={campaign.imageUrl} alt={campaign.name} />
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-tag">{campaign.tag}</div>
            <h1 className="hero-title">{campaign.name}</h1>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">{campaign.supporters}</span>
                <span className="stat-label">Supporters</span>
              </div>
              <div className="stat">
                <span className="stat-value">{campaign.daysLeft}</span>
                <span className="stat-label">Days Left</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rent Due Alert */}
      <div className="rent-alert">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>Rent due by <strong>{formatDate(campaign.rentDue)}</strong></span>
      </div>

      {/* Funding Progress */}
      <div className="funding-section">
        <div className="funding-header">
          <div className="funding-amount">
            <span className="current-amount">{formatCurrency(campaign.currentFunding)}</span>
            <span className="goal-amount">of {formatCurrency(campaign.fundingGoal)} goal</span>
          </div>
          <div className="funding-percentage">{campaign.progress}%</div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${campaign.progress}%` }}></div>
        </div>
      </div>

      <div className="content-grid">
        {/* Main Content */}
        <div className="main-content">
          {/* Our Story */}
          <section className="story-section">
            <h2>Our Story</h2>
            <div className="story-content">
              {campaign.story.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Updates */}
          <section className="updates-section">
            <h2>Updates</h2>
            <div className="updates-list">
              {campaign.updates.map(update => (
                <div key={update.id} className="update-card">
                  <div className="update-header">
                    <h3>{update.title}</h3>
                    <span className="update-date">{formatDate(update.date)}</span>
                  </div>
                  <p className="update-content">{update.content}</p>
                  {update.image && (
                    <img src={update.image} alt={update.title} className="update-image" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Shops We've Lost */}
          <section className="shops-lost-section">
            <h2>Shops We've Lost</h2>
            <p className="section-description">
              Over {campaign.shopsLostData.totalClosed} local businesses have closed in recent years.
              Don't let {campaign.name} become another statistic.
            </p>

            <div className="data-visualization">
              <div className="chart-container">
                <h3>Closures by Year</h3>
                <div className="bar-chart">
                  {campaign.shopsLostData.byYear.map(item => (
                    <div key={item.year} className="bar-item">
                      <div className="bar-wrapper">
                        <div
                          className="bar"
                          style={{ height: `${(item.count / 312) * 100}%` }}
                        >
                          <span className="bar-value">{item.count}</span>
                        </div>
                      </div>
                      <span className="bar-label">{item.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-container">
                <h3>Closures by Category</h3>
                <div className="category-chart">
                  {campaign.shopsLostData.byCategory.map(item => (
                    <div key={item.category} className="category-item">
                      <div className="category-header">
                        <span className="category-name">{item.category}</span>
                        <span className="category-count">{item.count}</span>
                      </div>
                      <div className="category-bar">
                        <div
                          className="category-fill"
                          style={{ width: `${(item.count / 487) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Meet The Owners */}
          <section className="owners-section">
            <h2>Meet The Owners</h2>
            <div className="owners-grid">
              {campaign.owners.map((owner, index) => (
                <div key={index} className="owner-card">
                  <img src={owner.image} alt={owner.name} className="owner-image" />
                  <div className="owner-info">
                    <h3>{owner.name}</h3>
                    <p className="owner-role">{owner.role}</p>
                    <p className="owner-bio">{owner.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Comments */}
          <section className="comments-section">
            <h2>Comments ({campaign.comments.length})</h2>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <textarea
                placeholder="Leave a word of encouragement..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="4"
              />
              <button type="submit" className="submit-comment-btn">
                Post Comment
              </button>
            </form>

            <div className="comments-list">
              {campaign.comments.map(comment => (
                <div key={comment.id} className="comment-card">
                  <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">{formatDate(comment.date)}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Support Section */}
          <div className="support-card">
            <h2>Support Them!</h2>

            <div className="amount-selector">
              <label htmlFor="donation-slider">Select Amount</label>
              <div className="amount-display">
                {formatCurrency(donationAmount)}
              </div>
              <input
                id="donation-slider"
                type="range"
                min="10"
                max="250"
                step="5"
                value={donationAmount}
                onChange={handleDonationChange}
                className="donation-slider"
              />
              <div className="slider-labels">
                <span>$10</span>
                <span>$250</span>
              </div>
            </div>

            {/* Reward Tiers */}
            <div className="reward-tiers">
              <h3>Rewards</h3>
              {campaign.rewardTiers.map(tier => {
                const isSelected = donationAmount >= tier.amount;
                const isCurrentReward = getSelectedReward()?.amount === tier.amount;

                return (
                  <div
                    key={tier.amount}
                    className={`reward-tier ${isSelected ? 'unlocked' : 'locked'} ${isCurrentReward ? 'selected' : ''}`}
                    onClick={() => setDonationAmount(tier.amount)}
                  >
                    <div className="reward-header">
                      <span className="reward-amount">{formatCurrency(tier.amount)}</span>
                      {isCurrentReward && <span className="selected-badge">Selected</span>}
                    </div>
                    <h4 className="reward-title">{tier.title}</h4>
                    <p className="reward-description">{tier.description}</p>
                    <span className="reward-backers">{tier.backers} backers</span>
                  </div>
                );
              })}
            </div>

            <button className="donate-btn">
              Donate {formatCurrency(donationAmount)}
            </button>

            <p className="secure-note">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment processing
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
