import { useState } from 'react';
import './publicPages.css';

export default function FAQ() {
  const [openSection, setOpenSection] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I create a campaign?',
      answer: 'To create a campaign, you need to sign up as a Business Representative. Once logged in, navigate to the Campaign Manager and click "Create Your Campaign". Fill in all the required details including campaign name, description, funding goal, end date, and rewards. After submission, your campaign will be reviewed by our administrators.'
    },
    {
      id: 2,
      question: 'How do donations work?',
      answer: 'Supporters can browse campaigns and select a donation amount. Each donation tier may come with rewards. After selecting an amount, supporters proceed to payment where they can pay via credit card or PayPal. Once payment is confirmed, supporters receive confirmation and can track their rewards in their profile.'
    },
    {
      id: 3,
      question: 'What are rewards and how do I claim them?',
      answer: 'Rewards are incentives offered by businesses for different donation amounts. After donating, your reward will appear in your "My Rewards" section with a status of Pending, Completed, or Redeemed. Once the business approves your reward (Completed status), you can view the proof of reward and present it at the business location to redeem.'
    },
    {
      id: 4,
      question: 'How long does campaign approval take?',
      answer: 'Campaign approval typically takes 2-3 business days. Our administrators review each campaign to ensure it meets our platform guidelines. You will be notified via email once your campaign has been approved or if any changes are needed.'
    },
    {
      id: 5,
      question: 'Can I edit my campaign after it is approved?',
      answer: 'Yes, you can edit certain aspects of your campaign through the Campaign Manager. However, major changes to funding goals or campaign objectives may require re-approval from administrators.'
    },
    {
      id: 6,
      question: 'What happens if my campaign does not reach its goal?',
      answer: 'If your campaign does not reach its funding goal by the end date, you will still receive the funds that were donated. However, we encourage setting realistic goals and actively promoting your campaign to supporters.'
    }
  ];

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="public-page">
      <h1>FAQ</h1>
      <p className="subtitle">Frequently Asked Questions</p>

      <div className="faq-container">
        {faqs.map(faq => (
          <div key={faq.id} className="faq-item">
            <button
              className={`faq-question ${openSection === faq.id ? 'active' : ''}`}
              onClick={() => toggleSection(faq.id)}
            >
              <span>{faq.question}</span>
              <span className="faq-icon">{openSection === faq.id ? '▲' : '▼'}</span>
            </button>
            {openSection === faq.id && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
