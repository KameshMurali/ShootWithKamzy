window.addEventListener('DOMContentLoaded', () => {
    if (!window.gsap || !window.ScrollTrigger) {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const breakpoints = {
        mobile: 480,
        tablet: 768,
        desktop: 1024
    };

    const getResponsiveValue = (mobile, tablet, desktop) => {
        const width = window.innerWidth;
        if (width <= breakpoints.mobile) return mobile;
        if (width <= breakpoints.tablet) return tablet;
        return desktop;
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const preloadHero = () => new Promise((resolve) => {
        const heroVideo = document.querySelector('.hero-video-main');

        if (!heroVideo || heroVideo.readyState >= 1) {
            resolve();
            return;
        }

        const onReady = () => resolve();
        heroVideo.addEventListener('loadedmetadata', onReady, { once: true });
        heroVideo.addEventListener('error', onReady, { once: true });
    });

    function createSectionTimeline(trigger, selectors, options = {}) {
        const elements = selectors
            .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
            .filter(Boolean);

        if (!elements.length) {
            return null;
        }

        return gsap.timeline({
            scrollTrigger: {
                trigger,
                start: options.start || 'top 76%',
                once: true
            },
            defaults: {
                duration: options.duration || 0.8,
                ease: options.ease || 'power3.out'
            }
        }).from(elements, {
            y: options.y ?? 36,
            autoAlpha: 0,
            stagger: options.stagger || 0.1,
            clearProps: 'all'
        });
    }

    function initHeroMotion() {
        const navItems = gsap.utils
            .toArray('.nav-links li, .instagram-link, .mobile-actions > *')
            .filter((element) => window.getComputedStyle(element).display !== 'none');

        const heroTimeline = gsap.timeline({
            defaults: { ease: 'power2.out' },
            smoothChildTiming: true
        });

        heroTimeline
            .from('.site-header', {
                y: -14,
                autoAlpha: 0,
                duration: 0.72,
                clearProps: 'all'
            })
            .from('.logo', {
                x: -10,
                autoAlpha: 0,
                duration: 0.55,
                clearProps: 'all'
            }, 0.14)
            .from(navItems, {
                y: -10,
                autoAlpha: 0,
                stagger: 0.06,
                duration: 0.5,
                clearProps: 'all'
            }, 0.18)
            .from('.page-glow', {
                autoAlpha: 0,
                scale: 0.97,
                duration: 1.35,
                ease: 'sine.out',
                clearProps: 'all'
            }, 0)
            .from('.hero-media', {
                clipPath: 'inset(6% 5% 9% 5% round 36px)',
                scale: 1.02,
                autoAlpha: 0,
                duration: 1.35,
                ease: 'sine.out',
                clearProps: 'all'
            }, 0.05)
            .from('.hero-video-backdrop', {
                scale: 1.18,
                autoAlpha: 0,
                duration: 1.35,
                ease: 'sine.out',
                clearProps: 'all'
            }, 0.05)
            .from('.hero-video-main', {
                scale: 1.06,
                filter: 'blur(6px) brightness(0.86)',
                duration: 1.45,
                ease: 'sine.out',
                clearProps: 'transform,filter'
            }, 0.05)
            .from('.hero-overlay', {
                y: 30,
                clipPath: 'inset(0 0 10% 0 round 24px)',
                autoAlpha: 0,
                duration: 1.08,
                ease: 'power2.out',
                clearProps: 'all'
            }, 0.18)
            .from('.eyebrow', {
                y: 12,
                autoAlpha: 0,
                duration: 0.52,
                clearProps: 'all'
            }, 0.34)
            .from('.hero h1', {
                y: 26,
                autoAlpha: 0,
                duration: 0.92,
                clearProps: 'all'
            }, 0.42)
            .from('.hero-subtitle', {
                y: 18,
                autoAlpha: 0,
                duration: 0.78,
                clearProps: 'all'
            }, 0.54)
            .from('.hero-cta-row .btn', {
                y: 12,
                autoAlpha: 0,
                stagger: 0.1,
                duration: 0.62,
                clearProps: 'all'
            }, 0.68)
            .from('.hero-metrics li', {
                y: 12,
                autoAlpha: 0,
                scale: 0.98,
                stagger: 0.08,
                duration: 0.58,
                clearProps: 'all'
            }, 0.8);

        gsap.to('.hero-media', {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.1
            }
        });
    }

    function initPortfolioMotion() {
        const cards = gsap.utils.toArray('.portfolio-card');
        if (!cards.length) {
            return;
        }

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.portfolio',
                start: 'top 74%',
                once: true
            },
            defaults: {
                ease: 'power3.out'
            }
        });

        timeline
            .from('.portfolio-kicker', {
                y: 20,
                autoAlpha: 0,
                duration: 0.45,
                clearProps: 'all'
            })
            .from('.portfolio-intro h3', {
                y: 30,
                autoAlpha: 0,
                duration: 0.7,
                clearProps: 'all'
            }, '-=0.2')
            .from('.portfolio-meta span', {
                y: 18,
                autoAlpha: 0,
                stagger: 0.08,
                duration: 0.45,
                clearProps: 'all'
            }, '-=0.35')
            .from('.portfolio-spotlight', {
                y: 34,
                autoAlpha: 0,
                scale: 0.985,
                duration: 0.8,
                clearProps: 'all'
            }, '-=0.22')
            .from(cards, {
                y: 28,
                autoAlpha: 0,
                stagger: 0.08,
                duration: 0.55,
                clearProps: 'all'
            }, '-=0.45')
            .from('.portfolio-gallery-footer', {
                y: 18,
                autoAlpha: 0,
                duration: 0.4,
                clearProps: 'all'
            }, '-=0.25');
    }

    function initServicesMotion() {
        const services = gsap.utils.toArray('.service');
        if (!services.length) {
            return;
        }

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.services',
                start: 'top 72%',
                once: true
            }
        });

        timeline
            .from('.services h2, .services .section-subtitle', {
                y: 28,
                autoAlpha: 0,
                stagger: 0.1,
                duration: 0.55,
                ease: 'power3.out',
                clearProps: 'all'
            })
            .from(services, {
                y: getResponsiveValue(24, 34, 44),
                autoAlpha: 0,
                scale: getResponsiveValue(0.985, 0.97, 0.955),
                stagger: {
                    each: 0.07,
                    from: 'start'
                },
                duration: 0.65,
                ease: 'power2.out',
                clearProps: 'all'
            }, '-=0.18');
    }

    function initAboutMotion() {
        createSectionTimeline('.about', [
            '.about h2',
            '.about p'
        ], {
            start: 'top 78%',
            stagger: 0.12,
            y: 30,
            duration: 0.7
        });
    }

    function initContactMotion() {
        const contactElements = Array.from(document.querySelectorAll(
            '.contact-lead, .booking-progress-shell, .form-step.is-active > *, .booking-nav, .form-status'
        ));

        if (!contactElements.length) {
            return;
        }

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 76%',
                once: true
            }
        });

        timeline
            .from('.contact h2, .contact .section-subtitle', {
                y: 28,
                autoAlpha: 0,
                stagger: 0.1,
                duration: 0.55,
                ease: 'power3.out',
                clearProps: 'all'
            })
            .from(contactElements, {
                y: 22,
                autoAlpha: 0,
                stagger: 0.06,
                duration: 0.5,
                ease: 'power2.out',
                clearProps: 'all'
            }, '-=0.15');
    }

    function initAnimations() {
        initHeroMotion();
        initPortfolioMotion();
        initServicesMotion();
        initAboutMotion();
        initContactMotion();
    }

    function initReducedMotion() {
        gsap.set([
            '.site-header',
            '.logo',
            '.nav-links li',
            '.instagram-link',
            '.mobile-actions > *',
            '.page-glow',
            '.hero-media',
            '.hero-video-backdrop',
            '.hero-video-main',
            '.hero-overlay',
            '.hero-metrics li',
            '.portfolio-kicker',
            '.portfolio-intro h3',
            '.portfolio-meta span',
            '.portfolio-spotlight',
            '.portfolio-card',
            '.portfolio-gallery-footer',
            '.service',
            '.about h2',
            '.about p',
            '.contact h2',
            '.contact .section-subtitle',
            '.contact-lead',
            '.booking-progress-shell',
            '.form-step > *',
            '.booking-nav',
            '.form-status'
        ], {
            clearProps: 'all'
        });
    }

    preloadHero().then(() => {
        if (prefersReducedMotion.matches) {
            initReducedMotion();
            return;
        }

        initAnimations();
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
});
