import { useEffect } from 'react';
import { profile } from '../../assets';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const user = Cookies.get('user');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/", { replace: true });
    }, [user]);

    function onFormSubmit(e) {
        e.preventDefault();
    }

    return (<form onSubmit={onFormSubmit} className='signupForm flex flex-col place-items-center'>
        <img width={100} height={100} src={profile} alt="Profile logo" className='mb-[2rem] overflow-hidden rounded-[3rem]' />
        <div className='flex flex-col gap-y-[1rem]'>
            <input id="username" name="username" placeholder='Email/username' required></input>
            <input id="password" name="password" placeholder='Password' required></input>
            <button type="submit" className='mt-[1rem] bg-[#00bf63] text-[#fff] place-self-end text-[1.2rem]' onClick={onFormSubmit}>Login</button>
            <hr className='my-[1rem]' />
        </div>
        <p>Or log in with:</p>
        <button type='button'><a href='http://localhost:3000/login/google'>Continue with Google</a></button>
    </form>);
}