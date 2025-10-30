import { useState, useEffect } from 'react';
import './ManageCampaignUpdates.css';

export default function ManageCampaignUpdates({ campaignId }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    tags: ''
  });

  useEffect(() => {
    fetchUpdates();
  }, [campaignId]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:3000/campaigns/${campaignId}/updates?includeScheduled=true`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load updates');
      }

      setUpdates(data.updates || []);
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError(err.message || 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (update) => {
    setEditingId(update.updateId);
    setEditForm({
      title: update.title,
      description: update.description,
      imageUrl: update.imageUrl || '',
      tags: update.tags || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: '',
      description: '',
      imageUrl: '',
      tags: ''
    });
  };

  const handleSaveEdit = async (updateId) => {
    try {
      if (!editForm.title.trim() || !editForm.description.trim()) {
        alert('Title and description are required');
        return;
      }

      const response = await fetch(`http://localhost:3000/updates/${updateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          imageUrl: editForm.imageUrl || null,
          tags: editForm.tags || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update');
      }

      alert('Update saved successfully!');
      setEditingId(null);
      fetchUpdates();
    } catch (err) {
      console.error('Error saving update:', err);
      alert(err.message || 'Failed to save update');
    }
  };

  const handleDelete = async (updateId) => {
    if (!confirm('Are you sure you want to delete this update? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/updates/${updateId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete update');
      }

      alert('Update deleted successfully!');
      fetchUpdates();
    } catch (err) {
      console.error('Error deleting update:', err);
      alert(err.message || 'Failed to delete update');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="manage-updates-loading">Loading updates...</div>;
  }

  if (error) {
    return (
      <div className="manage-updates-error">
        <p>{error}</p>
        <button onClick={fetchUpdates} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="manage-campaign-updates">
      <div className="updates-header">
        <h2>Manage Campaign Updates</h2>
        <p className="updates-subtitle">
          Edit or delete your campaign updates. Changes are visible to all supporters.
        </p>
      </div>

      {updates.length === 0 ? (
        <div className="no-updates">
          <p>You haven't posted any updates yet.</p>
          <p className="hint">Go to your dashboard to post your first update!</p>
        </div>
      ) : (
        <div className="updates-list">
          {updates.map((update) => (
            <div key={update.updateId} className="update-item">
              {editingId === update.updateId ? (
                // Edit Mode
                <div className="edit-form">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      maxLength={255}
                      className="edit-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows={6}
                      className="edit-textarea"
                    />
                    <div className="char-count">{editForm.description.length} characters</div>
                  </div>

                  <div className="form-group">
                    <label>Image URL (optional)</label>
                    <input
                      type="url"
                      value={editForm.imageUrl}
                      onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                      className="edit-input"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tags (optional)</label>
                    <input
                      type="text"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                      maxLength={100}
                      className="edit-input"
                      placeholder="milestone, progress, announcement"
                    />
                  </div>

                  <div className="edit-actions">
                    <button onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
                    <button onClick={() => handleSaveEdit(update.updateId)} className="btn-save">
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="update-view">
                  <div className="update-header-row">
                    <div>
                      <h3 className="update-title">{update.title}</h3>
                      <p className="update-date">Posted: {formatDate(update.postedAt)}</p>
                      {update.scheduledFor && (
                        <p className="update-scheduled">Scheduled for: {formatDate(update.scheduledFor)}</p>
                      )}
                    </div>
                    <div className="update-actions">
                      <button onClick={() => handleEdit(update)} className="btn-edit-small">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(update.updateId)} className="btn-delete-small">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <p className="update-description">{update.description}</p>

                  {update.imageUrl && (
                    <div className="update-image-preview">
                      <img src={update.imageUrl} alt="Update" />
                    </div>
                  )}

                  {update.tags && (
                    <div className="update-tags">
                      {update.tags.split(',').map((tag, index) => (
                        <span key={index} className="tag">{tag.trim()}</span>
                      ))}
                    </div>
                  )}

                  <div className="update-stats">
                    <span className="stat-item">❤️ {update.likeCount || 0} likes</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
