import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const user = Cookies.get('user');
            const token = Cookies.get('access_token');

            if (user && token) {
                const userData = JSON.parse(user);
                if (userData.profilePicture) {
                    localStorage.setItem('profilePicture', JSON.stringify(userData.profilePicture));
                }
                window.dispatchEvent(new Event("profileUpdated"));
                navigate("/", { replace: true });
            } else {
                setTimeout(checkAuth, 100);
            }
        };

        checkAuth();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>Processing login...</p>
        </div>
    );
}
