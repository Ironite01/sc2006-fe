import { useState, useEffect, useRef } from 'react';
import { profile } from '../assets';
import './Header.css';
import Searchbar from './Searchbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../paths';

export default function Header({ onSearch }) {
    const user = Cookies.get('user');
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = useState(profile);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user) {
            const userObj = JSON.parse(user)
            if (userObj?.picture) setProfilePicture(userObj.picture);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch(auth.logout, {
                method: 'POST',
                credentials: 'include'
            });
            Cookies.remove('user');
            Cookies.remove('token');
            localStorage.clear();
            sessionStorage.clear();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
            Cookies.remove('user');
            Cookies.remove('token');
            localStorage.clear();
            sessionStorage.clear();
            navigate('/login', { replace: true });
        }
    };

    const handleSwitchAccount = () => {
        handleLogout();
    };

    return <header className="place-content-center">
        <nav className="flex justify-between items-center">
            <nav className="flex order-1 gap-[0.5rem] items-center">
                <img src={profile} alt="App logo" className='h-[2.75rem] w-auto logo' />
                <a>Home</a>
                <a>Rewards</a>
                <a>Updates</a>
            </nav>
            <div className="flex order-2 items-center gap-[1.25rem]">
                <Searchbar onSearch={onSearch} />
                <div className="profile-dropdown-container" ref={dropdownRef}>
                    <img
                        src={profilePicture}
                        alt="Profile logo"
                        className='h-[2.75rem] w-[2.75rem] rounded-full profile'
                        referrerPolicy="no-referrer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                        <div className="profile-dropdown">
                            <button onClick={handleSwitchAccount} className="dropdown-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>Switch Account</span>
                            </button>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="dropdown-item logout">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    </header>
}