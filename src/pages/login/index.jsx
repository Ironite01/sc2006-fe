import { useEffect, useState } from 'react';
import { profile, google, microsoft } from '../../assets';
import getUser from '../../helpers/getUser';
import { useNavigate } from 'react-router-dom';
import { auth, shop } from '../../../paths';
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

    // async function redirectIfLoggedIn() {
    //     try {
    //         const user = await getUser();
    //         if (!user) return;

    //         const role = user.role?.toLowerCase();
    //         if (role === 'admin' || role === 'root') {
    //             navigate('/admin', { replace: true });
    //         } else {
    //             navigate('/', { replace: true });
    //         }
    //     } catch (e) {
    //         // if getUser fails, just stay on login page
    //         console.error('redirectIfLoggedIn error:', e);
    //     }
    // }

    async function redirectIfLoggedIn() {
        try {
            const user = await getUser();
            if (!user) return;

            const role = user.role?.toLowerCase();

            if (role === 'admin' || role === 'root') {
                navigate('/admin', { replace: true });
            } 
            // specifically check for business reps
            else if (role === 'business_representative') {
                await redirectBusinessRep();
            } 
            // everyone else (e.g. supporter) goes to home
            else {
                navigate('/', { replace: true });
            }
        } catch (e) {
            console.error('redirectIfLoggedIn error:', e);
        }
    }

    async function redirectBusinessRep() {
        try {
            const res = await fetch(shop.me, {
                method: "GET",
                credentials: "include",
            });

            if (res.status === 404) {
                // no shop yet
                navigate("/shop/create", { replace: true });
                return;
            }

            if (res.ok) {
                // has a shop
                navigate("/campaign", { replace: true });
                return;
            }

            // fallback
            navigate("/campaign", { replace: true });
        } catch (e) {
            console.error("redirectBusinessRep error:", e);
            navigate("/campaign", { replace: true });
        }
    }



    async function onFormSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const params = new URLSearchParams();
        const temp = form.username.value.trim();

        if (isEmailValid(temp)) {
            params.append('email', temp);
        } else {
            params.append('username', temp);
        }
        params.append('password', form.password.value);

        try {
            const res = await fetch(auth.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params,
                credentials: 'include'
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                toast.error(data.message || 'Invalid username or password');
                return;
            }

            if (data.profilePicture) {
                localStorage.setItem(
                    'profilePicture',
                    JSON.stringify(data.profilePicture)
                );
                window.dispatchEvent(new Event('profileUpdated'));
            }

            // After successful login, fetch user to check role
            let user = null;
            try {
                user = await getUser();
            } catch (err) {
                console.error('getUser after login failed:', err);
            }

            const role = user?.role?.toLowerCase();

            if (role === 'admin' || role === 'root') {
                navigate('/admin', { replace: true });
            } else if (role === 'business_representative') {
                await redirectBusinessRep();
            } else {
                navigate('/', { replace: true }); // supporter / fallback
            }

        } catch (error) {
            console.error('Login error:', error);
            toast.error(
                'Login failed. You may had entered wrong username/email and/or password!'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <form className="signupForm" onSubmit={onFormSubmit}>
                <img src={profile} alt="Profile logo" />
                <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
                    Welcome Back
                </h2>

                <div className="flex flex-col gap-y-[1rem]">
                    <input
                        id="username"
                        name="username"
                        placeholder="Email/username"
                        required
                        disabled={loading}
                    />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        disabled={loading}
                    />

                    <div className="forgot-password">
                        <a href="/forgot-password">Forgot password?</a>
                    </div>

                    <SubmitButton
                        type="submit"
                        loading={loading}
                        className="bg-[#00bf63]"
                    >
                        Login
                    </SubmitButton>
                </div>

                <div className="divider">or continue with</div>

                <div className="oauth-buttons">
                    <a href={auth.googleLogin}>
                        <button type="button" className="google">
                            <img src={google} alt="Google" />
                            <span>Continue with Google</span>
                        </button>
                    </a>
                    <a href={auth.azureLogin}>
                        <button type='button' className="google">
                            <img src={microsoft} alt="Microsoft" />
                            <span>Continue with Microsoft</span>
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
