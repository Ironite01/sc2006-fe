import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import './ReviewSubmission.css';

export default function ReviewSubmission() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [campaign, setCampaign] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        loadCampaignData();
    }, [id]);

    async function loadCampaignData() {
        try {
            setLoading(true);

            // Get campaign ID from params or query string
            const campaignId = id || searchParams.get('campaignId');

            if (!campaignId) {
                throw new Error('Campaign ID is required');
            }

            // Load campaign data
            const campaignRes = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
                credentials: 'include'
            });

            if (!campaignRes.ok) {
                throw new Error('Failed to load campaign');
            }

            const campaignData = await campaignRes.json();
            setCampaign(campaignData);

            // Load rewards
            const rewardsRes = await fetch(`http://localhost:3000/rewards?campaignId=${campaignId}`, {
                credentials: 'include'
            });

            if (rewardsRes.ok) {
                const rewardsData = await rewardsRes.json();
                setRewards(rewardsData);
            }

            // Validate campaign
            const errors = validateCampaign(campaignData, rewardsData || []);
            setValidationErrors(errors);

            setLoading(false);
        } catch (err) {
            console.error('Error loading campaign:', err);
            setError(err.message);
            setLoading(false);
        }
    }

    function validateCampaign(campaignData, rewardsData) {
        const errors = [];

        if (!campaignData.name || campaignData.name.trim() === '') {
            errors.push('Campaign name is required');
        }

        if (!campaignData.description || campaignData.description.trim() === '') {
            errors.push('Campaign description is required');
        }

        if (!campaignData.goal || parseFloat(campaignData.goal) <= 0) {
            errors.push('Campaign goal must be greater than 0');
        }

        if (!campaignData.endDate) {
            errors.push('Campaign end date is required');
        } else {
            const endDate = new Date(campaignData.endDate);
            const today = new Date();
            if (endDate <= today) {
                errors.push('Campaign end date must be in the future');
            }
        }

        if (!campaignData.imageUrl || campaignData.imageUrl.trim() === '') {
            errors.push('Campaign image is required');
        }

        if (!rewardsData || rewardsData.length === 0) {
            errors.push('At least one reward tier must be configured');
        }

        return errors;
    }

    async function handleSubmitForApproval() {
        if (validationErrors.length > 0) {
            alert('Please fix all validation errors before submitting');
            return;
        }

        if (!confirm('Are you sure you want to submit this campaign for approval?')) {
            return;
        }

        try {
            setSubmitting(true);

            // Update campaign status to pending
            const response = await fetch(`http://localhost:3000/campaigns/${campaign.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...campaign,
                    status: 'pending'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit campaign');
            }

            alert('Campaign submitted for approval successfully!');
            navigate('/campaign');
        } catch (err) {
            console.error('Error submitting campaign:', err);
            alert('Failed to submit campaign: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    }

    function formatCurrency(amount) {
        return `$${parseFloat(amount).toFixed(2)}`;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-SG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    if (loading) {
        return (
            <div className="review-submission">
                <div className="loading">Loading campaign details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="review-submission">
                <div className="error-state">
                    <h2>Error Loading Campaign</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/campaign')} className="action-btn">
                        Back to My Campaigns
                    </button>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="review-submission">
                <div className="error-state">
                    <h2>Campaign Not Found</h2>
                    <button onClick={() => navigate('/campaign')} className="action-btn">
                        Back to My Campaigns
                    </button>
                </div>
            </div>
        );
    }

    const isValid = validationErrors.length === 0;

    return (
        <div className="review-submission">
            <div className="review-header">
                <h1>Review Campaign Submission</h1>
                <p>Please review your campaign details before submitting for approval</p>
            </div>

            {/* Validation Status */}
            {validationErrors.length > 0 && (
                <div className="validation-section">
                    <div className="validation-header error">
                        <span className="validation-icon">⚠️</span>
                        <h2>Validation Errors</h2>
                    </div>
                    <ul className="validation-list">
                        {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                    <p className="validation-note">Please fix these errors before submitting</p>
                </div>
            )}

            {validationErrors.length === 0 && (
                <div className="validation-section">
                    <div className="validation-header success">
                        <span className="validation-icon">✅</span>
                        <h2>Campaign Ready for Submission</h2>
                    </div>
                    <p className="validation-note">All required fields are complete</p>
                </div>
            )}

            {/* Campaign Summary */}
            <div className="summary-section">
                <h2>Campaign Summary</h2>
                <div className="summary-grid">
                    {/* Campaign Image */}
                    <div className="summary-card full-width">
                        <h3>Campaign Image</h3>
                        <div className="campaign-image-preview">
                            {campaign.imageUrl ? (
                                <img src={campaign.imageUrl} alt={campaign.name} />
                            ) : (
                                <div className="no-image">No image uploaded</div>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="summary-card">
                        <h3>Basic Information</h3>
                        <div className="info-row">
                            <span className="label">Campaign Name:</span>
                            <span className="value">{campaign.name || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Description:</span>
                            <span className="value">{campaign.description || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Status:</span>
                            <span className={`value status-${campaign.status}`}>
                                {campaign.status || 'draft'}
                            </span>
                        </div>
                    </div>

                    {/* Funding Details */}
                    <div className="summary-card">
                        <h3>Funding Details</h3>
                        <div className="info-row">
                            <span className="label">Funding Goal:</span>
                            <span className="value">{formatCurrency(campaign.goal || 0)}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Current Amount:</span>
                            <span className="value">{formatCurrency(campaign.amtRaised || 0)}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">End Date:</span>
                            <span className="value">
                                {campaign.endDate ? formatDate(campaign.endDate) : 'Not set'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reward Tiers */}
            <div className="rewards-section">
                <div className="section-header">
                    <h2>Reward Tiers ({rewards.length})</h2>
                    <button
                        onClick={() => navigate(`/campaign/rewards?campaignId=${campaign.id}`)}
                        className="btn-link"
                    >
                        Configure Rewards →
                    </button>
                </div>

                {rewards.length > 0 ? (
                    <div className="rewards-grid">
                        {rewards.map((reward, index) => (
                            <div key={index} className="reward-card">
                                <div className="reward-header">
                                    <h3>{reward.rewardName}</h3>
                                    <div className="reward-amount">{formatCurrency(reward.donationAmount)}</div>
                                </div>
                                <p className="reward-description">{reward.description}</p>
                                <div className="reward-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Available:</span>
                                        <span className="detail-value">{reward.quantityAvailable}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Delivery:</span>
                                        <span className="detail-value">
                                            {reward.estimatedDelivery ? formatDate(reward.estimatedDelivery) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-rewards">
                        <p>No reward tiers configured yet</p>
                        <button
                            onClick={() => navigate(`/campaign/rewards?campaignId=${campaign.id}`)}
                            className="btn-secondary"
                        >
                            Add Reward Tiers
                        </button>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="review-actions">
                <button
                    onClick={() => navigate(`/campaign/edit?id=${campaign.id}`)}
                    className="btn-secondary"
                >
                    ← Back to Edit
                </button>

                {!isValid && (
                    <button
                        onClick={() => navigate(`/campaign/rewards?campaignId=${campaign.id}`)}
                        className="btn-secondary"
                    >
                        Configure Rewards
                    </button>
                )}

                <button
                    onClick={handleSubmitForApproval}
                    disabled={!isValid || submitting}
                    className="btn-primary"
                >
                    {submitting ? 'Submitting...' : 'Submit for Approval'}
                </button>
            </div>

            {!isValid && (
                <div className="help-text">
                    Please fix all validation errors and configure at least one reward tier before submitting
                </div>
            )}
        </div>
    );
}
