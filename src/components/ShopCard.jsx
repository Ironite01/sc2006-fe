export default function ShopCard ({imageUrl, tag, name}){
    return (
        <div className="shop-card"> 
            <img className ="thumb" src={imageUrl}/>
            <div className="meta">
                <div className="tag">{tag}</div>
                <div className="name">{name}</div>
            </div> 
        </div>
    );
}