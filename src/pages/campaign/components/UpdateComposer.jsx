import { useState, useEffect } from 'react';
import './UpdateComposer.css';

export default function UpdateComposer() {
    const [updates, setUpdates] = useState([]);
    const [stats, setStats] = useState({ totalUpdates: 0, supportersReached: 0, avgViews: 0 });
    const [loading, setLoading] = useState(true);
    const [showComposer, setShowComposer] = useState(false);

    useEffect(() => {
        // Load published updates and stats (mock data)
        async function fetchUpdates() {
            try {
                const mockUpdates = [
                    {
                        id: 1,
                        title: 'We\'ve reopened for weekend brunch!',
                        content: 'Thanks to your support, we\'ve fixed our stove and reopened for weekend brunch! Come visit us this Saturday and Sunday from 9am-2pm.',
                        imageUrl: 'https://images.unsplash.com/photo-1533777419517-3e4017e2e15a?w=400&h=300&fit=crop',
                        postedDate: '2025-01-31T10:00:00',
                        likes: 45,
                        comments: 12
                    },
                    {
                        id: 2,
                        title: 'Kitchen renovations complete!',
                        content: 'Our stove has been fully repaired and we\'ve upgraded our kitchen equipment. We can now serve you better than ever!',
                        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
                        postedDate: '2025-01-10T14:30:00',
                        likes: 38,
                        comments: 8
                    }
                ];

                const mockStats = {
                    totalUpdates: 3,
                    supportersReached: 250,
                    avgViews: 120
                };

                setUpdates(mockUpdates);
                setStats(mockStats);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching updates:', error);
                setLoading(false);
            }
        }

        fetchUpdates();
    }, []);

    const UpdateCard = ({ update, isPublished }) => (
        <div className={`update-card ${isPublished ? 'published' : 'draft'}`}>
            {update.imageUrl && (
                <div className="update-image">
                    <img src={update.imageUrl} alt={update.title} />
                </div>
            )}
            <div className="update-content">
                <h4>{update.title}</h4>
                <p className="update-date">
                    Posted {new Date(update.postedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </p>
                <p className="update-text">{update.content}</p>
                {isPublished && (
                    <div className="update-engagement">
                        <span>❤️ {update.likes} Likes</span>
                        <span>💬 {update.comments} Comments</span>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return <div className="update-composer-page"><p>Loading...</p></div>;
    }

    return (
        <div className="update-composer-page">
            {!showComposer ? (
                <>
                    <div className="page-header">
                        <h1>Post an Update!</h1>
                        <p>Updates are your way to keep supporters connected to your journey. Share milestones, new challenges, photos, or announcements so the community knows how their contributions are making an impact.</p>
                    </div>

                    {updates.length > 0 && (
                        <div className="published-update">
                            <UpdateCard update={updates[0]} isPublished={true} />
                        </div>
                    )}

                    <div className="my-latest-section">
                        <h2>My Latest Update</h2>
                        {updates.length > 1 && (
                            <UpdateCard update={updates[1]} isPublished={false} />
                        )}
                    </div>

                    <div className="stats-box">
                        <h3>Latest Update Stats</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-bar">
                                    <div className="stat-fill" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        </div>
                        <p className="stats-text">
                            {stats.totalUpdates} Updates Posted | {stats.supportersReached} Supporters Reached | Avg. {stats.avgViews} Views per Update
                        </p>
                    </div>

                    <button onClick={() => setShowComposer(true)} className="compose-btn">
                        Compose an Update
                    </button>
                </>
            ) : (
                <ComposeUpdateForm onCancel={() => setShowComposer(false)} />
            )}
        </div>
    );
}

function ComposeUpdateForm({ onCancel }) {
    const [images, setImages] = useState([]);
    const [charCount, setCharCount] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        scheduleDate: ''
    });
    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...imageUrls].slice(0, 5));
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDescriptionChange = (e) => {
        const text = e.target.value;
        if (text.length <= 2000) {
            setFormData(prev => ({ ...prev, description: text }));
            setCharCount(text.length);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validation
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Mock form submission
        alert('Update posted successfully!');
        onCancel();
    };

    return (
        <form className="compose-update-form" onSubmit={handleSubmit}>
            <h2>Compose an Update</h2>

            <div className="form-field">
                <label htmlFor="title">Update Title <span className="required">*</span></label>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter update title"
                />
                {errors.title && <p className="error">{errors.title}</p>}
            </div>

            <div className="form-field">
                <label htmlFor="description">Description of Update <span className="required">*</span></label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    placeholder="Describe your update..."
                    rows="6"
                />
                <p className="char-count">{charCount} / 2000 chars</p>
                {errors.description && <p className="error">{errors.description}</p>}
            </div>

            <div className="form-field">
                <label htmlFor="tags">Tags / Category <span className="required">*</span></label>
                <input
                    id="tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., milestone, challenge, announcement"
                />
            </div>

            <div className="form-field">
                <label htmlFor="scheduleDate">Schedule Update <span className="required">*</span></label>
                <input
                    id="scheduleDate"
                    type="datetime-local"
                    value={formData.scheduleDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                />
            </div>

            <div className="form-field">
                <label>Images (up to 5)</label>
                <div className="image-upload-area">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        id="imageUpload"
                        hidden
                    />
                    <label htmlFor="imageUpload" className="upload-label">
                        <span className="upload-icon">📷 +</span>
                        <span>Add up to 5 images</span>
                    </label>
                </div>
                <div className="image-preview-grid">
                    {images.map((img, index) => (
                        <div key={index} className="image-preview">
                            <img src={img} alt={`Preview ${index + 1}`} />
                            <button type="button" onClick={() => removeImage(index)} className="remove-img-btn">×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="create-btn">Create</button>
                <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
            </div>
        </form>
    );
}
