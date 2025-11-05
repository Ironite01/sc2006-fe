import './AboutUs.css';

export default function AboutUs() {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1 className="about-title">ABOUT US</h1>
                
                <div className="about-hero">
                    <div className="about-hero-text">
                        <h2>EMPOWERING DREAMS ONE PROJECT AT A TIME</h2>
                        <p>
                            We believe every business begins with a dream worth fighting for.
                            By connecting struggling entrepreneurs with supporters who care, we help breathe life back into ideas, passions, and communities — one project, one dream at a time.
                        </p>
                    </div>
                </div>

                <div className="about-section">
                    <div className="about-box">
                        <h3 className="about-subtitle">OUR MISSION</h3>
                        <p className="about-text">
                            Our mission is to give struggling businesses a second chance by connecting them with people who believe in their potential.
                            We aim to create a space where hope, innovation, and community come together to keep dreams alive.
                        </p>
                        
                        <div className="about-values">
                            <div className="value-item">
                                <div className="value-icon">🤝</div>
                                <h4>TRUST & TRANSPARENCY</h4>
                                <p>We prioritize honest communication and secure transactions, building trust between creators and supporters.</p>
                            </div>
                            
                            <div className="value-item">
                                <div className="value-icon">🌟</div>
                                <h4>INNOVATION</h4>
                                <p>We celebrate creativity and provide tools that help innovative ideas reach their full potential.</p>
                            </div>
                            
                            <div className="value-item">
                                <div className="value-icon">🌍</div>
                                <h4>COMMUNITY</h4>
                                <p>We foster a community where collaboration and support drive meaningful change.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="back-to-home">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
}
