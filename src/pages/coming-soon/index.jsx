import './ComingSoon.css';

export default function ComingSoon() {
    return (
        <div className="coming-soon-container">
            <div className="coming-soon-content">
                <div className="coming-soon-icon">🚀</div>
                <h1 className="coming-soon-title">Coming Soon!</h1>
                
                <div className="coming-soon-message">
                    <p className="coming-soon-text">
                        This feature is still brewing behind the scenes. Our team is hard at work bringing it to life.
                    </p>
                    <p className="coming-soon-subtitle">
                        Stay tuned. Something awesome is on its way!
                    </p>
                </div>

                <div className="coming-soon-animation">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>

                <div className="back-to-home">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
}
