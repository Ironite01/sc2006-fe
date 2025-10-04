import "./Home.css"
import ShopCard from "./components/ShopCard";
import shops from "./data/shops.json"

export default function Home() {

  // Pick the first local gem to feature (until backend is ready)
  const localGems = shops.localGems;
  const flavours = shops.flavours;

  return (
    <div className="home">
      <section className="banner">
        <img src={localGems[0].imageUrl} />
        <div className="text">
          <div className="label">Featured Shop:</div>
          <div className="title">{localGems[0].name}</div>
        </div>
      </section>

      <section className="section">
        <h2>Local Gems Worth Saving:</h2>
          <div className="row">
            {
              shops.localGems.map(
                (s)=>(
                  <ShopCard
                    imageUrl={s.imageUrl}
                    tag={s.tag}
                    name={s.name}
                  />
                )
              )
            }
          </div>
      </section>

      <section className="section">
        <h2>Don’t Let These Flavours Fade:</h2>
          <div className="row">
            {
              shops.flavours.map(
                (s)=>(
                  <ShopCard
                    imageUrl={s.imageUrl}
                    tag={s.tag}
                    name={s.name}
                  />
                )
              )
            }
          </div>
      </section>

    </div>
  );
}
