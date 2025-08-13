window.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Preload hero image with priority
    const preloadHero = () => {
        return new Promise((resolve) => {
            const heroImg = new Image();
            heroImg.src = 'images/hero.png';
            heroImg.fetchPriority = 'high';
            heroImg.onload = () => resolve();
        });
    };

    // Initialize animations after hero image loads
    preloadHero().then(() => {
        // Hero section animation with improved timing
        gsap.from('.hero', {
            duration: 1,
            opacity: 0,
            ease: 'power2.inOut',
            clearProps: 'all'
        });

        gsap.timeline()
            .from('.hero h1', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            })
            .from('.hero p', {
                duration: 0.8,
                y: 20,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.hero .btn', {
                duration: 0.8,
                y: 20,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.5');

        // Services section animation - Fixed version
        gsap.utils.toArray('.service').forEach((service, i) => {
            gsap.from(service, {
                scrollTrigger: {
                    trigger: service,
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play none none reverse',
                    // Remove scrub to prevent stuttering
                },
                duration: 1,
                y: 50,
                opacity: 0,
                scale: 0.95,
                ease: 'power3.out',
                delay: i * 0.2 // Stagger effect without timeline
            });
        });
    });
});