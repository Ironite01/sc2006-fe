import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../paths';
import { toast } from 'react-toastify';
import { USER_ROLES } from '../../helpers/constants';
import SubmitButton from '../../components/SubmitButton';
import getUser from '../../helpers/getUser';
import './RoleSelection.css';

export default function RoleSelection() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(USER_ROLES.SUPPORTER);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkUserRole();
    }, []);

    async function checkUserRole() {
        try {
            const user = await getUser();

            if (!user) {
                navigate('/login', { replace: true });
                return;
            }

            if (user.role !== null && user.role !== USER_ROLES.PENDING_ROLE_SELECTION) {
                const role = user.role?.toLowerCase();

                if (role === 'admin' || role === 'root') {
                    navigate('/admin', { replace: true });
                } else if (role === 'business_representative') {
                    navigate('/campaign', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }
        } catch (error) {
            console.error('Error checking user role:', error);
            navigate('/login', { replace: true });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(auth.selectRole, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: selectedRole }),
                credentials: 'include'
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || 'Failed to set role');
                return;
            }

            toast.success('Account setup complete!');

            if (selectedRole === USER_ROLES.BUSINESS_REPRESENTATIVE) {
                navigate('/shop/create', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Role selection error:', error);
            toast.error('Failed to set role. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="role-selection-container">
            <form className="role-selection-form" onSubmit={handleSubmit}>
                <h2>Complete Your Registration</h2>
                <p className="subtitle">Please select your role to continue</p>

                <div className="role-options">
                    <label className={`role-option ${selectedRole === USER_ROLES.SUPPORTER ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name="role"
                            value={USER_ROLES.SUPPORTER}
                            checked={selectedRole === USER_ROLES.SUPPORTER}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            disabled={loading}
                        />
                        <div className="role-content">
                            <h3>Supporter</h3>
                            <p>Support local businesses by contributing to campaigns</p>
                        </div>
                    </label>

                    <label className={`role-option ${selectedRole === USER_ROLES.BUSINESS_REPRESENTATIVE ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name="role"
                            value={USER_ROLES.BUSINESS_REPRESENTATIVE}
                            checked={selectedRole === USER_ROLES.BUSINESS_REPRESENTATIVE}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            disabled={loading}
                        />
                        <div className="role-content">
                            <h3>Business Representative</h3>
                            <p>Create and manage campaigns for your business</p>
                        </div>
                    </label>
                </div>

                <SubmitButton
                    type="submit"
                    loading={loading}
                    className="bg-[#00bf63]"
                >
                    Continue
                </SubmitButton>
            </form>
        </div>
    );
}
