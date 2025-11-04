import { useState, useEffect } from 'react';
import { profile, logo } from '../assets';
import './Header.css';
import Searchbar from './Searchbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import getUser from "../helpers/getUser";
import { USER_ROLES } from '../helpers/constants';
import { useLocation } from 'react-router-dom';

export default function Header({ onSearch }) {
    const user = Cookies.get('user');
    const navigate = useNavigate();
    const location = useLocation();
    const [profilePicture, setProfilePicture] = useState(profile);
    const [userRole, setUserRole] = useState(USER_ROLES.SUPPORTER);

    useEffect(() => {
        getRole();
    }, []);

    async function getRole() {
        const user = await getUser();
        if (!user) return;
        setUserRole(user.role);
    }

    useEffect(() => {
        if (user) {
            const userObj = JSON.parse(user);
            if (userObj?.picture) setProfilePicture(userObj.picture);
        } else {
            setProfilePicture(profile);
        }
    }, [user]);

    useEffect(() => {
        const handler = () => {
            const stored = localStorage.getItem("profilePicture");
            if (stored) setProfilePicture(JSON.parse(stored));
        };
        window.addEventListener("profileUpdated", handler);
        handler();
        return () => window.removeEventListener("profileUpdated", handler);
    }, []);

    return <header className="place-content-center">
        <nav className="flex justify-between items-center">
            <nav className="flex order-1 gap-[0.5rem] items-center">
                <img src={logo} alt="App logo" className='h-[2.75rem] w-auto logo rounded-full' />
                <a className='no-underline hover:underline visited:no-underline' href='/'>Home</a>
                <a onClick={() => navigate("/map")}>Map</a>
                {userRole === USER_ROLES.SUPPORTER && <>
                    <a onClick={() => navigate("/rewards")}>Rewards</a>
                    <a onClick={() => navigate("/updates")}>Updates</a>
                </>}
                {userRole === USER_ROLES.BUSINESS_REPRESENTATIVE && <>
                    <a onClick={() => navigate("/campaign")}>Campaign Manager</a>
                    <a onClick={() => navigate("/updates/new")}>Update Composer</a>
                </>}
                {userRole === USER_ROLES.ADMIN && <>
                    <a onClick={() => navigate("/admin/dataset")}>Datasets</a>
                    <a onClick={() => navigate("/admin/users")}>Users Management</a>
                    <a onClick={() => navigate("/admin/campaign")}>Campaign Management</a>
                    <a onClick={() => navigate("/admin/shop")}>Shop Management</a>
                </>}
            </nav>
            <div className="flex order-2 items-center gap-[1.25rem]">
                {location.pathname === '/' && <Searchbar onSearch={onSearch} />}
                <img
                    src={profilePicture}
                    alt="Profile logo"
                    className='h-[2.75rem] w-[2.75rem] rounded-full profile cursor-pointer'
                    referrerPolicy="no-referrer"
                    onClick={async () => await getUser() ? navigate('/profile') : navigate('/login')}
                />
            </div>
        </nav>
    </header>
}