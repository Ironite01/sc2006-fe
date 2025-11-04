import './CampaignManager.css';
import { useNavigate } from "react-router-dom";

export default function CampaignManager({ onCreateCampaign, campaigns }) {
    const navigate = useNavigate();

    const handleCreateCampaign = () => {
        navigate('/campaign/create');
        if (onCreateCampaign) {
            onCreateCampaign();
        }
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
            </div>

            {/* My Campaign Section */}
            {campaigns?.length > 0 && (
                <div className="my-campaign-section">
                    <h2 className="my-campaign-title">My Campaigns</h2>

                    {campaigns.map((c) => {
                        const progress = parseInt((c.amtRaised / c.goal) * 100);
                        return (
                            <div key={c.id}>
                                <div className="campaign-actions">
                                    <span
                                        className="action-link"
                                        onClick={() => navigate(`${c.id}/edit`)}
                                    >
                                        Edit Campaign Details
                                    </span>
                                    <span className="separator">|</span>
                                    <span
                                        className="action-link"
                                        onClick={() => navigate(`${c.id}/rewards`)}
                                    >
                                        Manage Rewards
                                    </span>
                                </div>
                                <div className="campaign-display" key={c.id}>
                                    <div className="campaign-image">
                                        <div className="campaign-placeholder-small">
                                            <div className="placeholder-content">
                                                <img src={c.image} alt={c.name} className="campaign-img" />
                                            </div>
                                            <div className="campaign-label">{c.name}</div>
                                        </div>
                                    </div>

                                    <div className="campaign-progress">
                                        <h3 className="progress-title">Progress</h3>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill-active"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div>
                                            <span className="raised-amount">${c.amtRaised} raised </span>
                                            <span className="goal-amount">
                                                of ${c.goal} Goal ({progress}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="line"></div>
                                <br />
                            </div>)
                    })}
                </div>
            )}
        </div>
    );
}
