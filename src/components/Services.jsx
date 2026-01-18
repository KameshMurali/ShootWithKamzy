import React, { useEffect } from 'react';
import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Portrait Photography',
      description: 'Professional portrait sessions capturing your best moments',
      image: '/images/services/headshots.png'
    },
    {
      id: 2,
      title: 'Events Photography',
      description: 'Coverage of your special events with artistic perspective',
      image: '/images/services/events.png'
    },
    {
      id: 3,
      title: 'Videography',
      description: 'High-quality video production for events and creative projects',
      image: '/images/services/videography.png'
    },
    {
      id: 4,
      title: 'Pre-Wedding',
      description: 'Beautiful pre-wedding photo shoots capturing love stories',
      image: '/images/services/pre_wedding.png'
    },
    {
      id: 5,
      title: 'Post-Wedding',
      description: 'Celebrate your married life with intimate photo sessions',
      image: '/images/services/post_wedding.png'
    },
    {
      id: 6,
      title: 'Model Portfolio',
      description: 'Professional portfolio shoots for aspiring models',
      image: '/images/services/model_portfolio.png'
    },
    {
      id: 7,
      title: 'Product Photography',
      description: 'Showcase your products with stunning professional photos',
      image: '/images/services/product.png'
    },
    {
      id: 8,
      title: 'Baby & Family',
      description: 'Capture precious moments of your growing family',
      image: '/images/services/baby.png'
    },
    {
      id: 9,
      title: 'Headshots',
      description: 'Professional headshots for corporate and personal branding',
      image: '/images/services/headshots.png'
    }
  ];

  useEffect(() => {
    // Simple animation without ScrollTrigger complexity
    const serviceElements = document.querySelectorAll('.service');
    serviceElements.forEach((service, i) => {
      service.style.opacity = '0';
      service.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        gsap.to(service, {
          duration: 0.6,
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          delay: i * 0.1
        });
      }, 100);
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="services" id="services">
      <h2>Our Services</h2>
      <p className="services-intro">Professional photography and videography services tailored to your needs</p>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service">
            <div className="service-icon">
              <img src={service.image} alt={service.title} />
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
