import { profile } from '../../assets';
import { useState, useEffect } from 'react';
import './Signup.css';
import { isEmailValid, isStrongPassword, isUsernameValid } from '../../helpers/regex';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../paths';
import { USER_ROLES } from '../../helpers/constants';
import SubmitButton from '../../components/SubmitButton';
import { toast } from 'react-toastify';

export default function Signup() {
    const [currentPicture, setCurrentPicture] = useState(null);

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
                    <input id="username" name="username" placeholder='Choose a username' />
                </div>

                <div className='form-field'>
                    <label>I am a: <span className='text-[#F54927]'>*</span></label>
                    <div className='radio-group'>
                        <div>
                            <input type="radio" id={USER_ROLES.SUPPORTER} name='role' defaultChecked value={USER_ROLES.SUPPORTER} />
                            <label htmlFor={USER_ROLES.SUPPORTER}>Supporter</label>
                        </div>
                        <div>
                            <input type="radio" id={USER_ROLES.BUSINESS_REPRESENTATIVE} name="role" value={USER_ROLES.BUSINESS_REPRESENTATIVE} />
                            <label htmlFor={USER_ROLES.BUSINESS_REPRESENTATIVE}>Business Representative</label>
                        </div>
                    </div>
                </div>

                <div className='form-field'>
                    <label htmlFor='email'>Email <span className='text-[#F54927]'>*</span></label>
                    <input id="email" name="email" type='email' placeholder='your@email.com' />
                </div>

                <div className='form-field'>
                    <label htmlFor='password'>Password <span className='text-[#F54927]'>*</span></label>
                    <input id="password" name="password" type='password' placeholder='Create a strong password' />
                </div>

                <div className='form-field'>
                    <label htmlFor='cpassword'>Confirm Password <span className='text-[#F54927]'>*</span></label>
                    <input id="cpassword" name="cpassword" type='password' placeholder='Confirm your password' />
                </div>

                <SubmitButton type="submit" className='bg-[#00bf63]'>Create Account</SubmitButton>

                <div className='login-link'>
                    Already have an account? <a href='/login'>Sign in</a>
                </div>
            </form>
        </div>
    );
}