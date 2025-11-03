import { useEffect, useState } from "react";
import { admin } from "../../../../paths";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";
import "./AdminCampaign.css";

export default function AdminCampaign() {
    const [campaigns, setCampaigns] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' or 'comments'
    const [filterStatus, setFilterStatus] = useState('all');
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        isDangerous: false
    });

    useEffect(() => {
        fetchCampaigns();
        fetchComments();
    }, []);

    async function fetchCampaigns() {
        try {
            const url = filterStatus !== 'all'
                ? `${admin.campaigns}?status=${filterStatus}`
                : admin.campaigns;

            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error("Failed to fetch campaigns");
            }

            const { campaigns } = await res.json();
            setCampaigns(campaigns);
        } catch (error) {
            toast.error("Unable to fetch campaigns");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchComments() {
        try {
            const res = await fetch(admin.comments, {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error("Failed to fetch comments");
            }

            const { comments } = await res.json();
            setComments(comments);
        } catch (error) {
            toast.error("Unable to fetch comments");
            console.error(error);
        }
    }

    function handleStatusChange(campaignId, newStatus) {
        const statusLabels = {
            'approved': 'Approve',
            'suspended': 'Suspend',
            'rejected': 'Reject',
            'pending': 'Set to Pending'
        };

        setModalConfig({
            isOpen: true,
            title: `${statusLabels[newStatus]} Campaign`,
            message: `Are you sure you want to ${statusLabels[newStatus].toLowerCase()} this campaign?`,
            onConfirm: () => confirmStatusChange(campaignId, newStatus),
            isDangerous: newStatus === 'suspended' || newStatus === 'rejected'
        });
    }

    async function confirmStatusChange(campaignId, newStatus) {
        try {
            const res = await fetch(admin.updateCampaignStatus(campaignId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update campaign status");
            }

            toast.success(`Campaign status updated to ${newStatus}`);
            fetchCampaigns();
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    }

    function handleDeleteCampaign(campaignId, campaignName) {
        setModalConfig({
            isOpen: true,
            title: 'Delete Campaign',
            message: `Are you sure you want to DELETE campaign "${campaignName}"? This action cannot be undone and will delete all associated data.`,
            onConfirm: () => confirmDeleteCampaign(campaignId),
            isDangerous: true
        });
    }

    async function confirmDeleteCampaign(campaignId) {
        try {
            const res = await fetch(admin.deleteCampaign(campaignId), {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to delete campaign");
            }

            toast.success("Campaign deleted successfully");
            fetchCampaigns();
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    }

    function handleDeleteComment(commentId) {
        setModalConfig({
            isOpen: true,
            title: 'Delete Comment',
            message: 'Are you sure you want to delete this comment?',
            onConfirm: () => confirmDeleteComment(commentId),
            isDangerous: true
        });
    }

    async function confirmDeleteComment(commentId) {
        try {
            const res = await fetch(admin.deleteComment(commentId), {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to delete comment");
            }

            toast.success("Comment deleted successfully");
            fetchComments();
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    }

    const closeModal = () => {
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'approved': return 'status-badge status-approved';
            case 'pending': return 'status-badge status-pending';
            case 'suspended': return 'status-badge status-suspended';
            case 'rejected': return 'status-badge status-rejected';
            default: return 'status-badge';
        }
    };

    if (loading) {
        return (
            <div className="admin-campaign-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="admin-campaign-container">
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isDangerous={modalConfig.isDangerous}
            />

            <div className="admin-campaign-header">
                <h1>Manage Campaigns</h1>
                <div className="tabs">
                    <button
                        className={activeTab === 'campaigns' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('campaigns')}
                    >
                        Campaigns ({campaigns.length})
                    </button>
                    <button
                        className={activeTab === 'comments' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('comments')}
                    >
                        Comments ({comments.length})
                    </button>
                </div>
            </div>

            {activeTab === 'campaigns' && (
                <>
                    <div className="filter-controls">
                        <label>Filter by Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setTimeout(() => fetchCampaigns(), 0);
                            }}
                            className="status-filter"
                        >
                            <option value="all">All</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="campaigns-table-container">
                        <table className="campaigns-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Creator</th>
                                    <th>Goal</th>
                                    <th>Raised</th>
                                    <th>Progress</th>
                                    <th>Status</th>
                                    <th>End Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map((campaign) => (
                                    <tr key={campaign.campaignId}>
                                        <td>{campaign.campaignId}</td>
                                        <td>
                                            {campaign.imageBlob ? (
                                                <img
                                                    src={campaign.imageBlob}
                                                    alt={campaign.name}
                                                    className="campaign-image"
                                                />
                                            ) : (
                                                <div className="campaign-image-placeholder">No Image</div>
                                            )}
                                        </td>
                                        <td>
                                            <strong>{campaign.name}</strong>
                                            <br/>
                                            <small>{campaign.description?.substring(0, 50)}...</small>
                                        </td>
                                        <td>{campaign.creatorUsername || `User ${campaign.userId}`}</td>
                                        <td>{formatCurrency(campaign.goal)}</td>
                                        <td>{formatCurrency(campaign.amtRaised || 0)}</td>
                                        <td>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{width: `${Math.min(campaign.progress || 0, 100)}%`}}
                                                ></div>
                                                <span className="progress-text">{campaign.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getStatusBadgeClass(campaign.status)}>
                                                {campaign.status}
                                            </span>
                                        </td>
                                        <td>{new Date(campaign.endDate).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <select
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleStatusChange(campaign.campaignId, e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    className="action-select"
                                                    defaultValue=""
                                                >
                                                    <option value="">Change Status...</option>
                                                    {campaign.status !== 'approved' && <option value="approved">Approve</option>}
                                                    {campaign.status !== 'suspended' && <option value="suspended">Suspend</option>}
                                                    {campaign.status !== 'rejected' && <option value="rejected">Reject</option>}
                                                    {campaign.status !== 'pending' && <option value="pending">Set Pending</option>}
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteCampaign(campaign.campaignId, campaign.name)}
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {campaigns.length === 0 && (
                            <div className="no-data">No campaigns found</div>
                        )}
                    </div>
                </>
            )}

            {activeTab === 'comments' && (
                <div className="comments-table-container">
                    <table className="comments-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Campaign</th>
                                <th>Comment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment) => (
                                <tr key={comment.commentId}>
                                    <td>{comment.commentId}</td>
                                    <td>
                                        <div className="user-info">
                                            {comment.profilePicture ? (
                                                <img
                                                    src={comment.profilePicture}
                                                    alt={comment.username}
                                                    className="user-avatar"
                                                />
                                            ) : (
                                                <div className="user-avatar-placeholder">
                                                    {comment.username?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span>{comment.username}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{comment.campaignName}</strong>
                                        <br/>
                                        <small>Campaign #{comment.campaignId}</small>
                                    </td>
                                    <td className="comment-text">{comment.comment}</td>
                                    <td>{formatDate(comment.createdAt)}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteComment(comment.commentId)}
                                            className="delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {comments.length === 0 && (
                        <div className="no-data">No comments found</div>
                    )}
                </div>
            )}
        </div>
    );
}