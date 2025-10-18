import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RewardProof.css';

export default function RewardProof() {
    const { rewardId } = useParams();
    const navigate = useNavigate();
    const [reward, setReward] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch reward details from backend
        async function fetchRewardProof() {
            try {
                // Placeholder for backend API call
                // const res = await fetch(`/api/rewards/${rewardId}`, { credentials: 'include' });
                // const data = await res.json();

                // Mock data for demonstration
                const mockReward = {
                    id: rewardId,
                    campaign: {
                        name: 'Save Uncle Tan\'s Laksa',
                        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop'
                    },
                    rewardName: '$10 Voucher',
                    rewardDescription: 'Redeemable for any menu item',
                    status: 'Completed',
                    claimedDate: '2025-01-15T10:30:00',
                    qrCode: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiB4PSIyMCIgeT0iMjAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=',
                    code: 'REWARD-' + rewardId
                };

                setReward(mockReward);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reward proof:', error);
                setLoading(false);
            }
        }

        fetchRewardProof();
    }, [rewardId]);

    if (loading) {
        return (
            <div className="reward-proof-page">
                <p>Loading reward...</p>
            </div>
        );
    }

    if (!reward) {
        return (
            <div className="reward-proof-page">
                <p>Reward not found</p>
                <button onClick={() => navigate('/rewards')} className="back-btn">
                    Back to Rewards
                </button>
            </div>
        );
    }

    return (
        <div className="reward-proof-page">
            <div className="reward-proof-container">
                <button onClick={() => navigate('/rewards')} className="close-btn">
                    ← Back to Rewards
                </button>

                <h1>My Reward</h1>

                <div className="reward-proof-card">
                    <div className="campaign-image">
                        <img src={reward.campaign.imageUrl} alt={reward.campaign.name} />
                    </div>

                    <div className="reward-details">
                        <h2>{reward.campaign.name}</h2>

                        <div className="reward-info-section">
                            <div className="info-row">
                                <span className="label">Reward:</span>
                                <span className="value">{reward.rewardName}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Status:</span>
                                <span className="value status-completed">{reward.status}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Claimed on:</span>
                                <span className="value">
                                    {new Date(reward.claimedDate).toLocaleDateString('en-US', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="qr-section">
                            <h3>Show this QR code at the store</h3>
                            <div className="qr-code">
                                <img src={reward.qrCode} alt="QR Code" />
                            </div>
                            <p className="reward-code">Code: <strong>{reward.code}</strong></p>
                        </div>

                        <div className="instructions">
                            <h4>Redemption Instructions:</h4>
                            <ol>
                                <li>Visit {reward.campaign.name} during business hours</li>
                                <li>Show this QR code or redemption code to staff</li>
                                <li>Enjoy your reward!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
