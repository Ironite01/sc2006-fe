import { useEffect } from "react";
import getUser from "../../helpers/getUser";
import { USER_ROLES } from "../../helpers/constants";
import { useLocation, useNavigate } from "react-router-dom";

export default function RedirectPendingRoleUser() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        redirectPendingRoleUser();
    }, [navigate]);

    async function redirectPendingRoleUser() {
        const user = await getUser();
        if (user && user.role === USER_ROLES.PENDING_ROLE_SELECTION && location.pathname !== '/auth/callback') {
            navigate("/auth/callback", { replace: true });
        }
    }
}