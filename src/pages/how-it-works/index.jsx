import './HowItWorks.css';

export default function HowItWorks() {
    return (
        <div className="how-it-works-container">
            <div className="how-it-works-content">
                <h1 className="how-it-works-title">HOW IT WORKS</h1>
                
                <div className="how-it-works-section">
                    <div className="how-it-works-box">
                        <h3 className="how-it-works-subtitle">SIMPLE STEPS TO SUCCESS</h3>
                        
                        <div className="steps-container">
                            <div className="step-item">
                                <div className="step-number">1</div>
                                <h4>CREATE YOUR CAMPAIGN</h4>
                                <p>Set up your project with a compelling story, clear goals, and attractive rewards for supporters.</p>
                            </div>
                            
                            <div className="step-item">
                                <div className="step-number">2</div>
                                <h4>SHARE YOUR VISION</h4>
                                <p>Promote your campaign through social media, email, and word-of-mouth to reach potential backers.</p>
                            </div>
                            
                            <div className="step-item">
                                <div className="step-number">3</div>
                                <h4>ENGAGE WITH SUPPORTERS</h4>
                                <p>Keep your backers updated with regular posts, respond to questions, and build a community around your project.</p>
                            </div>
                            
                            <div className="step-item">
                                <div className="step-number">4</div>
                                <h4>DELIVER RESULTS</h4>
                                <p>Once funded, execute your project and deliver rewards to your supporters as promised.</p>
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
