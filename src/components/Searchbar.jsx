import { useState } from 'react';
import { search } from '../assets';
import './Searchbar.css';

export default function Searchbar({ onSearch }) {
    const [searchStr, setSearchStr] = useState('');

    const handleSearch = (value) => {
        setSearchStr(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        setSearchStr("");
        if (onSearch) {
            onSearch("");
        }
    };

    return (
        <div className='searchbar-container'>
            <span className='searchbar-icon'>
                <img src={search} alt="" />
            </span>
            <input
                type="text"
                placeholder="Search shops..."
                value={searchStr}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {searchStr && (
                <button onClick={handleClear} className='searchbar-clear'>×</button>
            )}
        </div>
    )
}