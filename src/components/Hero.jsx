import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const Hero = () => {
  const fullText = 'Your moments, our craft !!!';
  const letters = fullText.split('');

  useEffect(() => {
    setTimeout(() => {
      const timeline = gsap.timeline();
      
      // Animate each letter with handwriting effect
      letters.forEach((letter, index) => {
        if (letter !== ' ') {
          timeline.to(`.letter-${index}`, {
            duration: 0.2,
            ease: 'power1.out',
            opacity: 1
          }, index * 0.12);
        }
      });
      
      timeline
        .from('.hero p', {
          duration: 0.8,
          y: 20,
          opacity: 0,
          ease: 'power3.out'
        }, letters.length * 0.12)
        .from('.hero .btn', {
          duration: 0.8,
          y: 20,
          opacity: 0,
          ease: 'power3.out'
        }, '-=0.5');
    }, 100);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="cursive-heading">
          {letters.map((letter, index) => (
            <span key={index} className={`letter-${index}`}>
              {letter}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
};

export default Hero;
