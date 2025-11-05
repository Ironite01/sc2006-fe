import './Discover.css';

export default function Discover() {
    return (
        <div className="discover-container">
            <div className="discover-content">
                <h1 className="discover-title">DISCOVER AMAZING PROJECTS</h1>
                
                <div className="discover-hero">
                    <div className="discover-hero-text">
                        <h2>EXPLORE INNOVATION</h2>
                        <p>
                            Discover how small businesses on the brink are reinventing themselves, finding hope through community support, and turning challenges into opportunities for renewal.
                        </p>
                    </div>
                </div>

                <div className="discover-section">
                    <div className="discover-box">
                        <h3 className="discover-subtitle">WHAT YOU WILL FIND</h3>
                        
                        <div className="discover-grid">
                            <div className="discover-item">
                                <h4>STORIES OF RESILIENCE</h4>
                                <p>Discover heartfelt stories from local businesses fighting to survive — their journeys, challenges, and creative efforts to stay alive in a changing world.</p>
                            </div>
                            
                            <div className="discover-item">
                                <h4>CAMPAIGNS THAT INSPIRE CHANGE</h4>
                                <p>Explore active campaigns where your support helps revive dreams, sustain jobs, and spark innovation within communities that need it most.</p>
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
