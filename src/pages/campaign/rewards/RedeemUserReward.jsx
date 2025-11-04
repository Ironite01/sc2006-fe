import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './redeemUserReward.css';
import { USER_REWARDS_STATUS, USER_ROLES } from '../../../helpers/constants';
import { user_rewards, user as userPath } from '../../../../paths';
import { toast } from 'react-toastify';
import getUser from '../../../helpers/getUser';

export default function RedeemUserReward() {
    const navigate = useNavigate();
    const { campaignId, userRewardsId, userId } = useParams();
    const [reward, setReward] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(false);
    const [redeemed, setRedeemed] = useState(false);

    useEffect(() => {
        fetchAndRedeemReward();
    }, [campaignId, userRewardsId]);

    useEffect(() => {
        authorize();
    }, []);

    async function authorize() {
        const user = await getUser();
        if (!user || user.role !== USER_ROLES.BUSINESS_REPRESENTATIVE) {
            navigate("/");
        }
    }

    const fetchAndRedeemReward = async () => {
        try {
            setLoading(true);
            // First, fetch reward details
            const response = await fetch(userPath.reward(userId, userRewardsId), {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                toast.error('Failed to load reward details');
                return;
            }

            const rewardData = await response.json();

            // Set initial reward data
            const formattedReward = {
                userRewardId: rewardData.userRewardId,
                campaignName: rewardData.campaignName,
                campaignImage: rewardData.campaignImage || '',
                reward: rewardData.rewardName,
                rewardDetails: rewardData.rewardDescription,
                status: rewardData.status,
                username: rewardData.username,
                email: rewardData.email,
                shopName: rewardData.shopName,
                claimedAt: new Date(rewardData.claimedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }),
                approvedAt: rewardData.approvedAt ? new Date(rewardData.approvedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }) : null
            };

            setReward(formattedReward);

            if (rewardData.status.toLowerCase() === USER_REWARDS_STATUS.COMPLETED.toLowerCase()) {
                setRedeeming(true);
                try {
                    const redeemResponse = await fetch(user_rewards.redeem(campaignId, userId, userRewardsId), {
                        method: 'PUT',
                        credentials: 'include'
                    });
                    if (!redeemResponse.ok) {
                        toast.error(redeemResponse.message || 'Failed to redeem reward');
                        return;
                    }
                    toast.info("Redemption successful!")
                    setRedeemed(true);
                    setReward(prev => ({ ...prev, status: 'redeemed' }));
                } catch (redeemErr) {
                    toast.error(redeemErr.message || 'Failed to redeem reward');
                } finally {
                    setRedeeming(false);
                }
            } else if (rewardData.status.toLowerCase() === USER_REWARDS_STATUS.REDEEMED.toLowerCase()) {
                setRedeemed(true);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to load reward details');
        } finally {
            setLoading(false);
        }
    };


    if (loading || redeeming) {
        return (
            <div className="verify-reward-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading">
                        {loading ? 'Loading reward details...' : 'Redeeming reward...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!reward) {
        return (
            <div className="verify-reward-page">
                <p className="error">Reward not found</p>
            </div>
        );
    }

    return (
        <div className="verify-reward-page">
            <div className="verify-container">
                <h1>Reward Verification</h1>

                <div className="verify-card">
                    <div className="business-header">
                        <h2>{reward.shopName}</h2>
                        <p className="campaign-subtitle">{reward.campaignName}</p>
                    </div>

                    {reward.campaignImage && (
                        <img
                            src={reward.campaignImage}
                            alt={reward.campaignName}
                            className="campaign-image"
                        />
                    )}

                    <div className="reward-details">
                        <div className="detail-section">
                            <h3>Reward</h3>
                            <p className="reward-name">{reward.reward}</p>
                            <p className="reward-description">{reward.rewardDetails}</p>
                        </div>

                        <div className="detail-section">
                            <h3>Supporter</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="label">Name:</span>
                                    <span className="value">{reward.username}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Email:</span>
                                    <span className="value">{reward.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Reward Status</h3>
                            <div className="status-badge status-{reward.status}">
                                {reward.status === USER_REWARDS_STATUS.COMPLETED && 'Ready to Redeem'}
                                {reward.status === USER_REWARDS_STATUS.REDEEMED && 'Already Redeemed'}
                                {reward.status === USER_REWARDS_STATUS.PENDING && 'Pending Approval'}
                            </div>
                        </div>

                        {reward.status === USER_REWARDS_STATUS.PENDING && (
                            <div className="alert alert-warning">
                                <strong>⚠️ Not Approved Yet</strong>
                                <p>This reward has not been approved by the business yet.</p>
                            </div>
                        )}
                    </div>

                    {redeemed && (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h3>Reward Redeemed Successfully!</h3>
                            <p>This reward has been marked as redeemed and cannot be used again.</p>
                            <p className="timestamp">Redeemed just now</p>
                        </div>
                    )}

                    {reward.status === USER_REWARDS_STATUS.REDEEMED && !redeemed && (
                        <div className="already-redeemed-message">
                            <div className="info-icon">ℹ️</div>
                            <h3>Already Redeemed</h3>
                            <p>This reward was previously redeemed and cannot be used again.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}