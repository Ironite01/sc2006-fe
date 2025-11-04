import './ContactUs.css';

export default function ContactUs() {
    return (
        <div className="contact-container">
            <div className="contact-content">
                <h1 className="contact-title">CONTACT US</h1>
                
                <div className="contact-section">
                    <div className="contact-box">
                        <h3 className="contact-subtitle">GET IN TOUCH</h3>
                        <p className="contact-text">
                            We would love to hear from you! Whether you have questions about campaigns, need technical support or want to provide feedback our team is here to help.
                        </p>
                        
                        <div className="contact-info">
                            <div className="contact-item">
                                <h4>EMAIL</h4>
                                <p>support@ourplatform.com</p>
                            </div>
                            
                            <div className="contact-item">
                                <h4>PHONE</h4>
                                <p>+65 1234 5678</p>
                            </div>
                            
                            <div className="contact-item">
                                <h4>OFFICE HOURS</h4>
                                <p>Monday - Friday - 9:00 AM - 6:00 PM (SGT)</p>
                            </div>
                            
                            <div className="contact-item">
                                <h4>RESPONSE TIME</h4>
                                <p>We typically respond within 24 hours</p>
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
