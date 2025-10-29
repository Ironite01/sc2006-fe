import { useNavigate } from 'react-router-dom';

export default function ShopCard ({id, imageUrl, tag, name}){
    const navigate = useNavigate();

    const handleClick = async () => {
        if (id) {
            try {
                // Fetch campaigns for this shop
                const res = await fetch(`http://localhost:3000/shops/${id}/campaigns`, {
                    credentials: 'include'
                });

                if (!res.ok) {
                    console.error('Failed to fetch campaigns for shop:', id);
                    // Navigate to shop page or show error - for now, just return
                    return;
                }

                const campaigns = await res.json();

                // Navigate to the first active campaign if available
                if (campaigns && campaigns.length > 0) {
                    navigate(`/campaign/${campaigns[0].campaignId}`);
                } else {
                    console.warn('No campaigns found for shop:', id);
                    // Could navigate to a "no campaign" page or show a message
                }
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            }
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