const slidesContainer = document.querySelector('.slides');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;
let autoSlideTimer;

function updateSlidePosition() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function updateActiveDot() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
        dot.setAttribute('aria-selected', String(index === currentIndex));
    });
}

function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlidePosition();
    updateActiveDot();
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => showSlide(currentIndex + 1), 5000);
}

function stopAutoSlide() {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
    }
}

function createCarouselDots() {
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });
}

function initCarousel() {
    if (!slides.length || !slidesContainer || !prevBtn || !nextBtn || !dotsContainer) {
        return;
    }

    createCarouselDots();
    showSlide(0);
    startAutoSlide();

    prevBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        startAutoSlide();
    });

    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            showSlide(currentIndex - 1);
            startAutoSlide();
        }
        if (event.key === 'ArrowRight') {
            showSlide(currentIndex + 1);
            startAutoSlide();
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                showSlide(currentIndex - 1);
            } else {
                showSlide(currentIndex + 1);
            }
            startAutoSlide();
        }
    }, { passive: true });
}

function setFormStatus(type, message) {
    const formStatus = document.getElementById('formStatus');
    formStatus.textContent = message;
    formStatus.classList.remove('success', 'error');
    if (type) {
        formStatus.classList.add(type);
    }
}

function sanitizePhone(value) {
    let formatted = value.replace(/[^\d+]/g, '');
    if (formatted && formatted[0] !== '+') {
        formatted = `+${formatted}`;
    }
    formatted = `+${formatted.replace(/\+/g, '')}`;

    if (formatted.length > 16) {
        formatted = formatted.slice(0, 16);
    }

    return formatted;
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const phoneInput = document.getElementById('contactNumber');
    if (!form || !phoneInput) {
        return;
    }

    form.reset();

    phoneInput.addEventListener('input', (event) => {
        event.target.value = sanitizePhone(event.target.value);
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setFormStatus('', 'Sending your message...');

        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            setFormStatus('error', 'Enter a valid international phone number, like +971509943327.');
            phoneInput.focus();
            return;
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            form.reset();
            setFormStatus('success', 'Message sent successfully. I will get back to you soon.');
        } catch (error) {
            setFormStatus('error', 'Message failed to send. Please try again in a moment.');
        }
    });
}

function initSectionHighlight() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => {
                const match = link.getAttribute('href') === `#${entry.target.id}`;
                link.style.color = match ? 'var(--accent)' : '';
            });
        });
    }, {
        threshold: 0.45
    });

    sections.forEach((section) => observer.observe(section));
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length || !('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        revealElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.01,
        rootMargin: '0px 0px -10% 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuBtn || !overlay) {
        return;
    }

    function toggleMenu() {
        const isActive = menuBtn.classList.toggle('active');
        overlay.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', String(isActive));
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    function closeMenu() {
        menuBtn.classList.remove('active');
        overlay.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) {
                closeMenu();
                return;
            }

            event.preventDefault();
            const target = document.querySelector(href);
            if (!target) {
                closeMenu();
                return;
            }

            target.classList.add('visible');
            closeMenu();
            requestAnimationFrame(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', href);
            });
        });
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 480) {
            closeMenu();
        }
    });
}

function initContextMenuDisable() {
    // Disable right-click context menu on images
    document.addEventListener('contextmenu', (event) => {
        if (event.target.tagName === 'IMG') {
            event.preventDefault();
        }
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        return;
    }

    const label = themeToggle.querySelector('.theme-toggle-text');
    const storageKey = 'swk-theme';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function updateToggleUi(theme) {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
        if (label) {
            label.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }
    }

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        updateToggleUi(theme);
    }

    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme || (systemPrefersDark.matches ? 'dark' : 'light');
    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem(storageKey, nextTheme);
    });

    systemPrefersDark.addEventListener('change', (event) => {
        if (localStorage.getItem(storageKey)) {
            return;
        }
        applyTheme(event.matches ? 'dark' : 'light');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCarousel();
    initContactForm();
    initSectionHighlight();
    initScrollReveal();
    initMobileMenu();
    initContextMenuDisable();
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const form = document.getElementById('contactForm');
        if (form) {
            form.reset();
            setFormStatus('', '');
        }
    }
});
