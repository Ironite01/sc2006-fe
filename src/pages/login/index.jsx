import { useEffect, useState } from 'react';
import { profile, google } from '../../assets';
import getUser from '../../helpers/getUser';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../paths';
import './Login.css';
import { isEmailValid } from '../../helpers/regex';
import { toast } from 'react-toastify';
import SubmitButton from '../../components/SubmitButton';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        const form = e.target;
        const params = new URLSearchParams();
        const temp = form.username.value.trim();
        if (isEmailValid(temp))
            params.append("email", temp);
        else
            params.append("username", temp);
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
                toast.error(data.message || "Invalid username or password");
                return;
            }

            if (data.profilePicture) {
                localStorage.setItem('profilePicture', JSON.stringify(data.profilePicture));
                window.dispatchEvent(new Event("profileUpdated"));
            }

            navigate("/", { replace: true });
        } catch (error) {
            toast.error(`Login failed. You may had entered wrong username/email and/or password!`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <form className='signupForm' onSubmit={onFormSubmit}>
                <img src={profile} alt="Profile logo" />
                <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">Welcome Back</h2>

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

                    <SubmitButton
                        type="submit"
                        loading={loading}
                        className='bg-[#00bf63]'
                    >
                        Login
                    </SubmitButton>
                </div>

                <div className="divider">or continue with</div>

                <div className="oauth-buttons">
                    <a href={auth.googleLogin}>
                        <button type='button' className="google">
                            <img src={google} alt="Google" />
                            <span>Continue with Google</span>
                        </button>
                    </a>
                </div>

                <div className="signup-link">
                    Don't have an account? <a href="/signup">Sign up</a>
                </div>
            </form>
        </div>
    );
}