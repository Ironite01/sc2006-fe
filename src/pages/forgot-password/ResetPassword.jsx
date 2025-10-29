import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../../../paths';
import './ResetPassword.css';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    const token = searchParams.get('token');

    useEffect(() => {
        // Check if token exists in URL
        if (!token) {
            setErrorMessage('Invalid or missing reset token. Please request a new password reset.');
            setTokenValid(false);
        }
    }, [token]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear errors when user starts typing
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    const validateForm = () => {
        if (!formData.password) {
            setErrorMessage('Please enter a new password');
            return false;
        }
        
        if (formData.password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long');
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            return false;
        }
        
        return true;
    };

    async function onFormSubmit(e) {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(auth.resetPassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Password reset successfully!');
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setErrorMessage(data.message || 'Failed to reset password. Please try again.');
                if (response.status === 400 && data.message?.includes('token')) {
                    setTokenValid(false);
                }
            }
        } catch (error) {
            setErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    }

    if (!tokenValid) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-form">
                    <h1 className="reset-password-title">Invalid Reset Link</h1>
                    <div className="error-message">
                        This password reset link is invalid or has expired. 
                        Please request a new password reset.
                    </div>
                    <button 
                        onClick={() => navigate('/forgot-password')} 
                        className="reset-button"
                    >
                        Request New Reset
                    </button>
                </div>
            </div>
        );
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
                            required
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
                            required
                        />
                    </div>
                    
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}
                    
                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                            <br />
                            <small>Redirecting to login page in 3 seconds...</small>
                        </div>
                    )}
                    
                    <button type="submit" className="reset-button" disabled={isLoading || successMessage}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <div className="back-to-login">
                        Remember your password? <a href='/login'>Back to login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
