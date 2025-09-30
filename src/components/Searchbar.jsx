import { useState } from 'react';
import { search } from '../assets';

export default () => {
    const [searchStr, setSearchStr] = useState('');

    return (<div className='flex items-center text-center'>
        <span className='size-[2.1rem] bg-[#fff] rounded-tl-[12px] rounded-bl-[12px]'>
            <img src={search} alt="" className='size-[24px]' />
        </span>
        <input type="text" placeholder="Search..." value={searchStr} onChange={(e) => setSearchStr(e.target.value)}></input>
        <button onClick={() => setSearchStr("")} className='size-[2.1rem] rounded-bl-[0] rounded-tl-[0] p-[0]'>×</button>
    </div>)
}