import { useState } from 'react';
import { auth } from '../../../paths';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function onFormSubmit(e) {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!email.trim()) {
            setErrorMessage('Please enter your email or username');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(auth.forgotPassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailOrUsername: email.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Password reset email sent successfully!');
                setEmail(''); // Clear the input on success
            } else {
                setErrorMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h1 className="forgot-password-title">Forgot password:</h1>
                
                <form onSubmit={onFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Please enter your email or username:
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="Enter your email or username"
                        />
                        
                        <p className="help-text">
                            Some message when username requests for password reset{' '}
                            <span className="help-text-link">or some error if any</span>
                        </p>
                        
                        {errorMessage && (
                            <p className="error-message">{errorMessage}</p>
                        )}
                        
                        {successMessage && (
                            <p className="success-message">{successMessage}</p>
                        )}
                    </div>
                    
                    <button type="submit" className="reset-button" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Reset password'}
                    </button>

                    <div className="back-to-login">
                        Remember your password? <a href='/login'>Back to login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
