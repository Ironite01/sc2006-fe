import { useState } from 'react';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    function onFormSubmit(e) {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!email.trim()) {
            setErrorMessage('ERROR MESSAGE');
            return;
        }

        setSuccessMessage('BLACK TEXT WHEN EMAIL SENT SUCCESS - OTHERWISE RED TEXT ERROR');
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
                    
                    <button type="submit" className="reset-button">
                        Reset password
                    </button>
                </form>                
            </div>
        </div>
    );
}
