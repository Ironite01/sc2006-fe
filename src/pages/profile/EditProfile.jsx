import { useState, useEffect } from 'react';
import { profile as defaultProfile } from '../../assets';
import { useNavigate } from 'react-router-dom';
import { isEmailValid, isStrongPassword, isUsernameValid } from '../../helpers/regex';
import './EditProfile.css';

export default function EditProfile() {
    const [currentPicture, setCurrentPicture] = useState(null);
    const [userType, setUserType] = useState('Supporter');
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [cpasswordError, setCpasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Load current user profile from local storage
        const storedPicture = localStorage.getItem('profilePicture');
        if (storedPicture) {
            setCurrentPicture(JSON.parse(storedPicture));
        }
    }, []);

    function onPictureChange(e) {
        const file = e.target.files[0];
        if (file) {
            setCurrentPicture(URL.createObjectURL(file));
        }
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setCpasswordError("");
        setLoading(true);

        const form = e.target;
        const { username, email, password, cpassword, profilePicture } = form;

        let hasError = false;

        // Validate username
        const usernameVal = username.value.trim();
        if (usernameVal && !isUsernameValid(usernameVal)) {
            setUsernameError("Username must be at least 5 characters long and have at least 5 alphabets");
            hasError = true;
        }

        // Validate email
        const emailVal = email.value.trim();
        if (emailVal && !isEmailValid(emailVal)) {
            setEmailError("You have entered an invalid email!");
            hasError = true;
        }

        // Validate password (only if provided)
        const passwordVal = password.value;
        if (passwordVal && !isStrongPassword(passwordVal)) {
            setPasswordError("Password must be 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and one symbol!");
            hasError = true;
        }

        // Validate confirm password
        if (passwordVal && cpassword.value !== passwordVal) {
            setCpasswordError("Confirm password mismatch with password!");
            hasError = true;
        }

        if (hasError) {
            setLoading(false);
            return;
        }

        const formData = new FormData();
        if (usernameVal) formData.append('username', usernameVal);
        if (emailVal) formData.append('email', emailVal);
        if (passwordVal) formData.append('password', passwordVal);
        if (profilePicture.files[0]) {
            formData.append('profilePicture', profilePicture.files[0]);
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock update - update local storage
        if (profilePicture.files[0]) {
            const newPicture = URL.createObjectURL(profilePicture.files[0]);
            localStorage.setItem('profilePicture', JSON.stringify(newPicture));
            window.dispatchEvent(new Event("profileUpdated"));
        }

        alert("Profile updated successfully!");
        setLoading(false);
        navigate("/", { replace: true });
    }

    return (
        <div className='edit-profile-container'>
            <form onSubmit={onFormSubmit} className='edit-profile-form'>
                <h2>Edit Profile</h2>

                <label htmlFor='profilePicture' className='profile-picture-label'>
                    <img
                        width={100}
                        height={100}
                        src={currentPicture || defaultProfile}
                        alt="Profile"
                        className='profile-image'
                    />
                    <span className='upload-icon'>+</span>
                </label>
                <input
                    type='file'
                    accept="image/png, image/jpeg"
                    id="profilePicture"
                    name="profilePicture"
                    onChange={onPictureChange}
                    hidden
                />

                <div className='form-field'>
                    <label htmlFor='username'>Username</label>
                    <input
                        id="username"
                        name="username"
                        placeholder='Enter new username (leave blank to keep current)'
                    />
                    {usernameError && <p className='error'>{usernameError}</p>}
                </div>

                <div className='form-field'>
                    <label>I am a:</label>
                    <div className='radio-group'>
                        <div>
                            <input
                                type="radio"
                                id="supporter"
                                name='user_type'
                                checked={userType === 'Supporter'}
                                onChange={() => setUserType('Supporter')}
                                value="Supporter"
                                disabled
                            />
                            <label htmlFor="supporter">Supporter</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="business_representative"
                                name="user_type"
                                checked={userType === 'business_representative'}
                                onChange={() => setUserType('business_representative')}
                                value="business_representative"
                                disabled
                            />
                            <label htmlFor="business_representative">Business Representative</label>
                        </div>
                    </div>
                </div>

                <div className='form-field'>
                    <label htmlFor='email'>Email</label>
                    <input
                        id="email"
                        name="email"
                        type='email'
                        placeholder='Enter new email (leave blank to keep current)'
                    />
                    {emailError && <p className='error'>{emailError}</p>}
                </div>

                <div className='form-field'>
                    <label htmlFor='password'>New Password</label>
                    <input
                        id="password"
                        name="password"
                        type='password'
                        placeholder='Enter new password (leave blank to keep current)'
                    />
                    {passwordError && <p className='error'>{passwordError}</p>}
                </div>

                <div className='form-field'>
                    <label htmlFor='cpassword'>Confirm New Password</label>
                    <input
                        id="cpassword"
                        name="cpassword"
                        type='password'
                        placeholder='Confirm new password'
                    />
                    {cpasswordError && <p className='error'>{cpasswordError}</p>}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                </button>

                <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
