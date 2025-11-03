import './publicPages.css';

export default function About() {
  return (
    <div className="public-page">
      <h1>About Us</h1>

      <div className="content-section">
        <div className="hero-section">
          <h2>Saving Local Businesses, One Campaign at a Time</h2>
          <p className="tagline">
            We believe every local business has a story worth saving. Our platform connects
            communities with the businesses they love, making it easy to provide support
            when it is needed most.
          </p>
        </div>

        <div className="mission-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to empower local businesses by providing them with a crowdfunding
            platform that connects them directly with their community. We aim to preserve the
            unique character and charm that local businesses bring to neighborhoods, while
            giving supporters meaningful ways to contribute.
          </p>
        </div>

        <div className="story-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, our platform was born from a simple observation: amazing local
            businesses were closing down due to temporary financial challenges, even when
            their communities wanted to help. We created this platform to bridge that gap,
            making it easy for businesses to share their stories and for supporters to
            contribute in meaningful ways.
          </p>
          <p>
            Since our launch, we have helped dozens of local businesses secure the funding
            they need to overcome challenges, expand their services, and continue serving
            their communities.
          </p>
        </div>

        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>🤝 Community First</h3>
              <p>We believe in the power of community to support and sustain local businesses.</p>
            </div>
            <div className="value-item">
              <h3>💎 Transparency</h3>
              <p>We maintain open and honest communication between businesses and supporters.</p>
            </div>
            <div className="value-item">
              <h3>🌟 Quality</h3>
              <p>We carefully review each campaign to ensure authenticity and quality.</p>
            </div>
            <div className="value-item">
              <h3>❤️ Impact</h3>
              <p>Every contribution makes a real difference in preserving local businesses.</p>
            </div>
          </div>
        </div>

        <div className="team-section">
          <h2>How It Works</h2>
          <ol className="steps-list">
            <li>Businesses create campaigns explaining their needs and goals</li>
            <li>Community members browse and support campaigns that resonate with them</li>
            <li>Supporters receive rewards based on their contribution level</li>
            <li>Businesses use the funds to overcome challenges and continue serving</li>
            <li>Communities preserve the local businesses they love</li>
          </ol>
        </div>

        <div className="cta-section">
          <h2>Join Us in Saving Local Businesses</h2>
          <p>
            Whether you are a business owner in need of support or a community member who
            wants to help, we invite you to be part of our mission.
          </p>
        </div>
      </div>
    </div>
  );
}
