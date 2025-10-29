import { useState, useEffect } from 'react';
import './CampaignManager.css';
import { Link, useNavigate } from "react-router-dom";

export default function CampaignManager({ onCreateCampaign }) {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadUserCampaigns();
    }, []);

    async function loadUserCampaigns() {
        try {
            setLoading(true);

            // Get user data from cookies
            const userDataCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('userData='));

            if (!userDataCookie) {
                setError('Please log in to view your campaigns');
                setLoading(false);
                return;
            }

            const userData = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1]));
            const userId = userData.userId;

            // Fetch user's campaigns
            const response = await fetch(`http://localhost:3000/campaigns?userId=${userId}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to load campaigns');
            }

            const campaignsData = await response.json();
            setCampaigns(campaignsData);
            setLoading(false);
        } catch (err) {
            console.error('Error loading campaigns:', err);
            setError(err.message);
            setLoading(false);
        }
    } 

    const handleCreateCampaign = () => {
        navigate('/campaign/create'); 
        if (onCreateCampaign) {
            onCreateCampaign();
        }
    };

    const handleEditCampaign = (campaignId) => {
        navigate(`/campaign/edit?id=${campaignId}`);
    };

    const handleManageRewards = (campaignId) => {
        navigate(`/campaign/rewards?campaignId=${campaignId}`);
    };

    const handleViewAnalytics = (campaignId) => {
        navigate(`/campaign/${campaignId}/analytics`);
    };

    function formatCurrency(amount) {
        return `$${parseFloat(amount || 0).toFixed(2)}`;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-SG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function getDaysRemaining(endDate) {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    }

    function getStatusBadgeClass(status) {
        switch (status?.toLowerCase()) {
            case 'approved': return 'status-approved';
            case 'pending': return 'status-pending';
            case 'rejected': return 'status-rejected';
            default: return 'status-draft';
        }
    }

    if (loading) {
        return (
            <div className="campaign-manager-content">
                <div className="loading-state">Loading your campaigns...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="campaign-manager-content">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={() => navigate('/login')} className="login-btn">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="campaign-manager-content">
            {/* Create Your Campaign Section */}
            <div className="create-section">
                <h1 className="section-title">Create Your Campaign</h1>
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
                        onClick={handleCreateCampaign}
                    >
                        Create your campaign
                    </button>
                </div>

                {/* <div className="create-help-text">
                    Click this button to start creating the campaign. As a business 
                    representative you will need to fill in various details to create a campaign.
                </div> */}
            </div>

            {/* My Campaigns Section */}
            {campaigns.length > 0 ? (
                <div className="my-campaigns-section">
                    <h2 className="my-campaigns-title">My Campaigns ({campaigns.length})</h2>

                    <div className="campaigns-list">
                        {campaigns.map((campaign) => {
                            const progress = (parseFloat(campaign.amtRaised || 0) / parseFloat(campaign.goal || 1)) * 100;
                            const daysLeft = getDaysRemaining(campaign.endDate);

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
                                                onClick={() => handleViewAnalytics(campaign.id)}
                                            >
                                                View Analytics
                                            </button>
                                            <button
                                                className="action-btn btn-edit"
                                                onClick={() => handleEditCampaign(campaign.id)}
                                            >
                                                Edit Campaign
                                            </button>
                                            <button
                                                className="action-btn btn-rewards"
                                                onClick={() => handleManageRewards(campaign.id)}
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
    );
}
