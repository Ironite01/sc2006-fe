import { useState, useEffect } from 'react';
import './commentsModal.css';
import { profile } from '../assets';
import { toast } from 'react-toastify';
import { updates } from '../../paths';

export default function CommentsModal({ updateId, campaignId, userId, editComment = {}, onClose }) {
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editComment?.commentText) {
            setCommentText(editComment?.commentText);
        }
    }, []);

    const handlePostComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        setSubmitting(true);

        try {
            let response;
            if (editComment?.commentId && editComment?.commentText) {
                response = await fetch(updates.editComment(campaignId, updateId, editComment.commentId), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        userId,
                        commentText: commentText.trim()
                    })
                });
            } else {
                response = await fetch(updates.comment(campaignId, updateId), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        userId,
                        commentText: commentText.trim()
                    })
                });
            }

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Failed to post comment');
                return;
            }
            location.reload();
        } catch (err) {
            toast.error(err.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="update-comments-overlay" onClick={onClose}>
            <div className="update-comments-modal" onClick={(e) => e.stopPropagation()}>
                <div className="comments-header">
                    <h3>Comments</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="comments-content">
                    <form onSubmit={handlePostComment} className="comment-form">
                        <div className="comment-input-wrapper">
                            <img
                                src={profile}
                                alt="Your profile"
                                className="comment-profile-pic"
                            />
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                rows={3}
                                disabled={submitting}
                                maxLength={1000}
                            />
                        </div>

                        <div className="comment-form-actions">
                            <span className="char-counter">
                                {commentText.length}/1000
                            </span>
                            <button
                                type="submit"
                                disabled={submitting || !commentText.trim()}
                                className="post-comment-btn"
                            >
                                {submitting ? (editComment.commentText ? 'Editing' : 'Posting...') : (editComment.commentText ? 'Edit Comment' : 'Post Comment')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}