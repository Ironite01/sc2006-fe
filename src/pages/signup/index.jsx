import { profile } from '../../assets';
import { useState, useEffect } from 'react';
import './Signup.css';
import { isEmailValid, isStrongPassword, isUsernameValid } from '../../helpers/regex';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

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

    function onFormSubmit(e) {
        e.preventDefault();
        alert("Currently disabled!");
        return;
    }

    function onPictureChange(e) {
        setCurrentPicture(URL.createObjectURL(e.target.files[0]));
    }

    function onFormSubmit(e) {
        e.preventDefault();
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setCpasswordError("");

        const { username, password, cpassword, user_type } = e.target.form;

        const usernameVal = username.value.trim()
        if (usernameVal === "") {
            setUsernameError("Username cannot be empty!");
        } else if (!isUsernameValid(usernameVal)) {
            setUsernameError("Username must be at least 5 characters long and have at least 5 alphabets");
        }

        const emailVal = email.value.trim();
        if (emailVal === "") {
            setEmailError("Email cannot be empty!");
        } else if (!isEmailValid(emailVal)) {
            setEmailError("You have entered an invalid email!");
        }

        const passwordVal = password.value;
        if (passwordVal === "") {
            setPasswordError("Password cannot be empty!");
        } else if (!isStrongPassword(passwordVal)) {
            setPasswordError("Password must be 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and one symbol!")
        }

        if (cpassword.value !== password.value) {
            setCpasswordError("Confirm password mismatch with password!");
        }

        // TODO: Send data to backend
        return;
    }

    return (<form onSubmit={onFormSubmit} className='signupForm flex flex-col place-items-center'>
        <label htmlFor='profilePicture' className='profilePicture overflow-hidden'>
            <img width={100} height={100} src={currentPicture || profile} alt="Profile logo" className='overflow-hidden rounded-[3rem]' />
            <span className='bg-[#fff] p-[0.5rem] ml-[-1.5rem] rounded-[0.4rem]'>+</span>
        </label>
        <input type='file' accept="image/png, image/jpeg" id="profilePicture" name="profilePicture" onChange={onPictureChange} hidden />
        <div className='flex flex-col'>
            <div>
                <div className='flex flex-row pt-[2rem]'>
                    <label htmlFor='username'>Username</label>
                    <p className='text-[#F54927]'>*</p>
                </div>
                <input className='w-[100%]' id="username" name="username" required></input>
                <p className='text-[#F54927] pt-[0.5rem]'>{usernameError}</p>
            </div>
            <div>
                <div className='flex flex-row pt-[2rem]'>
                    <p>I am a:</p>
                    <p className='text-[#F54927]'>*</p>
                </div>
                <div>
                    <input type="radio" id="supporter" name='user_type' defaultChecked value="Supporter" />
                    <label className='pl-[0.5rem] pr-[3rem]' htmlFor="supporter">Supporter</label>
                    <input type="radio" id="business_representative" name="user_type" value="business_representative" />
                    <label className='pl-[0.5rem]' htmlFor="business_representative">Business Representative</label><br />
                </div>
            </div>
            <div>
                <div className='flex flex-row pt-[1rem]'>
                    <label htmlFor='email'>Email</label>
                    <p className='text-[#F54927]'>*</p>
                </div>
                <input className='w-[100%]' id="email" name="email" required></input>
                <p className='text-[#F54927] pt-[0.5rem]'>{emailError}</p>
            </div>
            <div>
                <div className='flex flex-row pt-[1rem]'>
                    <label htmlFor='password'>Password</label>
                    <p className='text-[#F54927]'>*</p>
                </div>
                <input className='w-[100%]' id="password" name="password" required></input>
                <p className='text-[#F54927] pt-[0.5rem]'>{passwordError}</p>
            </div>
            <div>
                <div className='flex flex-row pt-[1rem]'>
                    <label htmlFor='cpassword'>Confirm Password</label>
                    <p className='text-[#F54927]'>*</p>
                </div>
                <input className='w-[100%]' id="cpassword" name="cpassword" required></input>
                <p className='text-[#F54927] pt-[0.5rem]'>{cpasswordError}</p>
            </div>
            <button type="submit" className='bg-[#00bf63] text-[#fff] mt-[3rem] place-self-end text-[1.2rem]' onClick={onFormSubmit}>Sign up</button>
        </div>
    </form >);
}