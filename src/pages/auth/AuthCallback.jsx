import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const user = Cookies.get('user');
            const token = Cookies.get('access_token');
            const needsRoleSelection = Cookies.get('needs_role_selection');

            if (user && token) {
                const userData = JSON.parse(user);

                if (userData.profilePicture) {
                    localStorage.setItem('profilePicture', JSON.stringify(userData.profilePicture));
                }
                window.dispatchEvent(new Event("profileUpdated"));

                if (needsRoleSelection === 'true') {
                    Cookies.remove('needs_role_selection');
                    navigate("/auth/select-role", { replace: true });
                } else {
                    const role = userData.role?.toLowerCase();

                    if (role === 'admin' || role === 'root') {
                        navigate('/admin', { replace: true });
                    } else if (role === 'business_representative') {
                        navigate('/campaign', { replace: true });
                    } else {
                        navigate('/', { replace: true });
                    }
                }
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
