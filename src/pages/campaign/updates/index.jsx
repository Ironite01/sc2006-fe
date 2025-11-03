import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updates as updatesPath } from '../../../../paths';
import CommentsModal from '../../../components/CommentsModal.jsx';
import getUser from '../../../helpers/getUser.js';

export default function Updates() {
    const { campaignId, updateId } = useParams();
    const [update, setUpdate] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [userId, setUserId] = useState(null);
    const [editComment, setEditComment] = useState({});

    useEffect(() => {
        getUser_();
        getUpdate();
        isLikedFn();
    }, [campaignId, updateId]);

    async function getUser_() {
        const user = await getUser();
        if (user) {
            setUserId(user.userId);
        }
    }

    async function isLikedFn() {
        const res = await fetch(updatesPath.like(campaignId, updateId), {
            credentials: 'include'
        });

        if (!res.ok) {
            toast.warn("Something went wrong...");
            return;
        }
        const { hasLiked } = await res.json();
        setIsLiked(hasLiked);
    }

    async function getUpdate() {
        try {
            setLoading(true);
            const response = await fetch(updatesPath.getById(campaignId, updateId), {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                toast.error('Failed to load updates');
                return;
            }

            const update = await response.json();
            const transformedUpdates = {
                id: update.updateId,
                campaignId: update.campaignId,
                campaignName: update.campaignName,
                title: update.title,
                date: `Posted ${new Date(update.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
                content: update.description,
                image: update.image,
                likes: update.likeCount,
                comments: update.comments
            }
            setUpdate(transformedUpdates)
        } catch (err) {
            toast.error(err.message || 'Failed to load updates');
        } finally {
            setLoading(false);
        }
    };

    async function handleLike() {
        const res = await fetch(updatesPath.like(campaignId, updateId), {
            method: isLiked ? "DELETE" : "POST",
            credentials: 'include'
        });

        if (!res.ok) {
            toast.error("Something went wrong...");
            return;
        }

        const { message } = await res.json();
        console.log(message);
        setUpdate({ ...update, likes: isLiked ? update.likes - 1 : update.likes + 1 });
        setIsLiked(!isLiked);
    }

    if (loading) {
        return <div className="updates-page"><p className="loading">Loading updates...</p></div>;
    }

    async function handleDeleteComment(commentId) {
        if (!confirm("Are you sure you want to delete comment")) return;
        const res = await fetch(updatesPath.editComment(campaignId, updateId, commentId), {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!res.ok) {
            toast.error("Something went wrong...");
            return
        }
        location.reload();
    }

    return (
        <div className="updates-page">
            <div className="updates-list">
                {update ? (
                    <div key={update.id} className="update-card">
                        <div className="update-header">
                            <h2>{update.campaignName}</h2>
                        </div>

                        <div className="update-content">
                            <h3>{update.title}</h3>
                            <p className="update-date">{update.date}</p>
                            <p className="update-text">{update.content}</p>

                            {update.image && (
                                <img width={300} src={update.image} alt="Update" />
                            )}
                        </div>

                        <div className="update-actions">
                            <button
                                className={`action-button ${update.isLiked ? 'liked' : ''}`}
                                onClick={() => handleLike()}
                            >
                                <span className="icon">{isLiked ? '❤️' : '🤍'}</span>
                                {update.likes} {update.likes === 1 ? 'Like' : 'Likes'}
                            </button>
                            <button className="action-button" onClick={() => setShowComments(true)}>
                                <span className="icon">💬</span> Comment
                            </button>
                        </div>

                        <div className="comments-section">
                            <h4>Comments</h4>
                            {update && update?.comments?.length > 0 ? (
                                update.comments.map((comment) => (
                                    <div key={comment.commentId} className="comment-card">
                                        <div className="comment-avatar">
                                            <img
                                                src={comment.profilePicture || '/default-profile.png'}
                                                alt={comment.username}
                                            />
                                        </div>
                                        <div className="comment-body">
                                            <div className="comment-header">
                                                <span className="comment-username">{comment.username}</span>
                                                <span className="comment-date">
                                                    {new Date(comment.commentPostedAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="comment-text">{comment.commentText}</p>
                                            {comment.userId === userId && (
                                                <div className="comment-actions">
                                                    <button className="edit-button" onClick={() => setEditComment({ commentId: comment.commentId, commentText: comment.commentText })}>Edit</button>
                                                    <button className="delete-button" onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-comments">No comments yet.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="no-updates">No update available.</p>
                )}
            </div>

            {editComment?.commentText && editComment?.commentId && <CommentsModal
                campaignId={campaignId}
                userId={userId}
                updateId={updateId}
                editComment={editComment}
                onClose={() => setEditComment({})}
            />}

            {showComments && <CommentsModal
                campaignId={campaignId}
                userId={userId}
                updateId={updateId}
                onClose={() => setShowComments(false)}
            />}
        </div>
    );
}