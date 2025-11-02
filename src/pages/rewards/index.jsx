import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './rewards.css';
import { user as userPath } from '../../../paths';
import getUser from '../../helpers/getUser';
import { USER_REWARDS_STATUS, USER_ROLES } from '../../helpers/constants';
import Cookies from 'js-cookie';
import { profile } from '../../assets';
import { toast } from 'react-toastify';

export default function Rewards() {
    const navigate = useNavigate();
    const [rewards, setRewards] = useState({
        pending: [],
        completed: [],
        redeemed: []
    });
    const [loading, setLoading] = useState(true);
    const [userObj, setUserObj] = useState('');
    const [profilePicture, setProfilePicture] = useState(profile);

    const user = Cookies.get('user');
    useEffect(() => {
        if (user) {
            const userObj = JSON.parse(user);
            if (userObj?.picture) setProfilePicture(userObj.picture);
        } else {
            setProfilePicture(profile);
        }
    }, [user]);

    useEffect(() => {
        _getUser();
        const handler = () => {
            const stored = localStorage.getItem("profilePicture");
            if (stored) setProfilePicture(JSON.parse(stored));
        };
        window.addEventListener("profileUpdated", handler);
        handler();
        return () => window.removeEventListener("profileUpdated", handler);
    }, []);

    useEffect(() => {
        if (userObj?.userId) fetchRewards();
    }, [userObj]);

    async function _getUser() {
        const user = await getUser();
        if (!user || user.role !== USER_ROLES.SUPPORTER) {
            navigate("/");
            return;
        }
        setUserObj(user);
    }

    async function fetchRewards() {
        try {
            setLoading(true);
            const res = await fetch(userPath.rewards(userObj.userId), {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) {
                toast.error('Failed to load rewards');
                return;

            }
            const rewards = await res.json();
            setRewards({
                pending: rewards.filter((r) => r.status.toLowerCase() === USER_REWARDS_STATUS.PENDING),
                completed: rewards.filter((r) => r.status.toLowerCase() === USER_REWARDS_STATUS.COMPLETED),
                redeemed: rewards.filter((r) => r.status.toLowerCase() === USER_REWARDS_STATUS.REDEEMED)
            });
        } catch (err) {
            toast.error(err.message || 'Failed to load rewards');
        } finally {
            setLoading(false);
        }
    };

    const handleRewardClick = (reward, status) => {
        if (status === 'completed') {
            navigate(`/rewards/${reward.userRewardId}`);
        }
    };

    if (loading) {
        return <div className="rewards-page"><p className="loading">Loading rewards...</p></div>;
    }

    return (
        <div className="rewards-page">
            <div className="profile-section">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <button className="edit-button" onClick={() => navigate("/profile")}>Edit</button>
                </div>
                <div className="profile-info">
                    {profilePicture && <img src={profilePicture} alt="Profile" className="profile-picture" />}
                    {!profilePicture && <div className="profile-picture-placeholder"></div>}
                    <p className="username">{userObj?.username}</p>
                </div>
            </div>

            <div className="rewards-section">
                <h2>My Rewards:</h2>

                <div className="rewards-category">
                    <h3>Pending</h3>
                    <div className="rewards-grid">
                        {rewards.pending.length > 0 ? (
                            rewards.pending.map(reward => (
                                <div key={reward.userRewardId} className="reward-card pending">
                                    <div className="reward-image">
                                        {reward.campaignImage ? <img src={reward.campaignImage} alt={reward.campaignName} /> : '📦'}
                                    </div>
                                    <div className="reward-details">
                                        <h4>{reward.campaignName}</h4>
                                        <p className="reward-name">{reward.rewardName}</p>
                                        <span className="reward-status">Awaiting Approval</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-rewards">No pending rewards</p>
                        )}
                    </div>
                </div>

                <div className="rewards-category">
                    <h3>Completed</h3>
                    <div className="rewards-grid">
                        {rewards.completed.length > 0 ? (
                            rewards.completed.map(reward => (
                                <div
                                    key={reward.userRewardId}
                                    className="reward-card completed clickable"
                                    onClick={() => handleRewardClick(reward, 'completed')}
                                >
                                    <div className="reward-image">
                                        {reward.campaignImage ? <img src={reward.campaignImage} alt={reward.campaignName} /> : '✅'}
                                    </div>
                                    <div className="reward-details">
                                        <h4>{reward.campaignName}</h4>
                                        <p className="reward-name">{reward.rewardName}</p>
                                        <span className="reward-status">Ready to Use</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-rewards">No completed rewards</p>
                        )}
                    </div>
                </div>

                <div className="rewards-category">
                    <h3>Redeemed</h3>
                    <div className="rewards-grid">
                        {rewards.redeemed.length > 0 ? (
                            rewards.redeemed.map(reward => (
                                <div key={reward.userRewardId} className="reward-card redeemed">
                                    <div className="reward-image">
                                        {reward.campaignImage ? <img src={reward.campaignImage} alt={reward.campaignName} /> : '🎁'}
                                    </div>
                                    <div className="reward-details">
                                        <h4>{reward.campaignName}</h4>
                                        <p className="reward-name">{reward.rewardName}</p>
                                        <span className="reward-status">Used</span>
                                    </div>
                                </div>
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