import { toast } from 'react-toastify';
import './updateComposerModal.css';
import { useState, useEffect } from "react";
import { updates } from '../../../../paths';

export default function UpdateComposerModal({ isOpen, onClose, selectedCampaignId, selectedCampaignName, update = null }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null,
    });

    useEffect(() => {
        if (update) {
            setFormData({
                title: update?.title || "",
                description: update?.description || "",
                image: null
            });
        }
    }, [update]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setFormData((prev) => ({ ...prev, image: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            alert("Please fill in all required fields.");
            return;
        }

        const _formData = new FormData();
        _formData.append('title', formData.title);
        _formData.append('description', formData.description);
        if (formData.image) _formData.append('image', formData.image);

        let res;
        if (update) {
            res = await fetch(updates.getById(selectedCampaignId, update.updateId), {
                method: 'PUT',
                credentials: 'include',
                body: _formData
            });
        } else {
            res = await fetch(updates.getAllByCampaignId(selectedCampaignId), {
                method: 'POST',
                credentials: 'include',
                body: _formData
            });
        }
        if (!res.ok) {
            toast.error("Something went wrong...");
            return;
        }
        location.reload();
    };

    if (!isOpen) return null;

    function handleClose() {
        onClose();
        setFormData({
            title: '',
            description: '',
            image: null,
        })
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">{update ? 'Edit' : 'Compose'} Update</h2>
                {selectedCampaignName && <>
                    <p><b>Selected campaign: </b>{selectedCampaignName}</p><br /></>}
                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Title*</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter update title"
                            maxLength={100}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description*</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write your campaign update..."
                            className="form-textarea"
                            rows={5}
                            required
                        />
                    </div>

                    {/* File Upload */}
                    <div className="form-group">
                        <label htmlFor="updateImage" className="form-label">Upload Image</label>
                        <input
                            id="updateImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-file"
                        />

                        {formData.image && (
                            <div className="image-preview">
                                <img
                                    src={URL.createObjectURL(formData.image)}
                                    alt="Preview"
                                    className="preview-img"
                                />
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {update ? 'Edit' : 'Post'} Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}