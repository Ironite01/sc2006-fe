import { useState } from 'react';
import './FAQ.css';

export default function FAQ() {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    const faqData = [
        {
            question: "What is this platform about?",
            answer: "Our platform connects struggling local businesses with supporters who want to help them survive. Businesses can create campaigns to raise funds, and supporters can donate in exchange for rewards."
        },
        {
            question: "How do I create an account?",
            answer: "Click the 'Sign Up' button in the header, choose whether you're a Supporter or Business Representative, and fill in your details. You can also sign up using Google or Microsoft accounts."
        },
        {
            question: "How do I donate to a campaign?",
            answer: "Browse campaigns on the home page, click on a business you'd like to support, select a donation amount and corresponding reward, then complete the payment through our secure PayPal integration."
        },
        {
            question: "What happens to my donation if a campaign doesn't reach its goal?",
            answer: "All campaigns are 'all-or-nothing'. If a campaign doesn't reach its funding goal by the end date, all donations are automatically refunded to supporters."
        },
        {
            question: "How do rewards work?",
            answer: "When you donate, you'll receive a reward based on your donation amount. Rewards can include vouchers, discounts, or special items. Once the business approves your reward, you can redeem it in-store by showing the QR code from your rewards page."
        },
        {
            question: "How do I redeem my reward?",
            answer: "Go to your Rewards page, find the completed reward, click on it to view the proof of reward (QR code), and present it at the business location."
        },
        {
            question: "Can I cancel my donation?",
            answer: "You can request a refund within 48 hours of making your donation by contacting support. After that period, donations are non-refundable unless the campaign fails to reach its goal."
        },
        {
            question: "How do I create a campaign as a business?",
            answer: "First, register as a Business Representative. Then navigate to the Campaign Manager, click 'Create Campaign', fill in all required details including your funding goal, story, and reward tiers. Your campaign will be reviewed by administrators before going live."
        },
        {
            question: "How long does campaign approval take?",
            answer: "Campaign approval typically takes 2-3 business days. Our administrators review each campaign to ensure it meets platform guidelines and represents a legitimate struggling business."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We currently accept payments through PayPal, which supports credit cards, debit cards, and PayPal balance."
        },
        {
            question: "Is my payment information secure?",
            answer: "Yes, all payments are processed securely through PayPal. We never store your full payment information on our servers."
        },
        {
            question: "How do I update my campaign?",
            answer: "Business Representatives can post updates through the Update Composer page. Updates are a great way to keep supporters informed about your progress and show how their donations are making a difference."
        }
    ];

    return (
        <div className="faq-page">
            <div className="faq-container">
                <div className="faq-header">
                    <h1>Frequently Asked Questions</h1>
                    <p>Find answers to common questions about our platform</p>
                </div>

                <div className="faq-sections">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openSection === index ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleSection(index)}
                            >
                                <span>{item.question}</span>
                                <span className="faq-icon">{openSection === index ? '▲' : '▼'}</span>
                            </button>
                            {openSection === index && (
                                <div className="faq-answer">
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="faq-contact">
                    <h3>Still have questions?</h3>
                    <p>Can't find what you're looking for? Contact our support team</p>
                    <a href="/contact" className="contact-btn">Contact Us</a>
                </div>
            </div>
        </div>
    );
}
