import { useEffect, useState } from "react";
import { campaigns as campaignsPath, admin } from "../../../../paths";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";
import "./AdminCampaign.css";
import { CAMPAIGNS_STATUS } from "../../../helpers/constants";

export default function AdminCampaign() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDangerous: false
    });

    useEffect(() => {
        fetchCampaigns();
    }, [filterStatus]);

    async function fetchCampaigns() {
        try {
            const url = filterStatus !== 'ALL'
                ? `${campaignsPath.get}?status=${filterStatus}`
                : campaignsPath.get;

            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error("Failed to fetch campaigns");
            }

            const { campaigns, pagination } = await res.json();
            setCampaigns(campaigns);
            setPaginationInfo(pagination);
        } catch (error) {
            toast.error("Unable to fetch campaigns");
        } finally {
            setLoading(false);
        }
    }

    function handleStatusChange(campaignId, newStatus) {
        const statusLabels = {
            [CAMPAIGNS_STATUS.APPROVED.toLowerCase()]: 'Approve',
            [CAMPAIGNS_STATUS.SUSPENDED.toLowerCase()]: 'Suspend',
            [CAMPAIGNS_STATUS.REJECTED.toLowerCase()]: 'Reject',
            [CAMPAIGNS_STATUS.PENDING.toLowerCase()]: 'Set to Pending'
        };

        setModalConfig({
            isOpen: true,
            title: `${statusLabels[newStatus]} Campaign`,
            message: `Are you sure you want to ${statusLabels[newStatus].toLowerCase()} this campaign?`,
            onConfirm: () => confirmStatusChange(campaignId, newStatus),
            isDangerous: newStatus === CAMPAIGNS_STATUS.SUSPENDED || newStatus === CAMPAIGNS_STATUS.REJECTED
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

    const closeModal = () => {
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case CAMPAIGNS_STATUS.APPROVED: return 'status-badge status-approved';
            case CAMPAIGNS_STATUS.PENDING: return 'status-badge status-pending';
            case CAMPAIGNS_STATUS.SUSPENDED: return 'status-badge status-suspended';
            case CAMPAIGNS_STATUS.REJECTED: return 'status-badge status-rejected';
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
                    <option value="ALL">ALL</option>
                    {Object.values(CAMPAIGNS_STATUS).map(status =>
                        <option key={status} value={status}>{status.toUpperCase()}</option>
                    )}
                </select>
            </div>

            <div className="campaigns-table-container">
                <table className="campaigns-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>User</th>
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
                            <tr key={campaign.id}>
                                <td>{campaign.id}</td>
                                <td>
                                    {campaign.image ? (
                                        <img
                                            src={campaign.image}
                                            alt={campaign.name}
                                            className="campaign-image"
                                        />
                                    ) : (
                                        <div className="campaign-image-placeholder">No Image</div>
                                    )}
                                </td>
                                <td>
                                    <strong>{campaign.name}</strong>
                                    <br />
                                    <small>{campaign.description?.substring(0, 50)}...</small>
                                </td>
                                <td>{campaign.creatorUsername || `User ${campaign.userId}`}</td>
                                <td>{formatCurrency(campaign.goal)}</td>
                                <td>{formatCurrency(campaign.amtRaised || 0)}</td>
                                <td>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${Math.min(campaign.progress || 0, 100)}%` }}
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
                                                console.log(e.target.value);
                                                if (e.target.value) {
                                                    handleStatusChange(campaign.id, e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                            className="action-select"
                                            defaultValue=""
                                        >
                                            <option value="">Change Status...</option>
                                            {campaign.status !== CAMPAIGNS_STATUS.APPROVED && <option value={CAMPAIGNS_STATUS.APPROVED}>Approve</option>}
                                            {campaign.status !== CAMPAIGNS_STATUS.SUSPENDED && <option value={CAMPAIGNS_STATUS.SUSPENDED}>Suspend</option>}
                                            {campaign.status !== CAMPAIGNS_STATUS.REJECTED && <option value={CAMPAIGNS_STATUS.REJECTED}>Reject</option>}
                                            {campaign.status !== CAMPAIGNS_STATUS.PENDING && <option value={CAMPAIGNS_STATUS.PENDING}>Set Pending</option>}
                                        </select>
                                        <button
                                            onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
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
        </div>
    );
}