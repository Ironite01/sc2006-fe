import { useState, useEffect } from 'react';
import './updates.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updates as updatesPath } from '../../../paths';
import getUser from '../../helpers/getUser';
import { USER_ROLES } from '../../helpers/constants';

export default function UserUpdates() {
    const navigate = useNavigate();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            setLoading(true);
            const user = await getUser();
            if (!user || user.role !== USER_ROLES.SUPPORTER) {
                toast.error("This page is only for supporters!");
                navigate("/");
                return;
            }
            const response = await fetch(updatesPath.getByUserDonation(user.userId), {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                toast.error('Failed to load updates');
            }
            const data = await response.json();

            // Transform backend data to match component structure
            const transformedUpdates = data.map(update => ({
                id: update.updateId,
                campaignId: update.campaignId,
                campaignName: update.campaignName,
                campaignImage: update.campaignImage || '',
                title: update.title,
                date: `Posted ${new Date(update.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
                content: update.description,
                image: update.image || '',
                likes: update.likeCount,
                comments: update.commentCount
            }));
            setUpdates(transformedUpdates);
        } catch (err) {
            toast.error(err.message || 'Failed to load updates');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="updates-page"><p className="loading">Loading updates...</p></div>;
    }

    return (
        <div className="updates-page">
            <h1>Updates</h1>
            <p className="subtitle">Campaign updates from businesses you've supported</p>

            <div className="updates-list">
                {updates.length > 0 ? (
                    updates.map(update => (
                        <div key={update.id} className="update-card" onClick={() => navigate(`/campaign/${update.campaignId}/updates/${update.id}`)}>
                            <div className="update-header">
                                {update.campaignImage && (
                                    <img src={update.campaignImage} alt={update.campaignName} className="campaign-thumbnail" />
                                )}
                                {!update.campaignImage && (
                                    <div className="campaign-thumbnail-placeholder">🏪</div>
                                )}
                                <h2>{update.campaignName}</h2>
                            </div>

                            <div className="update-content">
                                <h3>{update.title}</h3>
                                <p className="update-date">{update.date}</p>
                                <p className="update-text">{update.content}</p>

                                {update.image && (
                                    <img src={update.image} alt="Update" className="update-image" />
                                )}
                            </div>

                            <div className="update-actions">
                                <button
                                    className={`action-button ${update.isLiked ? 'liked' : ''}`}
                                    onClick={() => handleLike(update.id)}
                                >
                                    <span className="icon">{update.isLiked ? '❤️' : '🤍'}</span>
                                    {update.likes} {update.likes === 1 ? 'Like' : 'Likes'}
                                </button>
                                <button className="action-button" onClick={() => handleComment(update.id)}>
                                    <span className="icon">💬</span> Comment
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-updates">No updates available. Support campaigns to see their updates!</p>
                )}
            </div>
        </div>
    );
}