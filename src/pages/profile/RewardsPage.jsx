import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profile as defaultProfile } from '../../assets';
import './RewardsPage.css';

export default function RewardsPage() {
    const navigate = useNavigate();
    const [rewards, setRewards] = useState({
        pending: [],
        completed: [],
        redeemed: []
    });
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        // TODO: Fetch user profile and rewards from backend
        async function fetchRewards() {
            try {
                // Placeholder for backend API call
                // const res = await fetch('/api/user/rewards', { credentials: 'include' });
                // const data = await res.json();

                // Mock data for demonstration
                const mockData = {
                    user: {
                        username: 'JohnDoe',
                        profilePicture: null
                    },
                    rewards: {
                        pending: [
                            {
                                id: 1,
                                campaign: { id: 1, name: 'Save Uncle Tan\'s Laksa', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', progress: 65 },
                                rewardName: '$10 Voucher',
                                claimedDate: '2025-01-15'
                            },
                            {
                                id: 2,
                                campaign: { id: 2, name: 'Support Old Street Bakery', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop', progress: 45 },
                                rewardName: 'Free Pastry',
                                claimedDate: '2025-01-18'
                            }
                        ],
                        completed: [
                            {
                                id: 3,
                                campaign: { id: 3, name: 'Craft Coffee Roastery', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop', progress: 80 },
                                rewardName: '$15 Voucher',
                                claimedDate: '2024-12-20',
                                completedDate: '2025-01-05'
                            }
                        ],
                        redeemed: [
                            {
                                id: 4,
                                campaign: { id: 4, name: 'Heritage Bookstore', imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&h=200&fit=crop', progress: 100 },
                                rewardName: '20% Discount',
                                claimedDate: '2024-11-10',
                                redeemedDate: '2024-12-15'
                            }
                        ]
                    }
                };

                setUsername(mockData.user.username);
                setProfilePicture(mockData.user.profilePicture);
                setRewards(mockData.rewards);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rewards:', error);
                setLoading(false);
            }
        }

        fetchRewards();

        // Load profile picture from localStorage
        const storedPicture = localStorage.getItem('profilePicture');
        if (storedPicture) {
            setProfilePicture(JSON.parse(storedPicture));
        }
    }, []);

    const handleRewardClick = (reward, status) => {
        if (status === 'completed') {
            navigate(`/reward/${reward.id}`);
        }
    };

    const RewardCard = ({ reward, status }) => (
        <div
            className={`reward-card ${status === 'completed' ? 'clickable' : ''}`}
            onClick={() => handleRewardClick(reward, status)}
        >
            <div className="reward-image">
                <img src={reward.campaign.imageUrl} alt={reward.campaign.name} />
            </div>
            <div className="reward-info">
                <h4>{reward.campaign.name}</h4>
                <div className="progress-bar-container">
                    <div className="progress-bar-label">
                        <span>Funding Progress</span>
                        <span>{reward.campaign.progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${reward.campaign.progress}%` }}
                        ></div>
                    </div>
                </div>
                <p className="reward-name">Reward: {reward.rewardName}</p>
                <p className="reward-date">Claimed: {new Date(reward.claimedDate).toLocaleDateString()}</p>
            </div>
        </div>
    );

    if (loading) {
        return <div className="rewards-page"><p>Loading rewards...</p></div>;
    }

    return (
        <div className="rewards-page">
            <div className="profile-header">
                <img
                    src={profilePicture || defaultProfile}
                    alt="Profile"
                    className="profile-pic"
                />
                <div className="profile-info">
                    <h2>{username}</h2>
                    <button onClick={() => navigate('/profile/edit')} className="edit-btn">
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="rewards-section">
                <h3>My Rewards</h3>

                <div className="reward-category">
                    <h4 className="category-title">Pending</h4>
                    <p className="category-description">
                        Rewards awaiting business representative approval
                    </p>
                    <div className="rewards-grid">
                        {rewards.pending.length > 0 ? (
                            rewards.pending.map(reward => (
                                <RewardCard key={reward.id} reward={reward} status="pending" />
                            ))
                        ) : (
                            <p className="no-rewards">No pending rewards</p>
                        )}
                    </div>
                </div>

                <div className="reward-category">
                    <h4 className="category-title">Completed</h4>
                    <p className="category-description">
                        Rewards ready to be redeemed (click to view proof)
                    </p>
                    <div className="rewards-grid">
                        {rewards.completed.length > 0 ? (
                            rewards.completed.map(reward => (
                                <RewardCard key={reward.id} reward={reward} status="completed" />
                            ))
                        ) : (
                            <p className="no-rewards">No completed rewards</p>
                        )}
                    </div>
                </div>

                <div className="reward-category">
                    <h4 className="category-title">Redeemed</h4>
                    <p className="category-description">
                        Rewards that have been used
                    </p>
                    <div className="rewards-grid">
                        {rewards.redeemed.length > 0 ? (
                            rewards.redeemed.map(reward => (
                                <RewardCard key={reward.id} reward={reward} status="redeemed" />
                            ))
                        ) : (
                            <p className="no-rewards">No redeemed rewards</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
