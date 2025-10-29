import { useState } from 'react';
import './publicPages.css';
import API from '../../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.sendContactForm(
        formData.name,
        formData.email,
        formData.subject,
        formData.message
      );

      if (response.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
      } else {
        setError(response.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page">
      <h1>Contact Us</h1>
      <p className="subtitle">We'd love to hear from you</p>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have questions, feedback, or need assistance? Our team is here to help.
            Fill out the form and we will get back to you as soon as possible.
          </p>

          <div className="contact-methods">
            <div className="contact-method">
              <h3>📧 Email</h3>
              <p>support@localcampaigns.com</p>
            </div>
            <div className="contact-method">
              <h3>📞 Phone</h3>
              <p>+65 1234 5678</p>
            </div>
            <div className="contact-method">
              <h3>🕐 Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM SGT</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            {submitted && (
              <p className="success-message">
                Thank you for contacting us! We will get back to you soon.
              </p>
            )}

            {error && (
              <p className="error-message">{error}</p>
            )}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
