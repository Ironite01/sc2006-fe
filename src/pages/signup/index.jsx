import { profile } from '../../assets';
import { useState, useEffect } from 'react';
import './Signup.css';
import { isEmailValid, isStrongPassword, isUsernameValid } from '../../helpers/regex';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../paths';

export default function Signup() {
    const [currentPicture, setCurrentPicture] = useState(null);
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [cpasswordError, setCpasswordError] = useState("");

    const user = Cookies.get('user');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/", { replace: true });
    }, [user]);

    function onPictureChange(e) {
        setCurrentPicture(URL.createObjectURL(e.target.files[0]));
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setCpasswordError("");

        const form = e.target;
        const { username, email, password, cpassword, user_type, profilePicture } = form;

        let hasError = false;

        const usernameVal = username.value.trim();
        if (usernameVal === "") {
            setUsernameError("Username cannot be empty!");
            hasError = true;
        } else if (!isUsernameValid(usernameVal)) {
            setUsernameError("Username must be at least 5 characters long and have at least 5 alphabets");
            hasError = true;
        }

        const emailVal = email.value.trim();
        if (emailVal === "") {
            setEmailError("Email cannot be empty!");
            hasError = true;
        } else if (!isEmailValid(emailVal)) {
            setEmailError("You have entered an invalid email!");
            hasError = true;
        }

        const passwordVal = password.value;
        if (passwordVal === "") {
            setPasswordError("Password cannot be empty!");
            hasError = true;
        } else if (!isStrongPassword(passwordVal)) {
            setPasswordError("Password must be 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and one symbol!");
            hasError = true;
        }

        if (cpassword.value !== password.value) {
            setCpasswordError("Confirm password mismatch with password!");
            hasError = true;
        }

        if (hasError) return;

        const formData = new FormData();
        formData.append('username', usernameVal);
        formData.append('email', emailVal);
        formData.append('password', passwordVal);
        formData.append('user_type', user_type.value);

        if (profilePicture.files[0]) {
            formData.append('profilePicture', profilePicture.files[0]);
        }

        try {
            const res = await fetch(auth.register, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.field === 'username') {
                    setUsernameError(data.message || "Username already exists");
                } else if (data.field === 'email') {
                    setEmailError(data.message || "Email already exists");
                } else {
                    alert(data.message || "Registration failed. Please try again.");
                }
                return;
            }

            if (data.profilePicture) {
                localStorage.setItem('profilePicture', JSON.stringify(data.profilePicture));
                window.dispatchEvent(new Event("profileUpdated"));
            }

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Registration error:", error);
            alert("Network error. Please check your connection and try again.");
        }
    }

    return (
        <div className='signup-container'>
            <form onSubmit={onFormSubmit} className='signupForm'>
                <div className='signup-form-title'>
                    <h2>Create Account</h2>
                    <p>Join us to support local businesses</p>
                </div>

                <label htmlFor='profilePicture' className='profilePicture'>
                    <img width={100} height={100} src={currentPicture || profile} alt="Profile logo" className='overflow-hidden rounded-[3rem]' />
                    <span className='bg-[#fff] p-[0.5rem] ml-[-1.5rem] rounded-[0.4rem]'>+</span>
                </label>
                <input type='file' accept="image/png, image/jpeg" id="profilePicture" name="profilePicture" onChange={onPictureChange} hidden />

                <div className='form-field'>
                    <label htmlFor='username'>Username <span className='text-[#F54927]'>*</span></label>
                    <input id="username" name="username" placeholder='Choose a username' required />
                    <p className='text-[#F54927] error'>{usernameError}</p>
                </div>

                <div className='form-field'>
                    <label>I am a: <span className='text-[#F54927]'>*</span></label>
                    <div className='radio-group'>
                        <div>
                            <input type="radio" id="supporter" name='user_type' defaultChecked value="Supporter" />
                            <label htmlFor="supporter">Supporter</label>
                        </div>
                        <div>
                            <input type="radio" id="business_representative" name="user_type" value="business_representative" />
                            <label htmlFor="business_representative">Business Representative</label>
                        </div>
                    </div>
                </div>

                <div className='form-field'>
                    <label htmlFor='email'>Email <span className='text-[#F54927]'>*</span></label>
                    <input id="email" name="email" type='email' placeholder='your@email.com' required />
                    <p className='text-[#F54927] error'>{emailError}</p>
                </div>

                <div className='form-field'>
                    <label htmlFor='password'>Password <span className='text-[#F54927]'>*</span></label>
                    <input id="password" name="password" type='password' placeholder='Create a strong password' required />
                    <p className='text-[#F54927] error'>{passwordError}</p>
                </div>

                <div className='form-field'>
                    <label htmlFor='cpassword'>Confirm Password <span className='text-[#F54927]'>*</span></label>
                    <input id="cpassword" name="cpassword" type='password' placeholder='Confirm your password' required />
                    <p className='text-[#F54927] error'>{cpasswordError}</p>
                </div>

                <button type="submit">Create Account</button>

                <div className='login-link'>
                    Already have an account? <a href='/login'>Sign in</a>
                </div>
            </form>
        </div>
    );
}