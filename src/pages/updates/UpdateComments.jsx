import { useState, useEffect } from 'react';
import './UpdateComments.css';
import { profile } from '../../assets';

export default function UpdateComments({ updateId, userId, onClose }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [updateId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:3000/updates/${updateId}/comments`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load comments');
      }

      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/updates/${updateId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: parseInt(userId),
          commentText: commentText.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post comment');
      }

      // Add the new comment to the list
      setComments(prev => [data.comment, ...prev]);
      setCommentText('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setError(err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="update-comments-overlay" onClick={onClose}>
      <div className="update-comments-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <h3>Comments</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="comments-content">
          {/* Comment Form */}
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
            {error && <div className="comment-error">{error}</div>}
            <div className="comment-form-actions">
              <span className="char-counter">
                {commentText.length}/1000
              </span>
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="post-comment-btn"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {loading ? (
              <div className="comments-loading">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet</p>
                <p className="no-comments-subtext">Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.commentId} className="comment-item">
                  <img
                    src={comment.profilePicture || profile}
                    alt={comment.username}
                    className="comment-profile-pic"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = profile;
                    }}
                  />
                  <div className="comment-content">
                    <div className="comment-meta">
                      <span className="comment-username">{comment.username}</span>
                      <span className="comment-time">{formatTimeAgo(comment.postedAt)}</span>
                    </div>
                    <p className="comment-text">{comment.commentText}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
