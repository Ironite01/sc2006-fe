// src/helpers/RequireRole.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import getUser from "./getUser";

// Map DB roles to their landing pages
const landingByRole = {
  SUPPORTER: "/",
  BUSINESS_REPRESENTATIVE: "/campaign",
  ADMIN: "/admin",
};

export default function RequireRole({ allowedRoles, children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      const currentUser = await getUser(); // calls /auth/me and returns req.user or null
      if (isMounted) {
        setUser(currentUser);
        setLoading(false);
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // While we are still asking the backend who this is
  if (loading) {
    return <div>Loading...</div>;
  }

  // 1. Not logged in at all → go to login page
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // 2. Logged in but role is NOT allowed here
  if (!allowedRoles.includes(user.role)) {
    const landingPath = landingByRole[user.role] || "/";
    return <Navigate to={landingPath} replace />;
  }

  // 3. Logged in AND role is allowed → show the page
  return children;
}
