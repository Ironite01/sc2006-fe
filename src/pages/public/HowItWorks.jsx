import './publicPages.css';

export default function HowItWorks() {
  return (
    <div className="public-page">
      <h1>How It Works</h1>
      <p className="subtitle">Supporting local businesses made simple</p>

      <div className="content-section">
        <div className="intro-section">
          <p>
            Our platform makes it easy for local businesses to raise funds and for community
            members to support the businesses they love. Here's how the process works:
          </p>
        </div>

        <div className="process-section">
          <h2>For Business Owners</h2>
          <div className="steps">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up</h3>
                <p>
                  Create an account as a Business Representative. It's free and only takes
                  a few minutes.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Create Your Campaign</h3>
                <p>
                  Tell your story! Explain why you need funding, set your goal, upload photos,
                  and create reward tiers for your supporters.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Wait for Approval</h3>
                <p>
                  Our team will review your campaign to ensure it meets our guidelines.
                  This usually takes 2-3 business days.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Promote Your Campaign</h3>
                <p>
                  Share your campaign with your customers and community. Post updates to
                  keep supporters engaged.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Receive Funds & Fulfill Rewards</h3>
                <p>
                  Receive donations, manage your rewards, and keep your supporters updated
                  on your progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="process-section">
          <h2>For Supporters</h2>
          <div className="steps">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Browse Campaigns</h3>
                <p>
                  Explore local businesses in need of support. Filter by category, location,
                  or search for specific businesses.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Choose a Campaign</h3>
                <p>
                  Read the business's story, understand their needs, and see what rewards
                  are offered at different donation levels.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Make a Donation</h3>
                <p>
                  Select your donation amount and reward tier. Complete payment securely
                  via credit card or PayPal.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Track Your Rewards</h3>
                <p>
                  Monitor your rewards status in your profile. Once approved by the business,
                  you can view your reward proof.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Redeem at the Business</h3>
                <p>
                  Present your reward proof at the business location to redeem your reward
                  and enjoy!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>🎁 Reward Tiers</h3>
              <p>Businesses offer rewards at different donation levels</p>
            </div>
            <div className="feature-item">
              <h3>📢 Campaign Updates</h3>
              <p>Stay informed with regular updates from businesses</p>
            </div>
            <div className="feature-item">
              <h3>💳 Secure Payments</h3>
              <p>Safe and secure payment processing</p>
            </div>
            <div className="feature-item">
              <h3>📊 Progress Tracking</h3>
              <p>See campaign funding progress in real-time</p>
            </div>
            <div className="feature-item">
              <h3>✅ Quality Control</h3>
              <p>All campaigns are reviewed before going live</p>
            </div>
            <div className="feature-item">
              <h3>📱 Easy to Use</h3>
              <p>Simple, intuitive interface for everyone</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>
            Whether you're a business owner looking for support or a community member
            wanting to help, join us today!
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary">Create a Campaign</button>
            <button className="cta-button secondary">Browse Campaigns</button>
          </div>
        </div>
      </div>
    </div>
  );
}
