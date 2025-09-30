import { profile } from '../assets';
import './Header.css';
import Searchbar from './Searchbar';

export default function Header() {
    return <header className="place-content-center">
        <nav className="flex justify-between items-center">
            <nav className="flex order-1 gap-[1rem]">
                <img src={profile} alt="App logo" className='h-[3rem] w-auto' />
                <a>Home</a>
                <a>Rewards</a>
                <a>Updates</a>
            </nav>
            <div className="flex order-2 items-center gap-[1rem]">
                <Searchbar />
                <img src={profile} alt="Profile logo" className='h-[3rem] w-auto' />
            </div>
        </nav>
    </header>
}