import { useState } from 'react';
import './CampaignManager.css';

export default function CampaignManager({ onCreateCampaign }) {
    const [campaignCreated, setCampaignCreated] = useState(true);

    const handleCreateCampaign = () => {
        if (onCreateCampaign) {
            onCreateCampaign();
        }
    };

    const handleEditCampaign = () => {
        // Logic to edit campaign details would go here
        console.log('Edit campaign clicked');
    };

    const handleManageRewards = () => {
        // Logic to manage rewards would go here
        console.log('Manage rewards clicked');
    };

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

                <div className="create-help-text">
                    Click this button to start creating the campaign. As a business 
                    representative you will need to fill in various details to create a campaign.
                </div>
            </div>

            {/* My Campaign Section */}
            {campaignCreated && (
                <div className="my-campaign-section">
                    <h2 className="my-campaign-title">My Campaign</h2>
                    <div className="campaign-actions">
                        <span 
                            className="action-link"
                            onClick={handleEditCampaign}
                        >
                            Edit Campaign Details
                        </span>
                        <span className="separator">|</span>
                        <span 
                            className="action-link"
                            onClick={handleManageRewards}
                        >
                            Manage Rewards
                        </span>
                    </div>

                    <div className="campaign-display">
                        <div className="campaign-image">
                            <div className="campaign-placeholder-small">
                                <div className="placeholder-content">
                                    <div className="placeholder-lines">
                                        <div className="line"></div>
                                        <div className="line"></div>
                                        <div className="line short"></div>
                                    </div>
                                </div>
                                <div className="campaign-label">Campaign</div>
                            </div>
                        </div>

                        <div className="campaign-progress">
                            <h3 className="progress-title">Progress</h3>
                            <div className="progress-bar">
                                <div className="progress-fill-active" style={{width: '40%'}}></div>
                            </div>
                            <div className="progress-text">
                                <span className="raised-amount">$2000 raised</span>
                                <span className="goal-amount">of $5000 Goal (40%)</span>
                            </div>
                        </div>
                    </div>

                    <div className="campaign-help-text">
                        <div className="help-left">
                            Click this button to be redirected to the page where the business 
                            representative can edit the campaign details.
                        </div>
                        <div className="help-right">
                            Click this button to be redirected to the page where the business 
                            representative can manage rewards.
                        </div>
                        <div className="help-bottom">
                            Current campaign and the amount of donations it has received over 
                            the total goal.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
