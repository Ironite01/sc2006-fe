import { useState } from 'react';
import './CampaignForm.css';
import SubmitButton from '../../../components/SubmitButton';

export default function CampaignForm() {
    const [formData, setFormData] = useState({
        campaignName: '',
        description: '',
        goal: '',
        endDate: '',
        rewards: [{ donationAmount: '', correspondingReward: '' }]
    });

    const [errors, setErrors] = useState({});
    const [images, setImages] = useState([]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Handle form submission logic here
            console.log('Form submitted:', formData);
            alert('Campaign created successfully! Redirecting to home page...');
        }
    };

    return (
        <div className="campaign-form-container">
            <h1 className="form-title">Create Your Campaign</h1>

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
                                <input
                                    type="number"
                                    placeholder="Donation Amount"
                                    value={reward.donationAmount}
                                    onChange={(e) => handleRewardChange(index, 'donationAmount', e.target.value)}
                                    className="form-input reward-input"
                                    step="0.01"
                                    min="0"
                                />
                                <input
                                    type="text"
                                    placeholder="Corresponding Reward"
                                    value={reward.correspondingReward}
                                    onChange={(e) => handleRewardChange(index, 'correspondingReward', e.target.value)}
                                    className="form-input reward-input"
                                />
                                {formData.rewards.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeReward(index)}
                                        className="remove-reward-btn"
                                    >
                                        -
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={addReward}
                                    className="add-reward-btn"
                                >
                                    +
                                </button>
                            </div>
                            {errors[`reward_${index}`] && (
                                <div className="error-message">{errors[`reward_${index}`]}</div>
                            )}
                        </div>
                    ))}

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

                {/* Submit Button */}
                <div className="form-actions">
                    <SubmitButton type="submit" className="create-btn bg-[#218838]" loading={null}>
                        Create
                    </SubmitButton>
                    <div className="submit-info">
                        Disabled by default. If all validation is successful, the button is enabled, and will proceed with the create campaign flow. The user is then re-directed to the home page.
                    </div>
                </div>
            </form>
        </div>
    );
}
