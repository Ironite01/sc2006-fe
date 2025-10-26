import { useState } from "react";
import "./UpdateComposer.css";

const seedPublished = [
  {
    id: 1,
    title: "We’ve reopened for weekend brunch!",
    date: "Posted Aug 31, 2025",
    body:
      "Thanks to your support, we’ve fixed our stove and reopened for weekend brunch!",
    image: null,
  },
];

export default function UpdateComposer() {
  const [published] = useState(seedPublished);
  const [title, setTitle] = useState("Big repairs made!");
  const [body, setBody] = useState("Our stove was repairing our oven stove");
  const [image, setImage] = useState(null);

  const stats = { total: 3, reached: 250, avgViews: 120 };

  const handleImage = (e) => setImage(e.target.files?.[0] ?? null);

  const handlePublish = (e) => {
    e.preventDefault();
    // TODO: POST to API
    alert("Update published! (wire API when ready)");
  };

  return (
    <div className="uc-page">
      <h1 className="uc-title">Post an Update!</h1>
      <p className="uc-sub">
        Updates are your way to keep supporters connected to your journey. Share
        milestones, new challenges, photos, or announcements so the community
        knows how their contributions are making an impact.
      </p>

      <div className="uc-grid">
        {/* Left column: Published + Draft preview */}
        <div className="uc-col">
          {/* Latest published example */}
          {published.map((u) => (
            <article className="uc-card uc-card--published" key={u.id}>
              <div className="uc-card-media">
                {/* optional image slot */}
                {u.image ? (
                  <img src={URL.createObjectURL(u.image)} alt="" />
                ) : (
                  <div className="uc-media-placeholder" />
                )}
              </div>
              <div className="uc-card-body">
                <h3 className="uc-card-title">{u.title}</h3>
                <div className="uc-card-meta">{u.date}</div>
                <p className="uc-card-text">{u.body}</p>
                <div className="uc-actions">
                    <button className="uc-btn uc-btn--ghost uc-btn--compact">Like</button>
                    <button className="uc-btn uc-btn--ghost uc-btn--compact">Comment</button>
                </div>
              </div>
            </article>
          ))}

          {/* Draft preview */}
          <article className="uc-card">
            <div className="uc-card-media">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="" />
              ) : (
                <div className="uc-media-placeholder" />
              )}
            </div>
            <div className="uc-card-body">
              <h3 className="uc-card-title">{title || "Untitled update"}</h3>
              <div className="uc-card-meta">Draft preview</div>
              <p className="uc-card-text">{body || "Draft body…"}</p>
              <div className="uc-actions">
                <button className="uc-btn uc-btn--ghost uc-btn--compact">Like</button>
                <button className="uc-btn uc-btn--ghost uc-btn--compact">Comment</button>
            </div>

            </div>
          </article>
        </div>

        {/* Right column: Stats + Composer */}
        <div className="uc-col">
          {/* Stats */}
          <section className="uc-panel">
            <h4 className="uc-panel-title">Latest Update Stats</h4>
            <div className="uc-stats">
              <div>
                <strong>{stats.total}</strong> Updates Posted
              </div>
              <div>
                <strong>{stats.reached}</strong> Supporters Reached
              </div>
              <div>
                Avg. <strong>{stats.avgViews}</strong> Views per Update
              </div>
            </div>
          </section>

          {/* Composer */}
          <section className="uc-panel">
            <h4 className="uc-panel-title">Compose an Update</h4>
            <form className="uc-form" onSubmit={handlePublish}>
              <label className="uc-label">
                Title
                <input
                  className="uc-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What’s new?"
                />
              </label>

              <label className="uc-label">
                Message
                <textarea
                  className="uc-textarea"
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Share your progress, stories, or milestones…"
                />
              </label>

              <label className="uc-label">
                Image (optional)
                <input className="uc-file" type="file" accept="image/*" onChange={handleImage} />
              </label>

              <div className="uc-form-actions">
                <button type="submit" className="uc-btn uc-btn--primary">
                  Publish Update
                </button>
                <button
                  type="button"
                  className="uc-btn"
                  onClick={() => alert("Saved as draft (stub)")}
                >
                  Save Draft
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
