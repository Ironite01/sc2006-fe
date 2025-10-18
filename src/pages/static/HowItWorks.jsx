import './HowItWorks.css';

export default function HowItWorks() {
    return (
        <div className="how-it-works-page">
            <div className="how-it-works-container">
                <div className="hero-section">
                    <h1>How It Works</h1>
                    <p>Supporting local businesses has never been easier. Here's how our platform connects businesses in need with supporters who care.</p>
                </div>

                <div className="user-types-section">
                    <h2>Choose Your Path</h2>
                    <div className="user-types-grid">
                        <div className="user-type-card">
                            <div className="type-icon">💼</div>
                            <h3>For Businesses</h3>
                            <p>Create campaigns to raise funds and save your business</p>
                            <a href="#business-flow" className="type-link">Learn More →</a>
                        </div>
                        <div className="user-type-card">
                            <div className="type-icon">❤️</div>
                            <h3>For Supporters</h3>
                            <p>Donate to campaigns and receive rewards from businesses you love</p>
                            <a href="#supporter-flow" className="type-link">Learn More →</a>
                        </div>
                    </div>
                </div>

                <div id="business-flow" className="flow-section">
                    <h2>For Business Owners</h2>
                    <div className="steps">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Create Your Account</h3>
                                <p>Sign up as a Business Representative and verify your business information.</p>
                                <ul>
                                    <li>Register with your business email</li>
                                    <li>Provide business registration details</li>
                                    <li>Complete verification process</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Build Your Campaign</h3>
                                <p>Tell your story and explain why your business needs support.</p>
                                <ul>
                                    <li>Set your funding goal</li>
                                    <li>Write a compelling story</li>
                                    <li>Upload photos and videos</li>
                                    <li>Create reward tiers for supporters</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Get Approved</h3>
                                <p>Our team reviews your campaign to ensure authenticity.</p>
                                <ul>
                                    <li>Submit your campaign for review</li>
                                    <li>Administrators verify your business</li>
                                    <li>Typically approved within 2-3 business days</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Engage Supporters</h3>
                                <p>Share your campaign and keep supporters updated on your progress.</p>
                                <ul>
                                    <li>Post regular updates</li>
                                    <li>Respond to comments</li>
                                    <li>Share on social media</li>
                                    <li>Thank your supporters</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h3>Receive Funds & Fulfill Rewards</h3>
                                <p>Once your goal is met, receive funds and deliver rewards to your supporters.</p>
                                <ul>
                                    <li>Funds released when goal is reached</li>
                                    <li>Fulfill rewards to supporters</li>
                                    <li>Approve reward redemptions</li>
                                    <li>Build lasting customer relationships</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="supporter-flow" className="flow-section alternate">
                    <h2>For Supporters</h2>
                    <div className="steps">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Browse Campaigns</h3>
                                <p>Discover local businesses that need your help.</p>
                                <ul>
                                    <li>Explore campaigns on the home page</li>
                                    <li>Filter by location or category</li>
                                    <li>Read business stories</li>
                                    <li>Check funding progress</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Choose Your Support Level</h3>
                                <p>Select a donation amount and corresponding reward tier.</p>
                                <ul>
                                    <li>Review available reward tiers</li>
                                    <li>Choose a donation amount</li>
                                    <li>See what rewards you'll receive</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Make Your Donation</h3>
                                <p>Complete your donation securely through PayPal.</p>
                                <ul>
                                    <li>Enter payment information</li>
                                    <li>Secure PayPal checkout</li>
                                    <li>Receive confirmation email</li>
                                    <li>Track your donation</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Track Campaign Progress</h3>
                                <p>Stay updated on how the business is doing.</p>
                                <ul>
                                    <li>Receive campaign updates</li>
                                    <li>Leave comments and encouragement</li>
                                    <li>Watch funding progress</li>
                                    <li>Engage with the community</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h3>Claim Your Rewards</h3>
                                <p>Once the campaign succeeds, redeem your rewards at the business.</p>
                                <ul>
                                    <li>Check your rewards page</li>
                                    <li>View your QR code or redemption code</li>
                                    <li>Visit the business location</li>
                                    <li>Show your code to staff and enjoy!</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="key-features-section">
                    <h2>Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🛡️</div>
                            <h3>All-or-Nothing Funding</h3>
                            <p>Campaigns must reach their goal to receive funds. If not, all donations are automatically refunded.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✅</div>
                            <h3>Verified Campaigns</h3>
                            <p>Every campaign is reviewed by our administrators to ensure legitimacy and protect supporters.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💳</div>
                            <h3>Secure Payments</h3>
                            <p>All transactions are processed securely through PayPal. We never store your full payment information.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎁</div>
                            <h3>Reward System</h3>
                            <p>Supporters receive rewards based on donation amounts, redeemable at business locations.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Campaign Updates</h3>
                            <p>Businesses can post updates to keep supporters informed about their progress and challenges.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💬</div>
                            <h3>Community Engagement</h3>
                            <p>Comments and likes allow supporters to engage with businesses and show their support.</p>
                        </div>
                    </div>
                </div>

                <div className="faq-preview-section">
                    <h2>Still Have Questions?</h2>
                    <p>Check out our FAQ page for more detailed information.</p>
                    <a href="/faq" className="faq-link-btn">Visit FAQ Page</a>
                </div>

                <div className="cta-section">
                    <h2>Ready to Get Started?</h2>
                    <p>Join our community and make a difference today</p>
                    <div className="cta-buttons">
                        <a href="/signup" className="cta-btn primary">Sign Up Now</a>
                        <a href="/about" className="cta-btn secondary">Learn More About Us</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
