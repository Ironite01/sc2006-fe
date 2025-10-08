import { useEffect, useState } from 'react';
import { profile, google, microsoft } from '../../assets';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../paths';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../config/authConfig';
import './Login.css';

export default function Login() {
    const user = Cookies.get('user');
    const navigate = useNavigate();
    const { instance } = useMsal();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate("/", { replace: true });
    }, [user]);

    async function handleAzureLogin() {
        try {
            await instance.loginRedirect(loginRequest);
        } catch (error) {
            console.error("Azure login error:", error);
            setError("Azure login failed. Please try again.");
        }
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = e.target;
        const params = new URLSearchParams();
        params.append("username", form.username.value.trim());
        params.append("password", form.password.value);

        try {
            const res = await fetch(auth.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params,
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Invalid username or password");
                setLoading(false);
                return;
            }

            if (data.profilePicture) {
                localStorage.setItem('profilePicture', JSON.stringify(data.profilePicture));
                window.dispatchEvent(new Event("profileUpdated"));
            }

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            setError("Network error. Please check your connection and try again.");
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <form className='signupForm' onSubmit={onFormSubmit}>
                <img src={profile} alt="Profile logo" />
                <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">Welcome Back</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className='flex flex-col gap-y-[1rem]'>
                    <input
                        id="username"
                        name="username"
                        placeholder='Email/username'
                        required
                        disabled={loading}
                    />
                    <input
                        id="password"
                        name="password"
                        type='password'
                        placeholder='Password'
                        required
                        disabled={loading}
                    />

                    <div className="forgot-password">
                        <a href="/forgot-password">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                <div className="divider">or continue with</div>

                <div className="oauth-buttons">
                    <a href='http://localhost:3000/login/google'>
                        <button type='button' className="google">
                            <img src={google} alt="Google" />
                            <span>Continue with Google</span>
                        </button>
                    </a>

                    <button
                        type='button'
                        className="azure"
                        onClick={handleAzureLogin}
                    >
                        <img src={microsoft} alt="Microsoft" />
                        <span>Continue with Microsoft</span>
                    </button>
                </div>

                <div className="signup-link">
                    Don't have an account? <a href="/signup">Sign up</a>
                </div>
            </form>
        </div>
    );
}