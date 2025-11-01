import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './editProfile.css';
import UserForm from '../../components/UserForm';
import { isEmailValid, isStrongPassword, isUsernameValid } from '../../helpers/regex';
import { user as userPath } from '../../../paths';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import fileToBase64 from '../../helpers/fileToBase64';
import getUser from '../../helpers/getUser';

export default function EditProfile() {
    const navigate = useNavigate();
    const [oldUserData, setOldUserData] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: '',
        currentPassword: '',
        password: '',
        cpassword: ''
    });
    const [currentPicture, setCurrentPicture] = useState(null);

    useEffect(() => {
        getUser_();
        const googleUser = Cookies.get('user');
        if (googleUser) {
            toast.error("Edit profile is not supported with Google accounts!");
            navigate("/");
            return;
        }
    }, []);

    useEffect(() => {
        if (oldUserData) {
            setFormData({
                username: oldUserData.username,
                email: oldUserData.email,
                role: oldUserData.role,
            });
            setCurrentPicture(oldUserData.profilePicture);
        }
    }, [oldUserData]);

    async function getUser_() {
        try {
            const user = await getUser();
            setOldUserData(user);
        } catch (e) {
            toast.error(e);
        }
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const { username, email, currentPassword, password, cpassword, profilePicture } = form;

        const usernameVal = username.value.trim();
        if (usernameVal === "") {
            toast.error("Username cannot be empty!");
            return;
        } else if (!isUsernameValid(usernameVal)) {
            toast.error("Username must be at least 5 characters long and have at least 5 alphabets");
            return;
        }

        const emailVal = email.value.trim();
        if (emailVal === "") {
            toast.error("Email cannot be empty!");
            return;
        } else if (!isEmailValid(emailVal)) {
            toast.error("You have entered an invalid email!");
            return;
        }

        const passwordVal = password.value;
        if (passwordVal === "") {
            toast.error("Password cannot be empty!");
            return;
        } else if (!isStrongPassword(passwordVal)) {
            toast.error("Password must be 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and one symbol!");
            return;
        }

        if (cpassword.value !== password.value) {
            toast.error("Confirm password mismatch with password!");
            return;
        }

        const formData = new FormData();
        formData.append('username', usernameVal);
        formData.append('email', emailVal);
        formData.append('currentPassword', currentPassword.value);
        formData.append('password', passwordVal);
        formData.append('profilePicture', profilePicture.files[0] || null);

        try {
            const res = await fetch(userPath.updateProfile(oldUserData.userId), {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });

            if (!res.ok) {
                toast.error("Something went wrong...");
                return;
            }
            toast.success("Profile updated successfully!");

            if (profilePicture.files[0]) {
                const base64Pic = await fileToBase64(profilePicture.files[0]);
                localStorage.setItem('profilePicture', `"${base64Pic}"`);
                window.dispatchEvent(new Event("profileUpdated"));
            }

            navigate("/");
        } catch (error) {
            toast.error("Update profile error.");
        }
    }

    return (
        <div className='form-container'>
            <UserForm title={<div className='form-title'>
                <h2>Update Profile</h2>
            </div>}
                updateMode={true}
                onFormSubmit={onFormSubmit}
                formData={formData}
                setFormData={setFormData}
                currentPicture={currentPicture}
                setCurrentPicture={setCurrentPicture}
                submitButtonLabel="Update Profile"
                submitButtonColor="#D97706" />
        </div>
    );
}