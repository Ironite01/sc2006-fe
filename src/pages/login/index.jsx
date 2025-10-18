import { useEffect, useState } from 'react';
import { profile, google, microsoft } from '../../assets';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const user = Cookies.get('user');
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate("/", { replace: true });
    }, [user]);

    function handleAzureLogin() {
        // Mock OAuth login - create a mock user and set cookie
        const mockUser = {
            id: '1',
            username: 'microsoft_user',
            email: 'user@microsoft.com',
            user_type: 'Supporter',
            picture: 'https://via.placeholder.com/150'
        };

        Cookies.set('user', JSON.stringify(mockUser), { expires: 7 });
        localStorage.setItem('profilePicture', JSON.stringify(mockUser.picture));
        window.dispatchEvent(new Event("profileUpdated"));
        navigate("/", { replace: true });
    }

    function handleGoogleLogin() {
        // Mock OAuth login - create a mock user and set cookie
        const mockUser = {
            id: '2',
            username: 'google_user',
            email: 'user@gmail.com',
            user_type: 'Supporter',
            picture: 'https://via.placeholder.com/150'
        };

        Cookies.set('user', JSON.stringify(mockUser), { expires: 7 });
        localStorage.setItem('profilePicture', JSON.stringify(mockUser.picture));
        window.dispatchEvent(new Event("profileUpdated"));
        navigate("/", { replace: true });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = e.target;
        const username = form.username.value.trim();
        const password = form.password.value;

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock authentication - accept any username/password for demo
        if (username && password) {
            const mockUser = {
                id: '3',
                username: username,
                email: `${username}@example.com`,
                user_type: 'Supporter',
                picture: 'https://via.placeholder.com/150'
            };

            Cookies.set('user', JSON.stringify(mockUser), { expires: 7 });
            localStorage.setItem('profilePicture', JSON.stringify(mockUser.picture));
            window.dispatchEvent(new Event("profileUpdated"));

            navigate("/", { replace: true });
        } else {
            setError("Please enter both username and password");
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
                    <button type='button' className="google" onClick={handleGoogleLogin}>
                        <img src={google} alt="Google" />
                        <span>Continue with Google</span>
                    </button>

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