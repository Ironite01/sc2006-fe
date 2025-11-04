import { useEffect, useState } from "react";
import { admin } from "../../../../paths";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";
import "./AdminUsers.css";
import getUser from "../../../helpers/getUser";
import { USER_ROLES } from "../../../helpers/constants";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDangerous: false
    });

    useEffect(() => {
        authorize();
        fetchUsers();
    }, []);

    async function authorize() {
        const user = await getUser();
        if (!user || user.role !== USER_ROLES.ADMIN) {
            toast.error("This page is only for business representatives!");
            navigate("/", { replace: true });
        }
    }

    async function fetchUsers() {
        try {
            const res = await fetch(admin.users, {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }

            const { users } = await res.json();
            setUsers(users);
        } catch (error) {
            toast.error("Unable to fetch users");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleRoleChange(userId, newRole) {
        setModalConfig({
            isOpen: true,
            title: 'Change User Role',
            message: `Are you sure you want to change this user's role to ${newRole}?`,
            onConfirm: () => confirmRoleChange(userId, newRole),
            isDangerous: false
        });
    }

    async function confirmRoleChange(userId, newRole) {
        try {
            const res = await fetch(admin.updateUserRole(userId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ role: newRole })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update user role");
            }

            toast.success("User role updated successfully");
            fetchUsers();
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    }

    function handleDeleteUser(userId, username) {
        setModalConfig({
            isOpen: true,
            title: 'Delete User',
            message: `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
            onConfirm: () => confirmDeleteUser(userId),
            isDangerous: true
        });
    }

    async function confirmDeleteUser(userId) {
        try {
            const res = await fetch(admin.deleteUser(userId), {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to delete user");
            }

            toast.success("User deleted successfully");
            fetchUsers();
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

    if (loading) {
        return (
            <div className="admin-users-container">
                <div className="loading">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="admin-users-container">
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isDangerous={modalConfig.isDangerous}
            />

            <div className="admin-users-header">
                <h1>Manage Users</h1>
                <p>Total Users: {users.length}</p>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Profile</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>
                                    {user.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className="user-profile-pic"
                                        />
                                    ) : (
                                        <div className="user-profile-placeholder">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="SUPPORTER">Supporter</option>
                                        <option value="BUSINESS_REPRESENTATIVE">Business Representative</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteUser(user.userId, user.username)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
