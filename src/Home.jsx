import "./Home.css"
import ShopCard from "./components/ShopCard";
import shops from "./data/shops.json"

export default function Home({ searchQuery }) {

  const localGems = shops.localGems;
  const flavours = shops.flavours;

  const filterShops = (shopList) => {
    if (!searchQuery) return shopList;
    return shopList.filter(shop =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredLocalGems = filterShops(localGems);
  const filteredFlavours = filterShops(flavours);

  return (
    <div className="home">
      <section className="banner">
        <img src={localGems[0].imageUrl} />
        <div className="text">
          <div className="label">Featured Shop:</div>
          <div className="title">{localGems[0].name}</div>
        </div>
        <div className="progress-indicator">
          <div className="progress-header">
            <span className="progress-label">Funding Progress</span>
            <span className="progress-percentage">{localGems[0].progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${localGems[0].progress}%`}}></div>
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
