import './AboutUs.css';

export default function AboutUs() {
    return (
        <div className="about-page">
            <div className="about-container">
                <div className="about-header">
                    <h1>About Us</h1>
                    <p className="subtitle">Supporting Local Businesses, Building Stronger Communities</p>
                </div>

                <div className="about-section">
                    <div className="section-content">
                        <h2>Our Mission</h2>
                        <p>
                            We believe that local businesses are the heart and soul of our communities.
                            They create jobs, foster connections, and give neighborhoods their unique character.
                            When these businesses struggle, our communities suffer.
                        </p>
                        <p>
                            Our platform connects struggling local businesses with supporters who want to help
                            them survive and thrive. Through crowdfunding campaigns, businesses can raise the
                            funds they need while offering meaningful rewards to their supporters.
                        </p>
                    </div>
                    <div className="section-image">
                        <img src="https://via.placeholder.com/500x400" alt="Our Mission" />
                    </div>
                </div>

                <div className="about-section reverse">
                    <div className="section-image">
                        <img src="https://via.placeholder.com/500x400" alt="How It Started" />
                    </div>
                    <div className="section-content">
                        <h2>How It Started</h2>
                        <p>
                            Our journey began when we witnessed beloved local businesses closing their doors
                            during difficult economic times. We saw firsthand how these closures affected not
                            just the business owners, but entire communities.
                        </p>
                        <p>
                            We realized that many people wanted to help but didn't know how. That's when we
                            created this platform - a bridge between businesses in need and supporters who
                            care about preserving their local economy.
                        </p>
                    </div>
                </div>

                <div className="values-section">
                    <h2>Our Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">🤝</div>
                            <h3>Community First</h3>
                            <p>We prioritize the wellbeing of local communities and the businesses that serve them.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🔒</div>
                            <h3>Transparency</h3>
                            <p>Every campaign is verified, and funds are protected with our all-or-nothing policy.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">💡</div>
                            <h3>Innovation</h3>
                            <p>We continuously improve our platform to better serve businesses and supporters.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">❤️</div>
                            <h3>Compassion</h3>
                            <p>We understand the challenges businesses face and provide support every step of the way.</p>
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <h2>Our Impact</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">150+</div>
                            <div className="stat-label">Businesses Saved</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">$2.5M</div>
                            <div className="stat-label">Funds Raised</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">5,000+</div>
                            <div className="stat-label">Active Supporters</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">85%</div>
                            <div className="stat-label">Success Rate</div>
                        </div>
                    </div>
                </div>

                <div className="team-section">
                    <h2>Meet Our Team</h2>
                    <p className="team-intro">
                        We're a passionate group of individuals dedicated to supporting local businesses
                        and strengthening communities.
                    </p>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://via.placeholder.com/200x200" alt="Team Member" />
                            </div>
                            <h3>Sarah Chen</h3>
                            <p className="member-role">Founder & CEO</p>
                            <p className="member-bio">Former small business owner with 10 years of entrepreneurial experience.</p>
                        </div>
                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://via.placeholder.com/200x200" alt="Team Member" />
                            </div>
                            <h3>Michael Rodriguez</h3>
                            <p className="member-role">Chief Technology Officer</p>
                            <p className="member-bio">Tech innovator passionate about building solutions for social good.</p>
                        </div>
                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://via.placeholder.com/200x200" alt="Team Member" />
                            </div>
                            <h3>Emma Thompson</h3>
                            <p className="member-role">Community Manager</p>
                            <p className="member-bio">Community organizer dedicated to connecting businesses with supporters.</p>
                        </div>
                        <div className="team-member">
                            <div className="member-photo">
                                <img src="https://via.placeholder.com/200x200" alt="Team Member" />
                            </div>
                            <h3>David Kim</h3>
                            <p className="member-role">Operations Director</p>
                            <p className="member-bio">Operations expert ensuring smooth campaign execution and support.</p>
                        </div>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Join Our Mission</h2>
                    <p>Whether you're a business in need or a supporter who cares, we're here to help.</p>
                    <div className="cta-buttons">
                        <a href="/signup" className="cta-btn primary">Get Started</a>
                        <a href="/how-it-works" className="cta-btn secondary">Learn More</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
