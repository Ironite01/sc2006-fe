import './Footer.css';
import { facebook, instagram, tiktok } from '../assets';

export default function Footer() {
    return (
        <footer className="place-content-center">
            <div className='footer-section'>
                <nav className='flex gap-[0.5rem] flex-wrap'>
<<<<<<< HEAD
                    <a href="/">Home</a>
                    <span className='opacity-30'>|</span>
=======
>>>>>>> 689b63876ac3ed3a26572892e5fd62fb5274f8a4
                    <a>Discover</a>
                    <span className='opacity-30'>|</span>
                    <a>About Us</a>
                </nav>

            </div>
            <div className='flex justify-between flex-wrap gap-[2rem] footer-section'>
                <nav className="flex order-1 items-center gap-[0.5rem] flex-wrap">
                    <p>Need help?</p>
                    <a href="/terms#faq">FAQ</a>
                    <span className='opacity-30'>|</span>
                    <a href="/contact">Contact Us</a>
                    <span className='opacity-30'>|</span>
                    <a href="/how-it-works">How it Works</a>
                </nav>
                <nav className='flex order-2 items-center gap-[0.75rem]'>
                    <p>Follow us:</p>
                    <a href="/coming-soon" className='social'><img src={tiktok} alt="Tiktok logo" className='h-[2rem] w-auto' /></a>
                    <a href="/coming-soon" className='social'><img src={instagram} alt="Instagram logo" className='h-[2rem] w-auto' /></a>
                    <a href="/coming-soon" className='social'><img src={facebook} alt="Facebook logo" className='h-[2rem] w-auto' /></a>
                </nav>
            </div>
        </footer>
    )
}