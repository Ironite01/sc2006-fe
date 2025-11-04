import { useState, useEffect } from 'react';
import { profile } from '../assets';
import './Header.css';
import Searchbar from './Searchbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import getUser from "../helpers/getUser";

export default function Header({ onSearch }) {
    const user = Cookies.get('user');
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = useState(profile);

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
                <img src={profile} alt="App logo" className='h-[2.75rem] w-auto logo' />
                <a className='no-underline hover:underline visited:no-underline' href='/'>Home</a>
                <a onClick={() => navigate("/rewards")}>Rewards</a>
                <a onClick={() => navigate("/updates")}>Updates</a>
            </nav>
            <div className="flex order-2 items-center gap-[1.25rem]">
                <Searchbar onSearch={onSearch} />
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