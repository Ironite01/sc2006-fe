import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { user } from '../../../paths';
import { isStrongPassword } from '../../helpers/regex';
import { toast } from 'react-toastify';
import './ResetPassword.css';
import SubmitButton from '../../components/SubmitButton';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    async function onFormSubmit(e) {
        e.preventDefault();
        const token = searchParams.get('token');
        if (!token) {
            toast.error("It appears that your link is broken! Try to send a reset again!");
            return;
        }

        const password = formData.password;
        const cpassword = formData.confirmPassword;
        if (!password || !cpassword) {
            toast.error("Password cannot be empty!");
            return;
        }
        if (password !== cpassword) {
            toast.error("Password and confirm password mismatch!");
            return;
        }
        if (!isStrongPassword(password)) {
            toast.error("Password must be 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and one symbol!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${user.updatePassword}?${new URLSearchParams({ token }).toString()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            if (!response.ok) {
                toast.error("Something went wrong... Please try again later!");
                return;
            }
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (error) {
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-form">
                <h1 className="reset-password-title">Reset Your Password</h1>

                <form onSubmit={onFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            New Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="form-input"
                            placeholder="Enter your new password"
                        />
                        <div className="field-info">
                            Password must be at least 8 characters long
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm New Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="form-input"
                            placeholder="Confirm your new password"
                        />
                    </div>

                    <SubmitButton type="submit" className="bg-[#ffa500]" loading={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </SubmitButton>
                </form>
            </div>
        </div>
    );
}
