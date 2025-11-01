import { useEffect, useMemo, useState } from "react";
import "./Home.css";
import ShopCard from "./components/ShopCard";
import { shop as shopApi } from "../paths";
import { useNavigate } from "react-router-dom";

export default function Home({ searchQuery }) {
  const navigate = useNavigate();

  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        // same as login: include credentials so cookies/session work
        const res = await fetch(`${shopApi.list}?limit=100&page=1`, {
          credentials: "include",
        });

        // backend returns JSON array; also surface server errors
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            (data && (data.error || data.message)) || "Failed to fetch shops"
          );
        }

        // backend shape = [{ id, shop: { id, name, tag, imageUrl, verificationStatus, businessRepresentative, location }}]
        // map to the flat shape your UI expects
        const mapped = (data || []).map((x) => ({
          id: x?.id ?? "",  // Use numeric shopId instead of shop.id slug
          name: x?.shop?.name ?? "",
          tag: x?.shop?.tag ?? "",
          imageUrl: x?.shop?.imageUrl ?? "",
          verificationStatus: x?.shop?.verificationStatus ?? "pending",
          businessRepresentative: x?.shop?.businessRepresentative ?? "",
          location: x?.shop?.location ?? "",
          displayCategory: x?.shop?.displayCategory ?? "",
        }));

        if (alive) setAllShops(mapped);
      } catch (e) {
        if (alive) setErr(e.message || "Network error loading shops");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  // Group shops by displayCategory
  const heritage = useMemo(() => allShops.filter(s => s.displayCategory === 'heritage'), [allShops]);
  const food = useMemo(() => allShops.filter(s => s.displayCategory === 'food'), [allShops]);
  const media = useMemo(() => allShops.filter(s => s.displayCategory === 'media'), [allShops]);
  const sustainable = useMemo(() => allShops.filter(s => s.displayCategory === 'sustainable'), [allShops]);
  const craft = useMemo(() => allShops.filter(s => s.displayCategory === 'craft'), [allShops]);
  const community = useMemo(() => allShops.filter(s => s.displayCategory === 'community'), [allShops]);

  // Featured shop is first community space (like board game cafe)
  const featuredShop = community[0] || heritage[0] || allShops[0];

  const filterShops = (shopList) => {
    if (!searchQuery) return shopList;
    const q = searchQuery.toLowerCase();
    return shopList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
    );
  };

  const filteredHeritage = filterShops(heritage);
  const filteredFood = filterShops(food);
  const filteredMedia = filterShops(media);
  const filteredSustainable = filterShops(sustainable);
  const filteredCraft = filterShops(craft);
  const filteredCommunity = filterShops(community);

  const handleFeaturedClick = async () => {
    if (featuredShop?.id) {
      try {
        // Fetch campaigns for this shop
        const res = await fetch(`http://localhost:3000/shops/${featuredShop.id}/campaigns`, {
          credentials: 'include'
        });

        if (!res.ok) {
          console.error('Failed to fetch campaigns for featured shop:', featuredShop.id);
          return;
        }

        const campaigns = await res.json();

        // Navigate to the first active campaign if available
        if (campaigns && campaigns.length > 0) {
          navigate(`/campaign/${campaigns[0].campaignId}`);
        } else {
          console.warn('No campaigns found for featured shop:', featuredShop.id);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    }
  };

  if (loading) {
    return <div className="home"><p className="loading">Loading shops…</p></div>;
  }

  if (err) {
    return (
      <div className="home">
        <p className="error">
          {err} — make sure the backend is running on <code>http://localhost:3000</code> and you’re logged in.
        </p>
      </div>
    );
  }

  if (!allShops.length) {
    return (
      <div className="home">
        <p className="no-results">No shops available yet.</p>
      </div>
    );
  }

  return (
    <div className="home">
      {featuredShop && (
        <section className="banner" onClick={handleFeaturedClick} style={{ cursor: "pointer" }}>
          <img src={featuredShop.imageUrl} alt={featuredShop.name} />
          <div className="text">
            <div className="label">Featured Shop:</div>
            <div className="title">{featuredShop.name}</div>
          </div>
          <div className="progress-indicator">
            <div className="progress-header">
              <span className="progress-label">Shop Status</span>
              <span className={`verification-badge ${featuredShop.verificationStatus}`}>
                {featuredShop.verificationStatus === 'verified' && '✓ Verified'}
                {featuredShop.verificationStatus === 'pending' && '⏳ Pending Verification'}
                {featuredShop.verificationStatus === 'rejected' && '✗ Rejected'}
              </span>
            </div>
          </div>
        </section>
      )}

      {searchQuery && (
        <div className="search-results-info">
          <p>
            Showing results for "<strong>{searchQuery}</strong>"
          </p>
        </div>
      )}

      {/* When searching, show all matching shops in categories */}
      {searchQuery ? (
        <>
          {filteredHeritage.length > 0 && (
            <section className="section">
              <h2>Local Gems Worth Saving:</h2>
              <p className="section-subtitle">Traditional Singaporean businesses with deep community roots</p>
              <div className="row">
                {filteredHeritage.map((s) => (
                  <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
                ))}
              </div>
            </section>
          )}

          {filteredFood.length > 0 && (
            <section className="section">
              <h2>Flavours You'll Love:</h2>
              <p className="section-subtitle">Authentic cuisine from passionate food artisans</p>
              <div className="row">
                {filteredFood.map((s) => (
                  <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
                ))}
              </div>
            </section>
          )}

          {filteredMedia.length > 0 && (
            <section className="section">
              <h2>Culture & Creativity:</h2>
              <p className="section-subtitle">Independent stores preserving physical media and literary culture</p>
              <div className="row">
                {filteredMedia.map((s) => (
                  <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
                ))}
              </div>
            </section>
          )}

          {filteredSustainable.length > 0 && (
            <section className="section">
              <h2>Sustainable Living:</h2>
              <p className="section-subtitle">Eco-conscious businesses fighting fast fashion and throwaway culture</p>
              <div className="row">
                {filteredSustainable.map((s) => (
                  <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
                ))}
              </div>
            </section>
          )}

          {filteredCraft.length > 0 && (
            <section className="section">
              <h2>Masters of Craft:</h2>
              <p className="section-subtitle">Skilled artisans preserving traditional repair and tailoring crafts</p>
              <div className="row">
                {filteredCraft.map((s) => (
                  <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
                ))}
              </div>
            </section>
          )}

          {filteredCommunity.length > 0 && (
            <section className="section">
              <h2>Community Spaces:</h2>
              <p className="section-subtitle">Gathering places fostering real human connection</p>
              <div className="row">
                {filteredCommunity.map((s) => (
                  <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
                ))}
              </div>
            </section>
          )}

          {filteredHeritage.length === 0 && filteredFood.length === 0 && filteredMedia.length === 0 &&
           filteredSustainable.length === 0 && filteredCraft.length === 0 && filteredCommunity.length === 0 && (
            <p className="no-results">No shops found matching your search.</p>
          )}
        </>
      ) : (
        <>
          {/* PRIORITY SECTION 1: HERITAGE - Traditional Singapore businesses */}
          {heritage.length > 0 && (
            <section className="section">
              <h2>Local Gems Worth Saving:</h2>
              <p className="section-subtitle">Traditional Singaporean businesses with deep community roots</p>
              <div className="row">
                {heritage.map((s) => (
                  <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
                ))}
              </div>
            </section>
          )}

          {/* PRIORITY SECTION 2: FOOD & BEVERAGE - All food-related */}
          {food.length > 0 && (
            <section className="section">
              <h2>Flavours You'll Love:</h2>
              <p className="section-subtitle">Authentic cuisine from passionate food artisans</p>
              <div className="row">
                {food.map((s) => (
                  <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
                ))}
              </div>
            </section>
          )}

          {/* CATEGORY GRID - Explore more categories */}
          {(media.length > 0 || sustainable.length > 0 || craft.length > 0 || community.length > 0) && (
            <section className="section explore-categories">
              <h2>Explore More Causes:</h2>
              <p className="section-subtitle">Discover other missions worth supporting</p>

              <div className="category-grid">
                {media.length > 0 && (
                  <div className="category-card" onClick={() => navigate('/category/media')}>
                    <div className="category-icon">📚</div>
                    <h3 className="category-title">Culture & Creativity</h3>
                    <p className="category-description">Independent stores preserving physical media and literary culture</p>
                    <div className="category-count">{media.length} {media.length === 1 ? 'Campaign' : 'Campaigns'}</div>
                  </div>
                )}

                {sustainable.length > 0 && (
                  <div className="category-card" onClick={() => navigate('/category/sustainable')}>
                    <div className="category-icon">♻️</div>
                    <h3 className="category-title">Sustainable Living</h3>
                    <p className="category-description">Eco-conscious businesses fighting fast fashion and throwaway culture</p>
                    <div className="category-count">{sustainable.length} {sustainable.length === 1 ? 'Campaign' : 'Campaigns'}</div>
                  </div>
                )}

                {craft.length > 0 && (
                  <div className="category-card" onClick={() => navigate('/category/craft')}>
                    <div className="category-icon">🔧</div>
                    <h3 className="category-title">Masters of Craft</h3>
                    <p className="category-description">Skilled artisans preserving traditional repair and tailoring crafts</p>
                    <div className="category-count">{craft.length} {craft.length === 1 ? 'Campaign' : 'Campaigns'}</div>
                  </div>
                )}

                {community.length > 0 && (
                  <div className="category-card" onClick={() => navigate('/category/community')}>
                    <div className="category-icon">🤝</div>
                    <h3 className="category-title">Community Spaces</h3>
                    <p className="category-description">Gathering places fostering real human connection</p>
                    <div className="category-count">{community.length} {community.length === 1 ? 'Campaign' : 'Campaigns'}</div>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
