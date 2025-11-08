import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../paths';
import { toast } from 'react-toastify';
import { USER_ROLES } from '../../helpers/constants';
import SubmitButton from '../../components/SubmitButton';
import './RoleSelection.css';

export default function RoleSelection() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);

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
                navigate('/shop/create', { replace: true, state: { role: selectedRole } });
            } else {
                navigate('/', { replace: true, state: { role: selectedRole } });
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
