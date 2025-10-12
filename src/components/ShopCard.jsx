import { useNavigate } from 'react-router-dom';

export default function ShopCard ({id, imageUrl, tag, name}){
    const navigate = useNavigate();

    const handleClick = () => {
        if (id) {
            navigate(`/campaign/${id}`);
        }
    };

    return (
        <div className="shop-card" onClick={handleClick}>
            <div className="thumb" style={{backgroundImage: `url(${imageUrl})`}}></div>
            <div className="meta">
                <div className="tag">{tag}</div>
                <div className="name">{name}</div>
            </div>
        </div>
    );
}