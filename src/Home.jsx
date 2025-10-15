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

        // backend shape = [{ id, shop: { id, name, tag, imageUrl, progress, businessRepresentative, location }}]
        // map to the flat shape your UI expects
        const mapped = (data || []).map((x) => ({
          id: x?.shop?.id ?? String(x?.id ?? ""),
          name: x?.shop?.name ?? "",
          tag: x?.shop?.tag ?? "",
          imageUrl: x?.shop?.imageUrl ?? "",
          progress: Number(x?.shop?.progress ?? 0),
          businessRepresentative: x?.shop?.businessRepresentative ?? "",
          location: x?.shop?.location ?? "",
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

  // --- simple slicing to replicate the two sections you had ---
  const localGems = useMemo(() => allShops.slice(0, 8), [allShops]);
  const flavours = useMemo(() => allShops.slice(8, 16), [allShops]);

  const featuredShop = localGems[0];

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

  const filteredLocalGems = filterShops(localGems);
  const filteredFlavours = filterShops(flavours);

  const handleFeaturedClick = () => {
    if (featuredShop?.id) {
      navigate(`/campaign/${featuredShop.id}`);
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
              <span className="progress-label">Funding Progress</span>
              <span className="progress-percentage">{featuredShop.progress}%</span>
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${Math.min(100, Math.max(0, featuredShop.progress))}%` }}
              />
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

      <section className="section">
        <h2>Local Gems Worth Saving:</h2>
        <div className="row">
          {filteredLocalGems.length ? (
            filteredLocalGems.map((s) => (
              <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
            ))
          ) : (
            <p className="no-results">No shops found matching your search.</p>
          )}
        </div>
      </section>

      <section className="section">
        <h2>Flavours You’ll Love:</h2>
        <div className="row">
          {filteredFlavours.length ? (
            filteredFlavours.map((s) => (
              <ShopCard key={s.id} id={s.id} imageUrl={s.imageUrl} tag={s.tag} name={s.name} />
            ))
          ) : (
            <p className="no-results">No shops found matching your search.</p>
          )}
        </div>
      </section>
    </div>
  );
}
