import React, { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { id: 1, image: '/images/photo1.jpg', alt: 'Portfolio photo 1' },
    { id: 2, image: '/images/photo7.jpg', alt: 'Portfolio photo 7' },
    { id: 3, image: '/images/photo8.jpg', alt: 'Portfolio photo 8' },
    { id: 4, image: '/images/photo9.jpg', alt: 'Portfolio photo 9' },
    { id: 5, image: '/images/photo10.jpg', alt: 'Portfolio photo 10' },
    { id: 6, image: '/images/photo11.jpg', alt: 'Portfolio photo 11' },
    { id: 7, image: '/images/photo12.jpg', alt: 'Portfolio photo 12' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="portfolio" id="portfolio">
      <h2>Portfolio</h2>
      <div className="carousel">
        <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <img
                src={slide.image}
                alt={slide.alt}
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="copyright">© ShootWithKamzy</div>
            </div>
          ))}
        </div>
        <div className="nav">
          <button className="prev" onClick={prevSlide} aria-label="Previous slide">
            &#10094;
          </button>
          <button className="next" onClick={nextSlide} aria-label="Next slide">
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
