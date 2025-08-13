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

        // Enhanced services section animation
        const servicesTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.services',
                start: 'top 75%',
                end: 'center center',
                toggleActions: 'play none none reverse',
                scrub: 1.5
            }
        });

        // Staggered service cards animation
        gsap.utils.toArray('.service').forEach((service, i) => {
            servicesTimeline.from(service, {
                duration: 1,
                y: 50,
                opacity: 0,
                rotation: 2,
                scale: 0.95,
                ease: 'power3.out',
                stagger: {
                    amount: 0.8,
                    from: 'start'
                }
            }, i * 0.2);
        });
    });
});