import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

export default function AuthCallback() {
    const navigate = useNavigate();
    const { instance } = useMsal();

    useEffect(() => {
        instance.handleRedirectPromise()
            .then((response) => {
                if (response) {
                    console.log("Authentication successful:", response);
                    navigate("/", { replace: true });
                } else {
                    console.log("No response from redirect");
                    navigate("/login", { replace: true });
                }
            })
            .catch((error) => {
                console.error("Authentication failed:", error);
                navigate("/login", { replace: true });
            });
    }, [instance, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>Processing Azure login...</p>
        </div>
    );
}
