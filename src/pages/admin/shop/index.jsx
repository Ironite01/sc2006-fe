import { useEffect, useState } from "react";
import { admin } from "../../../../paths";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";
import "./AdminShop.css";
import { useNavigate } from "react-router-dom";

const SHOP_STATUS = {
    PENDING: "pending",
    VERIFIED: "verified",
    REJECTED: "rejected",
};

export default function AdminShop() {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
        isDangerous: false,
    });

    useEffect(() => {
        fetchShops();
    }, [filterStatus]);

    async function fetchShops() {
        try {
            const url =
                filterStatus !== "ALL"
                    ? admin.getShopsByStatus(filterStatus)
                    : admin.getAllShops();

            const res = await fetch(url, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch shops");

            const { shops } = await res.json();

            // no mapping needed – we already use pending / verified / rejected
            setShops(shops);
        } catch (err) {
            console.error(err);
            toast.error("Unable to fetch shops");
        } finally {
            setLoading(false);
        }
    }

    function handleStatusChange(shopId, newStatus) {
        const labels = {
            [SHOP_STATUS.VERIFIED]: "Verify",
            [SHOP_STATUS.REJECTED]: "Reject",
            [SHOP_STATUS.PENDING]: "Set to Pending",
        };

        setModalConfig({
            isOpen: true,
            title: `${labels[newStatus]} Shop`,
            message: `Are you sure you want to ${labels[
                newStatus
            ].toLowerCase()} this shop?`,
            onConfirm: () => confirmStatusChange(shopId, newStatus),
            isDangerous: newStatus === SHOP_STATUS.REJECTED, // only reject is "dangerous"
        });
    }

    async function confirmStatusChange(shopId, newStatus) {
        try {
            const res = await fetch(admin.updateShopStatus(shopId), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update shop status");
            }

            toast.success(`Shop status updated to ${newStatus}`);
            fetchShops();
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        }
    }

    function handleDeleteShop(shopId, shopName) {
        setModalConfig({
            isOpen: true,
            title: "Delete Shop",
            message: `Are you sure you want to DELETE shop "${shopName}"? This action cannot be undone.`,
            onConfirm: () => confirmDeleteShop(shopId),
            isDangerous: true,
        });
    }

    async function confirmDeleteShop(shopId) {
        try {
            const res = await fetch(admin.deleteShop(shopId), {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to delete shop");
            }

            toast.success("Shop deleted successfully");
            fetchShops();
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        }
    }

    const closeModal = () =>
        setModalConfig((prev) => ({ ...prev, isOpen: false }));

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case SHOP_STATUS.VERIFIED:
                return "status-badge status-approved"; // reuse green style
            case SHOP_STATUS.PENDING:
                return "status-badge status-pending";
            case SHOP_STATUS.REJECTED:
                return "status-badge status-rejected";
            default:
                return "status-badge";
        }
    };

    if (loading) {
        return (
            <div className="admin-campaign-container">
                <div className="loading">Loading shops...</div>
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
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="status-filter"
                >
                    <option value="ALL">ALL</option>
                    {Object.values(SHOP_STATUS).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            <div className="campaigns-table-container">
                <table className="campaigns-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shops.map((shop) => (
                            <tr key={shop.id}>
                                <td>{shop.id}</td>
                                <td>
                                    {shop.image ? (
                                        <img
                                            src={shop.image}
                                            alt={shop.name}
                                            className="campaign-image"
                                        />
                                    ) : (
                                        <div className="campaign-image-placeholder">
                                            No Image
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <strong>{shop.name}</strong>
                                    <br />
                                    <small>{shop.description}</small>
                                </td>
                                <td>
                                    {shop.ownerUsername || `User ${shop.userId}`}
                                </td>
                                <td>
                                    <span className={getStatusBadgeClass(shop.status)}>
                                        {shop.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <select
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    handleStatusChange(
                                                        shop.id,
                                                        e.target.value
                                                    );
                                                    e.target.value = "";
                                                }
                                            }}
                                            className="action-select"
                                            defaultValue=""
                                        >
                                            <option value="">Change Status...</option>
                                            {shop.status !== SHOP_STATUS.VERIFIED && (
                                                <option value={SHOP_STATUS.VERIFIED}>
                                                    Verify
                                                </option>
                                            )}
                                            {shop.status !== SHOP_STATUS.REJECTED && (
                                                <option value={SHOP_STATUS.REJECTED}>
                                                    Reject
                                                </option>
                                            )}
                                            {shop.status !== SHOP_STATUS.PENDING && (
                                                <option value={SHOP_STATUS.PENDING}>
                                                    Set Pending
                                                </option>
                                            )}
                                        </select>
                                        <button
                                            onClick={() =>
                                                handleDeleteShop(
                                                    shop.id,
                                                    shop.name
                                                )
                                            }
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

                {shops.length === 0 && (
                    <div className="no-data">No shops found</div>
                )}
            </div>
        </div>
    );
}
