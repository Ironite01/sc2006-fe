import "./Home.css"
import ShopCard from "./components/ShopCard";
import shops from "./data/shops.json"
import { useNavigate } from 'react-router-dom';

export default function Home({ searchQuery }) {
  const navigate = useNavigate();

  const localGems = shops.localGems;
  const flavours = shops.flavours;
  const featuredShop = localGems[0];

  const filterShops = (shopList) => {
    if (!searchQuery) return shopList;
    return shopList.filter(shop =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredLocalGems = filterShops(localGems);
  const filteredFlavours = filterShops(flavours);

  const handleFeaturedClick = () => {
    if (featuredShop?.id) {
      navigate(`/campaign/${featuredShop.id}`);
    }
  };

  return (
    <div className="home">
      <section className="banner" onClick={handleFeaturedClick} style={{ cursor: 'pointer' }}>
        <img src={featuredShop.imageUrl} alt={featuredShop.name} />
        <div className="text">
          <div className="label">Featured Shop:</div>
          <div className="title">{featuredShop.name}</div>
        </div>
        <div className="progress-indicator">
          <div className="progress-header">
            <span className="progress-label">Funding Progress</span>
            <span className="progress-percentage">{featuredShop.progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${featuredShop.progress}%`}}></div>
          </div>
        </div>
      </section>

      {searchQuery && (
        <div className="search-results-info">
          <p>Showing results for "<strong>{searchQuery}</strong>"</p>
        </div>
      )}

      <section className="section">
        <h2>Local Gems Worth Saving:</h2>
          <div className="row">
            {filteredLocalGems.length > 0 ? (
              filteredLocalGems.map((s) => (
                <ShopCard
                  key={s.id}
                  id={s.id}
                  imageUrl={s.imageUrl}
                  tag={s.tag}
                  name={s.name}
                />
              ))
            ) : (
              <p className="no-results">No shops found matching your search.</p>
            )}
          </div>
      </section>

      <section className="section">
        <h2>Don't Let These Flavours Fade:</h2>
          <div className="row">
            {filteredFlavours.length > 0 ? (
              filteredFlavours.map((s) => (
                <ShopCard
                  key={s.id}
                  id={s.id}
                  imageUrl={s.imageUrl}
                  tag={s.tag}
                  name={s.name}
                />
              ))
            ) : (
              <p className="no-results">No shops found matching your search.</p>
            )}
          </div>
      </section>

    </div>
  );
}
