import { useState } from 'react';
import './TermsAndConditions.css';

export default function TermsAndConditions() {
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    const handleFAQToggle = (index) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    const faqData = [
        {
            question: "Is my personal information secure?",
            answer: "Yes. We take your privacy seriously and use data protection measures to keep your personal information safe."
        },
        {
            question: "Can I update or remove my personal information?",
            answer: "Yes. You can update or delete your personal information at any time."
        },
        {
            question: "Do you have a mobile app?",
            answer: "Not yet but we are working on one! Stay tuned for updates!"
        }
    ];

    return (
        <div className="terms-container">
            <div className="terms-content">
                <h1 className="terms-title">TERMS & CONDITIONS</h1>
                
                <div className="terms-section">
                    <div className="terms-box">
                        <p className="terms-text">
                            <strong>1. Donation Policy:</strong> All donations made are voluntary and non-refundable.
                        </p>
                        <p className="terms-text">
                            <strong>2. Payment Method:</strong> Donations must be made through our website.
                        </p>
                        <p className="terms-text">
                            <strong>3. Information Accuracy:</strong> You agree that all information provided in connection with your donation is accurate and complete.
                        </p>
                        <p className="terms-text">
                            <strong>4. Donation Acknowledgment:</strong> Upon receipt of your donation, we will issue an acknowledgment.
                        </p>
                        <p className="terms-text">
                            <strong>5. Privacy:</strong> We respect your privacy. Personal information collected during the donation process will be handled in accordance with our privacy policy.
                        </p>
                    </div>
                </div>

                <div className="faq-section">
                    <h2 className="faq-title">FAQ</h2>
                    
                    {faqData.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <button 
                                className={`faq-question ${expandedFAQ === index ? 'active' : ''}`}
                                onClick={() => handleFAQToggle(index)}
                            >
                                <span>{faq.question}</span>
                                <span className={`faq-icon ${expandedFAQ === index ? 'rotated' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            <div className={`faq-answer ${expandedFAQ === index ? 'expanded' : ''}`}>
                                <p className="faq-answer-text">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="back-to-home">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
}
