import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Simple fade-in animation on mount
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.style.opacity = '0';
      setTimeout(() => {
        gsap.to(contactForm, {
          duration: 0.8,
          opacity: 1,
          ease: 'power2.out'
        });
      }, 200);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'contactNumber') {
      let phoneValue = value.replace(/[^\d+]/g, '');
      if (phoneValue.length > 0 && phoneValue[0] !== '+') {
        phoneValue = '+' + phoneValue;
      }
      phoneValue = '+' + phoneValue.replace(/\+/g, '');
      if (phoneValue.length > 15) {
        phoneValue = phoneValue.slice(0, 15);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: phoneValue
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
      alert('Please enter a valid international phone number with country code');
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/xwpkkrdj', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setFormData({
          name: '',
          email: '',
          contactNumber: '',
          message: ''
        });
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  return (
    <section className="contact" id="contact">
      <h2>Get In Touch</h2>
      <p className="contact-intro">
        Have a project in mind or want to book a session? I'd love to hear from you! 
        Fill out the form below or reach out on Instagram @shootwithkamzy
      </p>

      <form onSubmit={handleSubmit} autoComplete="off" className="contact-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="contactNumber"
            placeholder="Your Contact Number (e.g., +971509943327)"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="form-input"
          />
          <small>Enter with country code (e.g., +971, +91)</small>
        </div>

        <div className="form-group">
          <textarea
            name="message"
            placeholder="Tell me about your project or inquiry..."
            value={formData.message}
            onChange={handleChange}
            required
            className="form-input"
            rows="5"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitStatus === 'sending'}
        >
          {submitStatus === 'sending' ? 'Sending...' : 'Send Message'}
        </button>

        {submitStatus === 'success' && (
          <div className="form-message success">
            ✓ Thank you! Your message has been sent successfully. I'll get back to you soon!
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="form-message error">
            ✗ Sorry, there was an error sending your message. Please try again.
          </div>
        )}
      </form>

      <div className="contact-info">
        <div className="info-item">
          <h4>📧 Email</h4>
          <p>Contact via the form above</p>
        </div>
        <div className="info-item">
          <h4>📱 Phone</h4>
          <p>Available for calls and WhatsApp</p>
        </div>
        <div className="info-item">
          <h4>📍 Location</h4>
          <p>UAE & India based</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
