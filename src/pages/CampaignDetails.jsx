import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CampaignDetails.css';
import './carousel-styles.css';
import { campaign as campaignApi } from '../paths';
import ShopsLostSection from '../components/ShopsLostSection';
import { useNavigate } from "react-router-dom";
import UpdateComments from './updates/UpdateComments';
import Cookies from 'js-cookie';

// Story Images Carousel Component
function StoryCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="story-carousel">
      <div className="carousel-main">
        <button className="carousel-btn prev" onClick={prevImage} aria-label="Previous image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="carousel-image-container">
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].caption || `Story image ${currentIndex + 1}`}
            className="carousel-image"
          />
          {images[currentIndex].caption && (
            <div className="carousel-caption">{images[currentIndex].caption}</div>
          )}
        </div>

        <button className="carousel-btn next" onClick={nextImage} aria-label="Next image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToImage(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      <div className="carousel-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}


export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState(25);
  const [commentText, setCommentText] = useState('');
  const [updates, setUpdates] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [commentsModal, setCommentsModal] = useState({ isOpen: false, updateId: null });
  const [currentUser, setCurrentUser] = useState(null);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [storyTab, setStoryTab] = useState('story'); // 'story' or 'photos'
  const navigate = useNavigate();

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
    let alive = true;

    async function loadCampaign() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(campaignApi.one(id), {
          credentials: 'include'
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch campaign');
        }

        const data = await res.json();

        if (alive) {
          // Map backend data to frontend expected structure
          const mappedCampaign = {
            id: data.campaignId,
            campaignId: data.campaignId,
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl || '/placeholder-shop.jpg',
            tag: data.tag || 'Local Business',
            fundingGoal: data.goal,
            currentFunding: data.amtRaised || 0,
            progress: data.progress || 0,
            rentDue: data.endDate,
            endDate: data.endDate,
            status: data.status,
            supporters: data.backerCount || 0,
            daysLeft: Math.max(0, Math.ceil((new Date(data.endDate) - new Date()) / (1000 * 60 * 60 * 24))),
            story: data.story || data.description || 'Campaign story coming soon...',
            storyImages: data.storyImages || [],
            updates: data.updates || [],
            owners: data.owners || [],
            comments: data.comments || [],
            rewardTiers: data.rewardTiers || [
              { amount: 25, title: 'Supporter', description: 'Thank you for your support!', backers: 0 },
              { amount: 50, title: 'Bronze Supporter', description: 'Get a thank you card', backers: 0 },
              { amount: 100, title: 'Silver Supporter', description: 'Get a special mention', backers: 0 }
            ]
          };

          setCampaign(mappedCampaign);
        }
      } catch (err) {
        if (alive) {
          console.error('Error loading campaign:', err);
          setError(err.message || 'Failed to load campaign');
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadCampaign();

    return () => {
      alive = false;
    };
  }, [id]);

  // Load current user
  useEffect(() => {
    const userDataCookie = Cookies.get('userData');
    if (userDataCookie) {
      try {
        const userData = JSON.parse(userDataCookie);
        setCurrentUser(userData);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  // Load campaign updates
  useEffect(() => {
    let alive = true;

    async function loadUpdates() {
      setLoadingUpdates(true);
      try {
        const res = await fetch(`http://localhost:3000/campaigns/${id}/updates`, {
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Failed to fetch updates');
        }

        const data = await res.json();

        if (alive) {
          setUpdates(data.updates || []);
        }
      } catch (err) {
        console.error('Error loading updates:', err);
        if (alive) {
          setUpdates([]);
        }
      } finally {
        if (alive) {
          setLoadingUpdates(false);
        }
      }
    }

    if (id) {
      loadUpdates();
    }

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return <div className="loading">Loading campaign details...</div>;
  }

  if (error || !campaign) {
    return (
      <div className="loading">
        <h2>Campaign Not Found</h2>
        <p>{error || 'This campaign is coming soon! Check back later.'}</p>
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

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return formatDate(dateString);
  };

  const handleLikeUpdate = async (updateId) => {
    if (!currentUser) {
      alert('Please log in to like updates');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/updates/${updateId}/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUser.userId })
      });

      if (res.ok) {
        // Refresh updates to get new like count
        const updatesRes = await fetch(`http://localhost:3000/campaigns/${id}/updates`, {
          credentials: 'include'
        });
        const data = await updatesRes.json();
        setUpdates(data.updates || []);
      }
    } catch (err) {
      console.error('Error liking update:', err);
    }
  };

  const handleOpenComments = (updateId) => {
    setCommentsModal({ isOpen: true, updateId });
  };

  const handleCloseComments = () => {
    setCommentsModal({ isOpen: false, updateId: null });
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

            {/* Tab Navigation */}
            <div className="story-tabs">
              <button
                className={`story-tab ${storyTab === 'story' ? 'active' : ''}`}
                onClick={() => setStoryTab('story')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Story
              </button>
              <button
                className={`story-tab ${storyTab === 'photos' ? 'active' : ''}`}
                onClick={() => setStoryTab('photos')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Photos ({campaign.storyImages?.length || 0})
              </button>
            </div>

            {/* Tab Content */}
            <div className="story-tab-content">
              {storyTab === 'story' ? (
                <div className="story-content">
                  {(() => {
                    const paragraphs = campaign.story.split('\n\n');
                    const displayParagraphs = isStoryExpanded ? paragraphs : paragraphs.slice(0, 2);

                    return (
                      <>
                        <div className={`story-text ${!isStoryExpanded ? 'story-collapsed' : ''}`}>
                          {displayParagraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>

                        {paragraphs.length > 2 && (
                          <button
                            className="expand-story-btn"
                            onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                          >
                            {isStoryExpanded ? (
                              <>
                                <span>Read Less</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M18 15l-6-6-6 6" />
                                </svg>
                              </>
                            ) : (
                              <>
                                <span>Read More</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M6 9l6 6 6-6" />
                                </svg>
                              </>
                            )}
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="photos-content">
                  {campaign.storyImages && campaign.storyImages.length > 0 ? (
                    <StoryCarousel images={campaign.storyImages} />
                  ) : (
                    <div className="no-photos">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <p>No photos available yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Updates */}
          <section className="updates-section">
            <h2>Updates</h2>
            {loadingUpdates ? (
              <p className="loading-text">Loading updates...</p>
            ) : updates.length === 0 ? (
              <p className="no-updates">No updates yet. Check back later!</p>
            ) : (
              <div className="updates-list">
                {updates.map(update => (
                  <div key={update.updateId} className="update-card">
                    <div className="update-header">
                      <div>
                        <h3>{update.title}</h3>
                        <span className="update-date">{formatTimeAgo(update.postedAt)}</span>
                      </div>
                      {update.status === 'SCHEDULED' && (
                        <span className="scheduled-badge">Scheduled</span>
                      )}
                    </div>

                    <p className="update-description">{update.description}</p>

                    {update.imageUrl && (
                      <img
                        src={update.imageUrl}
                        alt={update.title}
                        className="update-image"
                      />
                    )}

                    {update.tags && (
                      <div className="update-tags">
                        {update.tags.split(',').map((tag, idx) => (
                          <span key={idx} className="update-tag">{tag.trim()}</span>
                        ))}
                      </div>
                    )}

                    <div className="update-actions">
                      <button
                        className="action-btn like-btn"
                        onClick={() => handleLikeUpdate(update.updateId)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span>{update.likeCount || 0}</span>
                      </button>

                      <button
                        className="action-btn comment-btn"
                        onClick={() => handleOpenComments(update.updateId)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>{update.commentCount || 0}</span>
                      </button>

                      <button className="action-btn view-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>{update.viewCount || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Shops We've Lost */}
          <ShopsLostSection category={campaign.tag} businessName={campaign.name} />

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

            <button className="donate-btn" onClick={handleDonateClick}>
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

      {/* Comments Modal */}
      {commentsModal.isOpen && (
        <UpdateComments
          updateId={commentsModal.updateId}
          onClose={handleCloseComments}
        />
      )}
    </div>
  );
}
