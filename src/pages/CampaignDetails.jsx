import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CampaignDetails.css';
import ShopsLostSection from '../components/ShopsLostSection';
import { useNavigate } from "react-router-dom";
import SubmitButton from '../components/SubmitButton';
import { campaigns } from '../../paths';
import { toast } from 'react-toastify';
import daysLeft from "../helpers/daysLeft";

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState(25);
  //const [image, setImage] = useState(null);
  const navigate = useNavigate();

  async function getCampaign() {
    try {
      const res = await fetch(campaigns.getById(id), {
        method: 'GET',
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error("Failed to get campaign");
      }
      const campaign = await res.json();
      setCampaign(campaign);
    } catch (e) {
      toast.error(e.message);
    }
  }

  const handleDonateClick = () => {
    navigate(`/campaign/${id}/donation`, {
      state: {
        campaignId: id,
        amount: donationAmount,
        reward: getSelectedReward(),
      },
    });
  };


  useEffect(() => {
    getCampaign();
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
        <img src={campaign.image} alt={campaign.name} />
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-tag">{campaign.tag}</div>
            <h1 className="hero-title">{campaign.name}</h1>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">{campaign.backerCount}</span>
                <span className="stat-label">Supporters</span>
              </div>
              <div className="stat">
                <span className="stat-value">{daysLeft(campaign.endDate)}</span>
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
        <span>Rent due by <strong>{formatDate(campaign.endDate)}</strong></span>
      </div>

      {/* Funding Progress */}
      <div className="funding-section">
        <div className="funding-header">
          <div className="funding-amount">
            <span className="current-amount">{formatCurrency(campaign.currentAmount)}</span>
            <span className="goal-amount">of {formatCurrency(campaign.goal)} goal</span>
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
              {campaign?.story?.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Updates */}
          <section className="updates-section">
            <h2>Updates</h2>
            <div className="updates-list">
              {campaign?.updates?.map(update => (
                <div key={update.updateId} className="update-card" onClick={() => navigate(`${location.pathname}/updates/${update.updateId}`)}>
                  <div className="update-header">
                    <h3>{update.title}</h3>
                    <span className="update-date">{formatDate(update.postedAt)}</span>
                  </div>
                  <p className="update-content">{update.description}</p>

                  <div className="update-actions">
                    <button className="like-button">
                      ❤️ {update.likeCount || 0}
                    </button>
                    <button className="comment-button">
                      💬 {update.commentCount || 0}
                    </button>
                  </div>

                  {/* Optional: Show comments */}
                  {update?.comments && update.comments.length > 0 && (
                    <div className="comments-section">
                      {update.comments.map(comment => (
                        <div key={comment.commentId} className="comment">
                          <strong>{comment.username}</strong> <span>{comment.commentText}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* TODO: Shops We've Lost */}
          <ShopsLostSection category={campaign.tag} businessName={campaign.name} />
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
              {campaign?.rewardTiers.map((tier, i) => {
                const isSelected = donationAmount >= tier.amount;
                const isCurrentReward = getSelectedReward()?.amount === tier.amount;

                return (
                  <div
                    key={i}
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

            {/* TODO */}
            <SubmitButton className="bg-[#ffa500]" loading={null} onClick={handleDonateClick}>
              Donate {formatCurrency(donationAmount)}
            </SubmitButton>


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
