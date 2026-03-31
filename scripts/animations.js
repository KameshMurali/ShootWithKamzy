window.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Responsive breakpoints
    const breakpoints = {
        mobile: 480,
        tablet: 768,
        desktop: 1024
    };

    // Responsive values based on screen size
    const getResponsiveValue = (mobile, tablet, desktop) => {
        const width = window.innerWidth;
        if (width <= breakpoints.mobile) return mobile;
        if (width <= breakpoints.tablet) return tablet;
        return desktop;
    };

    // Wait for hero media to be ready before entrance animation.
    const preloadHero = () => {
        return new Promise((resolve) => {
            const heroVideo = document.querySelector('.hero-video');

            if (!heroVideo) {
                resolve();
                return;
            }

            if (heroVideo.readyState >= 1) {
                resolve();
                return;
            }

            const onReady = () => {
                heroVideo.removeEventListener('loadedmetadata', onReady);
                heroVideo.removeEventListener('error', onReady);
                resolve();
            };

            heroVideo.addEventListener('loadedmetadata', onReady, { once: true });
            heroVideo.addEventListener('error', onReady, { once: true });
        });
    };

    // Initialize animations after hero media is ready
    preloadHero().then(() => {
        // Hero section animation with responsive timing
        gsap.timeline()
            .from('.hero', {
                duration: getResponsiveValue(0.6, 0.8, 1),
                opacity: 0,
                ease: 'power2.inOut',
                clearProps: 'all'
            })

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

                // Services section animation with responsive values
        gsap.utils.toArray('.service').forEach((service, i) => {
            gsap.from(service, {
                scrollTrigger: {
                    trigger: service,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: getResponsiveValue(0.6, 0.7, 0.8),
                y: getResponsiveValue(20, 30, 40),
                opacity: 0,
                scale: getResponsiveValue(0.98, 0.96, 0.95),
                ease: 'power2.out',
                delay: i * getResponsiveValue(0.1, 0.15, 0.2)
            });
        });
    });

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.timeScale(0.5);
    }
});
