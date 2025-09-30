import './Footer.css';
import { facebook, instagram, tiktok } from '../assets';

export default function Footer() {
    return (
        <footer className="place-content-center">
            <div className='flex'>
                <a>[ Home ]</a>
                <a>[ Discover ]</a>
                <a>[ Rewards ]</a>
                <a>[ About Us ]</a>
            </div>
            <div className='flex justify-between'>
                <div className="flex order-1 items-center gap-[1rem] pr-[1rem]">
                    <a>Need help?</a>
                    <a>[ FAQ ]</a>
                    <a>[ Contact Us ]</a>
                    <a>[ How it Works ]</a>

                </div>
                <div className='flex order-2 items-center gap-[1rem]'>
                    <p>Follow us:</p>
                    <a className='social'><img src={tiktok} alt="Tiktok logo" className='h-[3rem] w-auto' /></a>
                    <a className='social'><img src={instagram} alt="Tiktok logo" className='h-[3rem] w-auto' /></a>
                    <a className='social'><img src={facebook} alt="Tiktok logo" className='h-[3rem] w-auto' /></a>
                </div>
            </div>
        </footer>
    )
}