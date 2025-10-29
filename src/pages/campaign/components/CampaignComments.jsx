import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './campaignComments.css';
import Cookies from 'js-cookie';
import API from '../../../services/api';

export default function CampaignComments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const [campaignImage, setCampaignImage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        setUserId(userObj.userId);
      } catch (err) {
        console.error('Failed to parse user cookie:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchCampaignData();
      fetchComments();
    }
  }, [id]);

  const fetchCampaignData = async () => {
    try {
      const response = await API.getCampaign(id);
      if (response.success) {
        setCampaignName(response.campaign.name);
        setCampaignImage(response.campaign.imageUrl || '');
      }
    } catch (err) {
      console.error('Error fetching campaign data:', err);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.getCampaignComments(id);

      if (response.success) {
        // Transform backend data to match component structure
        const transformedComments = response.comments.map(comment => {
          // Find the first reply (business owner reply)
          const businessReply = comment.replies && comment.replies.length > 0
            ? comment.replies[0]
            : null;

          return {
            id: comment.commentId,
            user: comment.username,
            userPicture: comment.profilePicture
              ? `data:image/png;base64,${comment.profilePicture}`
              : '',
            comment: comment.content,
            date: new Date(comment.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }),
            reply: businessReply ? businessReply.content : null,
            replyId: businessReply ? businessReply.commentId : null
          };
        });

        setComments(transformedComments);
      } else {
        setError('Failed to load comments');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handlePostReply = async (commentId) => {
    if (!replyText.trim()) return;

    if (!userId) {
      alert('You must be logged in to reply');
      return;
    }

    try {
      const response = await API.replyToComment(commentId, userId, replyText);

      if (response.success) {
        // Update local state
        setComments(prev =>
          prev.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  reply: replyText,
                  replyId: response.reply.commentId
                }
              : comment
          )
        );

        setReplyingTo(null);
        setReplyText('');
      } else {
        alert('Failed to post reply: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      alert('Failed to post reply: ' + (err.message || 'Unknown error'));
    }
  };

  const handleClose = () => {
    navigate(`/campaign/${id}`);
  };

  if (loading) {
    return <div className="campaign-comments-page"><p className="loading">Loading comments...</p></div>;
  }

  if (error) {
    return (
      <div className="campaign-comments-page">
        <div className="comments-modal-overlay">
          <div className="comments-modal">
            <p className="error-message">{error}</p>
            <button onClick={fetchComments} className="retry-button">Retry</button>
            <button onClick={handleClose} className="close-modal-button">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaign-comments-page">
      <div className="comments-modal-overlay">
        <div className="comments-modal">
          <div className="modal-header">
            {campaignImage && <img src={campaignImage} alt={campaignName} className="campaign-thumbnail" />}
            {!campaignImage && <div className="campaign-thumbnail-placeholder">🏪</div>}
            <div className="campaign-info">
              <h2>{campaignName}</h2>
              <p>Campaign Comments</p>
            </div>
            <button className="close-button" onClick={handleClose}>×</button>
          </div>

          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  {comment.userPicture && (
                    <img src={comment.userPicture} alt={comment.user} className="user-picture" />
                  )}
                  {!comment.userPicture && (
                    <div className="user-picture-placeholder">👤</div>
                  )}
                  <div className="comment-meta">
                    <span className="username">{comment.user}</span>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                </div>

                <div className="comment-body">
                  <p>{comment.comment}</p>
                </div>

                {comment.reply && (
                  <div className="reply-section">
                    <div className="reply-header">
                      <span className="reply-label">Reply as business owner</span>
                    </div>
                    <p className="reply-text">{comment.reply}</p>
                  </div>
                )}

                {!comment.reply && replyingTo !== comment.id && (
                  <button
                    className="reply-button"
                    onClick={() => handleReplyClick(comment.id)}
                  >
                    Reply
                  </button>
                )}

                {replyingTo === comment.id && (
                  <div className="reply-form">
                    <p className="reply-label">Reply as business owner</p>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="reply-textarea"
                    />
                    <div className="reply-actions">
                      <button onClick={handleCancelReply} className="cancel-button">
                        Cancel
                      </button>
                      <button onClick={() => handlePostReply(comment.id)} className="post-button">
                        Post Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <p className="no-comments">No comments yet.</p>
          )}

          <button onClick={handleClose} className="close-modal-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
