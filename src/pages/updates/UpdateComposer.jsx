import { useState } from 'react';
import './UpdateComposer.css';

export default function UpdateComposer({ campaignId, campaignName, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/campaigns/${campaignId}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl || null,
          tags: formData.tags || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create update');
      }

      // Success
      if (onSuccess) {
        onSuccess(data);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error creating update:', err);
      setError(err.message || 'Failed to create update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-composer-overlay" onClick={onClose}>
      <div className="update-composer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="composer-header">
          <h2>Post Update</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="composer-campaign-info">
          <span className="campaign-label">Campaign:</span>
          <span className="campaign-name">{campaignName}</span>
        </div>

        <form onSubmit={handleSubmit} className="composer-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">
              Update Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter update title"
              maxLength={255}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Share what's new with your supporters..."
              rows={6}
              disabled={loading}
              required
            />
            <div className="char-count">
              {formData.description.length} characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">
              Image URL <span className="optional">(optional)</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <div className="preview-error" style={{ display: 'none' }}>
                  Invalid image URL
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tags">
              Tags <span className="optional">(optional)</span>
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="milestone, progress, announcement (comma-separated)"
              maxLength={100}
              disabled={loading}
            />
            <div className="help-text">
              Use tags to categorize your update (e.g., milestone, progress, announcement)
            </div>
          </div>

          <div className="composer-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-post"
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
            >
              {loading ? 'Posting...' : 'Post Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
