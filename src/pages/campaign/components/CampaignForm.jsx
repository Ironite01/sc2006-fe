import { useEffect, useState } from 'react';
import './CampaignForm.css';
import SubmitButton from '../../../components/SubmitButton';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import getUser from '../../../helpers/getUser';
import { USER_ROLES } from '../../../helpers/constants';
import { campaigns, shop } from '../../../../paths';

export default function CampaignForm() {
    const navigate = useNavigate();
    const params = useParams();
    const [deletedRewardIds, setDeletedRewardIds] = useState([]);

    useEffect(() => {
        authorize();
    }, []);

    async function authorize() {
        const user = await getUser();
        if (!user || user?.role !== USER_ROLES.BUSINESS_REPRESENTATIVE) {
            toast.error("This page is only for business representative!");
            navigate("/");
        }

        try {
            const res = await fetch(shop.me, {
                method: "GET",
                credentials: "include",
            });

            if (res.status === 404) {
                toast.error("Please register your shop before creating a campaign.");
                navigate("/shop/create");
                return;
            }
            // if res.ok, they have a shop – continue
        } catch (e) {
            console.error("Failed to check shop:", e);
        }
    }

    useEffect(() => {
        if (params?.campaignId) {
            getCampaign();
        }
    }, [params]);

    async function getCampaign() {
        const res = await fetch(campaigns.getById(params.campaignId), {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            toast.error("Something went wrong fetching campaigns!");
            return;
        }

        const data = await res.json();
        setFormData({
            campaignName: data.name,
            description: data?.description || "",
            goal: data.goal,
            endDate: new Date(data.endDate).toISOString().split('T')[0],
            rewards: data?.rewardTiers?.length ? data.rewardTiers : [{ amount: '', title: '', description: '' }],
            story: data?.story || ""
        });
        setImage(data.image);
    }

    const [formData, setFormData] = useState({
        campaignName: '',
        description: '',
        goal: '',
        endDate: '',
        story: '',
        rewards: [{ amount: '', title: '', description: '' }]
    });

    const [image, setImage] = useState();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
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
            rewards: [...prev.rewards, { amount: '', title: '', description: '' }]
        }));
    };

    const removeReward = (index) => {
        if (formData.rewards.length > 1) {
            const newRewards = formData.rewards.filter((_, i) => i !== index);

            if (formData.rewards[index]?.rewardId) setDeletedRewardIds([...deletedRewardIds, formData.rewards[index].rewardId]);
            setFormData(prev => ({
                ...prev,
                rewards: newRewards
            }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImage(files[0]);
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
            if (!reward.amount || !reward.title) {
                newErrors[`reward_${index}`] = 'Some error relating to rewards for donation';
            }
        });

        Object.values(newErrors).map((v) => toast.error(v))

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        let res;
        if (params?.campaignId) {
            const _formData = new FormData();

            _formData.append('fields[name]', formData.campaignName);
            _formData.append('fields[description]', formData.description);
            _formData.append('fields[goal]', formData.goal);
            _formData.append('fields[story]', formData.story);
            _formData.append('fields[endDate]', formData.endDate);

            if (image instanceof File) {
                _formData.append('fields[image]', image);
            }

            // Collect all existing reward IDs to soft-delete them before recreating
            const existingRewardIds = formData.rewards
                .filter(r => r.rewardId)
                .map(r => r.rewardId);

            // Combine explicitly deleted rewards with existing rewards (to recreate with updates)
            const allDeletedIds = [...deletedRewardIds, ...existingRewardIds];

            // Send ALL rewards as new (including edited existing ones)
            _formData.append('newRewards', JSON.stringify(formData.rewards.map((r) => ({
                donationAmount: r.amount,
                rewardName: r.title,
                rewardDescription: r.description,
            }))));
            _formData.append('deletedRewardIds', JSON.stringify(allDeletedIds));

            res = await fetch(campaigns.getById(params.campaignId), {
                method: 'PUT',
                credentials: 'include',
                body: _formData
            });
        } else {
            const _formData = new FormData();

            _formData.append('name', formData.campaignName);
            _formData.append('description', formData.description);
            _formData.append('goal', formData.goal);
            _formData.append('story', formData.story);
            _formData.append('endDate', formData.endDate);

            if (image instanceof File) {
                _formData.append('image', image);
            }

            _formData.append('rewards', JSON.stringify(formData.rewards.map((r) => ({
                donationAmount: r.amount,
                rewardName: r.title,
                rewardDescription: r.description,
            }))));

            res = await fetch(campaigns.get, {
                method: 'POST',
                credentials: 'include',
                body: _formData
            });
        }

        if (!res.ok) {
            toast.error("Something went wrong...");
            return;
        }

        toast.info(`Campaign ${params?.campaignId ? 'edited' : 'created'} successfully!`);
        navigate('/campaign');
    };

    return (
        <div className="campaign-form-container">
            <h1 className="form-title">{params?.campaignId ? 'Edit' : 'Create'} Your Campaign</h1>

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
                        className='form-input'
                        placeholder="Enter campaign name"
                    />
                    <div className="field-info">
                        Name your campaign!
                    </div>
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
                        className='form-textarea'
                        placeholder="Describe your campaign and justify funding needs"
                        rows="4"
                    />
                    <div className="char-count">
                        ({formData.description.length} / 2000 chars)
                    </div>
                    <div className="field-info">
                        Your business story!
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="story" className="form-label">
                        Business story*
                    </label>
                    <textarea
                        id="story"
                        value={formData?.story}
                        onChange={(e) => handleInputChange('story', e.target.value)}
                        className='form-textarea'
                        placeholder="Your businesss story"
                        rows="4"
                    />
                    <div className="char-count">
                        ({formData.story.length} / 2000 chars)
                    </div>
                    <div className="field-info">
                        Provide your campaign description!
                    </div>
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
                            className='form-input currency'
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div className="field-info">
                        Your campaign donation goal (in 2 decimal places).
                    </div>
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
                        className='form-input'
                    />
                    <div className="field-info">
                        Specify when the campaign should end.
                    </div>
                </div>

                {/* Rewards Section */}
                <div className="form-group">
                    <label className="form-label">
                        Reward(s)*
                    </label>
                    <div className="field-info">
                        Rewards for your supporters!
                    </div>

                    {formData?.rewards?.map((reward, index) => (
                        <div key={index} className="flex mt-[3em]">
                            <div className='flex gap-[1em]'>
                                {reward?.rewardId && <input type="hidden" value={reward.rewardId} />}
                                <input
                                    type="number"
                                    placeholder="Donation Amount"
                                    value={reward.amount}
                                    onChange={(e) => handleRewardChange(index, 'amount', e.target.value)}
                                    className="form-input reward-input"
                                    step="0.01"
                                    min="0"
                                />
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={reward.title}
                                    onChange={(e) => handleRewardChange(index, 'title', e.target.value)}
                                    className="form-input reward-input"
                                />
                                <textarea
                                    value={reward.description}
                                    onChange={(e) => handleRewardChange(index, 'description', e.target.value)}
                                    placeholder="Description"
                                    rows="1"
                                    className="form-input reward-input"
                                />
                            </div>
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
                    ))}

                    <div className="reward-info">
                        Generate a new reward tier (i.e. create new 'Donation Amount' and 'Reward').
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="form-group">
                    <div className="image-upload-section">
                        <div className="upload-area">
                            <div className="upload-icon">📁</div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="file-input"
                                id="imageUpload"
                            />
                            <label htmlFor="imageUpload" className="upload-label">
                                Upload image
                            </label>
                        </div>

                        {image && (
                            <div className="image-preview">
                                <img
                                    src={image instanceof File
                                        ? URL.createObjectURL(image)
                                        : image}
                                    className="preview-image"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                    <SubmitButton type="submit" style={{ backgroundColor: params?.campaignId ? '#ffa500' : '#218838' }} className={`create-btn`} loading={null}>
                        {params?.campaignId ? 'Edit' : 'Create'}
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
