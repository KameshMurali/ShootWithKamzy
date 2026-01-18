import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const About = () => {
  useEffect(() => {
    // Simple fade-in animation on mount
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
      aboutContent.style.opacity = '0';
      setTimeout(() => {
        gsap.to(aboutContent, {
          duration: 0.8,
          opacity: 1,
          ease: 'power2.out'
        });
      }, 200);
    }
  }, []);

  return (
    <section className="about" id="about">
      <h2>About Me</h2>
      <div className="about-content">
        <p>
          Hi, I'm <strong>Kamesh</strong>, a passionate professional photographer and videographer dedicated to capturing your most precious moments with creativity, style, and technical excellence.
        </p>
        
        <div className="about-details">
          <div className="about-box">
            <h3>Experience</h3>
            <p>With several years of experience in the photography industry, I've perfected the art of capturing emotions, celebrations, and special moments that matter most to you.</p>
          </div>
          
          <div className="about-box">
            <h3>Expertise</h3>
            <p>Specializing in portrait photography, events, pre-wedding shoots, post-wedding photography, videography, model portfolios, product photography, baby & family sessions, and professional headshots.</p>
          </div>
          
          <div className="about-box">
            <h3>Location & Reach</h3>
            <p>Based in both UAE and India, I serve clients worldwide with a commitment to quality, professionalism, and customer satisfaction. Let's create lasting memories together!</p>
          </div>
        </div>

        <p className="about-cta">
          Ready to book your session or have questions? Feel free to reach out through the contact form below or connect on Instagram @shootwithkamzy
        </p>
      </div>
    </section>
  );
};

export default About;
