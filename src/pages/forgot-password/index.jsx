import { useState, useEffect } from 'react';
import { auth } from '../../../paths';
import { isEmailValid } from '../../helpers/regex';
import './ForgotPassword.css';
import { toast } from 'react-toastify';
import SubmitButton from '../../components/SubmitButton';
import getUser from '../../helpers/getUser';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        redirectIfLoggedIn();
    }, []);

    async function redirectIfLoggedIn() {
        if (await getUser()) {
            navigate("/", { replace: true });
        }
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        if (!email.trim()) {
            toast.error('Please enter your email or username');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${auth.forgotPassword}?${new URLSearchParams(
                isEmailValid(email.trim()) ? { email: email.trim() } : { username: email.trim() }
            ).toString()}`, {
                method: 'PUT'
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Password reset email sent successfully!');
                setEmail(''); // Clear the input on success
            } else {
                toast.error(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            toast.error(`Reset password failed... ${error}`);
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
                    </div>

                    <SubmitButton type="submit" className='bg-[#ffa500]' loading={isLoading}>
                        Reset password
                    </SubmitButton>

                    <div className="back-to-login">
                        Remember your password? <a href='/login'>Back to login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
