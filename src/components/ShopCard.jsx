export default function ShopCard ({imageUrl, tag, name}){
    return (
        <div className="shop-card">
            <div className="thumb" style={{backgroundImage: `url(${imageUrl})`}}></div>
            <div className="meta">
                <div className="tag">{tag}</div>
                <div className="name">{name}</div>
            </div>
        </div>
    );
}