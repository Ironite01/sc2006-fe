import { useState, useEffect } from 'react';
import './Signup.css';
import { isEmailValid, isStrongPassword, isUsernameValid } from '../../helpers/regex';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../paths';
import { toast } from 'react-toastify';
import UserForm from '../../components/UserForm';

export default function Signup() {
    const [currentPicture, setCurrentPicture] = useState(null);

    const access_token = Cookies.get('access_token');
    const navigate = useNavigate();

    useEffect(() => {
        if (access_token) navigate("/", { replace: true });
    }, [access_token]);

    async function onFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const { username, email, password, cpassword, role, profilePicture } = form;

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
        formData.append('password', passwordVal);
        formData.append('role', role.value);

        if (profilePicture.files[0]) {
            formData.append('profilePicture', profilePicture.files[0]);
        }

        try {
            const res = await fetch(auth.register, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!res.ok) {
                toast.error("Something went wrong...");
                return;
            }
            toast.success("Registration successful, you may now login!");
            navigate("/login");
        } catch (error) {
            toast.error("Registration error.");
        }
    }

    return (
        <div className='signup-container'>
            <UserForm currentPicture={currentPicture}
                updateMode={false}
                setCurrentPicture={setCurrentPicture}
                onFormSubmit={onFormSubmit}
                submitButtonLabel="Create Account"
                submitButtonColor="#00bf63"
                title={<div className='signup-form-title'>
                    <h2>Create Account</h2>
                    <p>Join us to support local businesses</p>
                </div>}
                children={<div className='login-link'>
                    Already have an account? <a href='/login'>Sign in</a>
                </div>} />
        </div>
    );
}