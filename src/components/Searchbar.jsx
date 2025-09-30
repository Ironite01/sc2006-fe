import { useState } from 'react';
import { search } from '../assets';

export default () => {
    const [searchStr, setSearchStr] = useState('');

    return (<div className='flex items-center'>
        <img src={search} alt="" className='size-[24px] bg-[#fff]' />
        <input type="text" placeholder="Search..." value={searchStr} onChange={(e) => setSearchStr(e.target.value)}></input>
        <button onClick={() => setSearchStr("")} className='size-[24px]'>×</button>
    </div>)
}