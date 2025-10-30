import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CampaignForm.css';
import ManageCampaignUpdates from './ManageCampaignUpdates';

export default function CampaignForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const campaignId = searchParams.get('id');
    const isEditMode = !!campaignId;

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [formData, setFormData] = useState({
        campaignName: '',
        description: '',
        goal: '',
        endDate: '',
        rewards: [{ donationAmount: '', correspondingReward: '' }]
    });

    const [errors, setErrors] = useState({});
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            loadCampaignData();
        }
    }, [campaignId]);

    async function loadCampaignData() {
        try {
            setLoading(true);

            // Load campaign data
            const campaignResponse = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
                credentials: 'include'
            });

            if (!campaignResponse.ok) {
                throw new Error('Failed to load campaign');
            }

            const campaign = await campaignResponse.json();

            // Load rewards for this campaign
            const rewardsResponse = await fetch(`http://localhost:3000/rewards?campaignId=${campaignId}`, {
                credentials: 'include'
            });

            let rewards = [{ donationAmount: '', correspondingReward: '' }];
            if (rewardsResponse.ok) {
                const rewardsData = await rewardsResponse.json();
                if (rewardsData && rewardsData.length > 0) {
                    rewards = rewardsData.map(reward => ({
                        donationAmount: reward.donationAmount || '',
                        correspondingReward: reward.rewardName || ''
                    }));
                }
            }

            setFormData({
                campaignName: campaign.name || '',
                description: campaign.description || '',
                goal: campaign.goal || '',
                endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
                rewards: rewards
            });

            setLoading(false);
        } catch (err) {
            console.error('Error loading campaign:', err);
            alert('Failed to load campaign data');
            setLoading(false);
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleRewardChange = (index, field, value) => {
        const newRewards = [...formData.rewards];
        newRewards[index][field] = value;
        setFormData(prev => ({
            ...prev,
            rewards: newRewards
        }));
    };

    const addReward = () => {
        setFormData(prev => ({
            ...prev,
            rewards: [...prev.rewards, { donationAmount: '', correspondingReward: '' }]
        }));
    };

    const removeReward = (index) => {
        if (formData.rewards.length > 1) {
            const newRewards = formData.rewards.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                rewards: newRewards
            }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length <= 5) {
            setImages(prev => [...prev, ...files]);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.campaignName.trim()) {
            newErrors.campaignName = 'Some error relating to Campaign Name';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Some error relating to Description and Justification';
        }

        if (!formData.goal || parseFloat(formData.goal) <= 0) {
            newErrors.goal = 'Some error relating to Goal';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'Some error relating to end date of campaign';
        }

        formData.rewards.forEach((reward, index) => {
            if (!reward.donationAmount || !reward.correspondingReward) {
                newErrors[`reward_${index}`] = 'Some error relating to rewards for donation';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Get user data from cookies
            const userDataCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('userData='));

            if (!userDataCookie) {
                alert('Please log in to create/edit campaigns');
                navigate('/login');
                return;
            }

            const userData = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1]));
            const userId = userData.userId;

            const campaignData = {
                name: formData.campaignName,
                description: formData.description,
                goal: parseFloat(formData.goal),
                endDate: formData.endDate,
                imageUrl: images.length > 0 ? URL.createObjectURL(images[0]) : '',
                status: 'draft',
                userId: userId
            };

            let response;
            if (isEditMode) {
                // Update existing campaign
                response = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(campaignData)
                });
            } else {
                // Create new campaign
                response = await fetch('http://localhost:3000/campaigns', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(campaignData)
                });
            }

            if (!response.ok) {
                throw new Error('Failed to save campaign');
            }

            const result = await response.json();
            const savedCampaignId = result.campaignId || result.id || campaignId;

            // Save rewards
            await saveRewards(savedCampaignId);

            alert(isEditMode ? 'Campaign updated successfully!' : 'Campaign created successfully!');
            navigate('/campaign');
        } catch (error) {
            console.error('Error saving campaign:', error);
            alert('Failed to save campaign: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const saveRewards = async (campaignId) => {
        try {
            // In edit mode, first delete existing rewards
            if (isEditMode) {
                const existingRewardsRes = await fetch(`http://localhost:3000/rewards?campaignId=${campaignId}`, {
                    credentials: 'include'
                });

                if (existingRewardsRes.ok) {
                    const existingRewards = await existingRewardsRes.json();
                    // Delete each existing reward
                    await Promise.all(
                        existingRewards.map(reward =>
                            fetch(`http://localhost:3000/rewards/${reward.rewardId}`, {
                                method: 'DELETE',
                                credentials: 'include'
                            })
                        )
                    );
                }
            }

            // Create new rewards
            const rewardPromises = formData.rewards
                .filter(reward => reward.donationAmount && reward.correspondingReward)
                .map(reward =>
                    fetch('http://localhost:3000/rewards', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            campaignId: campaignId,
                            rewardName: reward.correspondingReward,
                            donationAmount: parseFloat(reward.donationAmount)
                        })
                    })
                );

            await Promise.all(rewardPromises);
        } catch (error) {
            console.error('Error saving rewards:', error);
            throw new Error('Failed to save rewards: ' + error.message);
        }
    };

    const handleSubmitForReview = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // First save the campaign
            const userDataCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('userData='));

            if (!userDataCookie) {
                alert('Please log in to create/edit campaigns');
                navigate('/login');
                return;
            }

            const userData = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1]));
            const userId = userData.userId;

            const campaignData = {
                name: formData.campaignName,
                description: formData.description,
                goal: parseFloat(formData.goal),
                endDate: formData.endDate,
                imageUrl: images.length > 0 ? URL.createObjectURL(images[0]) : '',
                status: 'draft',
                userId: userId
            };

            let response;
            let savedCampaignId = campaignId;

            if (isEditMode) {
                response = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(campaignData)
                });
            } else {
                response = await fetch('http://localhost:3000/campaigns', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(campaignData)
                });

                if (response.ok) {
                    const result = await response.json();
                    savedCampaignId = result.campaignId || result.id;
                }
            }

            if (!response.ok) {
                throw new Error('Failed to save campaign');
            }

            // Save rewards
            await saveRewards(savedCampaignId);

            // Navigate to review submission page
            navigate(`/campaign/review?campaignId=${savedCampaignId}`);
        } catch (error) {
            console.error('Error saving campaign:', error);
            alert('Failed to save campaign: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="campaign-form-container">
                <div className="loading-state">Loading campaign data...</div>
            </div>
        );
    }

    return (
        <div className="campaign-form-container">
            <h1 className="form-title">{isEditMode ? 'Edit Your Campaign' : 'Create Your Campaign'}</h1>

            {/* Tab Navigation - Only show in edit mode */}
            {isEditMode && (
                <div className="campaign-tabs">
                    <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                    >
                        Campaign Details
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('updates')}
                        className={`tab-button ${activeTab === 'updates' ? 'active' : ''}`}
                    >
                        Manage Updates
                    </button>
                </div>
            )}

            {/* Campaign Details Tab */}
            {activeTab === 'details' && (
            <form onSubmit={handleSubmit} className="campaign-form">
                {/* Campaign Name Field */}
                <div className="form-group">
                    <label htmlFor="campaignName" className="form-label">
                        Name of Campaign*
                    </label>
                    <input
                        type="text"
                        id="campaignName"
                        value={formData.campaignName}
                        onChange={(e) => handleInputChange('campaignName', e.target.value)}
                        className={`form-input ${errors.campaignName ? 'error' : ''}`}
                        placeholder="Enter campaign name"
                    />
                    <div className="field-info">
                        A text field for the 'Name of Campaign'. It validates if the name of campaign is empty.
                    </div>
                    {errors.campaignName && (
                        <div className="error-message">{errors.campaignName}</div>
                    )}
                </div>

                {/* Description Field */}
                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description of Campaign and Funding Justification*
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className={`form-textarea ${errors.description ? 'error' : ''}`}
                        placeholder="Describe your campaign and justify funding needs"
                        rows="4"
                    />
                    <div className="char-count">
                        ({formData.description.length} / 2000 chars)
                    </div>
                    <div className="field-info">
                        A text area field for the 'Description of Campaign and Funding Justification'. Limiting justification validation checks if it will reject any inputs after 2000 characters.
                    </div>
                    {errors.description && (
                        <div className="error-message">{errors.description}</div>
                    )}
                </div>

                {/* Goal Field */}
                <div className="form-group">
                    <label htmlFor="goal" className="form-label">
                        Goal (SGD)*
                    </label>
                    <div className="currency-input">
                        <span className="currency-symbol">$</span>
                        <input
                            type="number"
                            id="goal"
                            value={formData.goal}
                            onChange={(e) => handleInputChange('goal', e.target.value)}
                            className={`form-input currency ${errors.goal ? 'error' : ''}`}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div className="field-info">
                        A text field for the 'Goal (SGD)'. It validates if it is a valid amount in SGD (with 2 decimal points).
                    </div>
                    {errors.goal && (
                        <div className="error-message">{errors.goal}</div>
                    )}
                </div>

                {/* End Date Field */}
                <div className="form-group">
                    <label htmlFor="endDate" className="form-label">
                        End date of campaign*
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className={`form-input ${errors.endDate ? 'error' : ''}`}
                    />
                    <div className="field-info">
                        Date field (input either by text or from date picker) for 'End date of campaign'. Validation checks if the date is valid (non-empty).
                    </div>
                    {errors.endDate && (
                        <div className="error-message">{errors.endDate}</div>
                    )}
                </div>

                {/* Rewards Section */}
                <div className="form-group">
                    <label className="form-label">
                        Reward(s)*
                    </label>
                    <div className="field-info">
                        A text field for the 'Corresponding Reward' with respect to the 'Donation Amount'. It validates if the name of campaign is empty.
                    </div>

                    {formData.rewards.map((reward, index) => (
                        <div key={index} className="reward-row">
                            <div className="reward-inputs">
                                <div className="reward-input-group">
                                    <label className="reward-input-label">Donation Amount (SGD)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 50"
                                        value={reward.donationAmount}
                                        onChange={(e) => handleRewardChange(index, 'donationAmount', e.target.value)}
                                        className="form-input reward-input"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div className="reward-input-group">
                                    <label className="reward-input-label">Corresponding Reward</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Thank you card + sticker pack"
                                        value={reward.correspondingReward}
                                        onChange={(e) => handleRewardChange(index, 'correspondingReward', e.target.value)}
                                        className="form-input reward-input"
                                    />
                                </div>
                                {formData.rewards.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeReward(index)}
                                        className="remove-reward-btn"
                                        title="Remove this reward tier"
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                            {errors[`reward_${index}`] && (
                                <div className="error-message">{errors[`reward_${index}`]}</div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addReward}
                        className="add-reward-btn-main"
                    >
                        + Add Another Reward Tier
                    </button>

                    <div className="reward-info">
                        Generate a new reward tier (i.e. create new 'Donation Amount' and 'Corresponding Reward').
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="form-group">
                    <div className="image-upload-section">
                        <div className="upload-area">
                            <div className="upload-icon">📁</div>
                            <div className="upload-text">Add up to 5 images</div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="file-input"
                                id="imageUpload"
                            />
                            <label htmlFor="imageUpload" className="upload-label">
                                Choose Files
                            </label>
                        </div>
                        
                        {images.length > 0 && (
                            <div className="uploaded-images">
                                {images.map((image, index) => (
                                    <div key={index} className="image-preview">
                                        <img 
                                            src={URL.createObjectURL(image)} 
                                            alt={`Preview ${index + 1}`}
                                            className="preview-image"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="remove-image-btn"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="upload-info">
                            Add picture button that allows user to upload up to 5 images in total. It can be accumulated by uploading one by one, or uploading multiple images at a time.
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="form-actions">
                    <button
                        type="submit"
                        className="save-draft-btn"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save as Draft')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmitForReview}
                        className="submit-review-btn"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Submit for Review'}
                    </button>
                    <div className="submit-info">
                        {isEditMode
                            ? 'Save your changes as a draft or submit for review'
                            : 'Save as draft to continue editing later, or submit for review to request approval'}
                    </div>
                </div>
            </form>
            )}

            {/* Manage Updates Tab */}
            {activeTab === 'updates' && isEditMode && (
                <ManageCampaignUpdates campaignId={campaignId} />
            )}
        </div>
    );
}
