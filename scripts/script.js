function setFormStatus(type, message) {
    const formStatus = document.getElementById('formStatus');
    if (!formStatus) {
        return;
    }

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

function initPortfolioGallery() {
    const spotlight = document.querySelector('.portfolio-spotlight');
    const track = document.getElementById('portfolioTrack');
    const cards = Array.from(document.querySelectorAll('.portfolio-card'));
    const currentLabel = document.getElementById('portfolioCurrentLabel');
    const spotlightImage = document.getElementById('portfolioSpotlightImage');
    const spotlightIndex = document.getElementById('portfolioSpotlightIndex');
    const spotlightTag = document.getElementById('portfolioSpotlightTag');
    const spotlightTitle = document.getElementById('portfolioSpotlightTitle');
    const spotlightDescription = document.getElementById('portfolioSpotlightDescription');
    const prevBtn = document.getElementById('portfolioPrev');
    const nextBtn = document.getElementById('portfolioNext');

    if (
        !spotlight ||
        !track ||
        !cards.length ||
        !currentLabel ||
        !spotlightImage ||
        !spotlightIndex ||
        !spotlightTag ||
        !spotlightTitle ||
        !spotlightDescription ||
        !prevBtn ||
        !nextBtn
    ) {
        return;
    }

    let activeIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    const mobileMediaQuery = window.matchMedia('(max-width: 640px)');
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const formatIndex = (value) => String(value).padStart(2, '0');

    function setActiveCard(index, options = {}) {
        const nextIndex = clamp(index, 0, cards.length - 1);
        const activeCard = cards[nextIndex];

        if (!activeCard) {
            return;
        }

        if (nextIndex === activeIndex && !options.force) {
            if (options.focus) {
                activeCard.focus({ preventScroll: true });
            }
            return;
        }

        activeIndex = nextIndex;

        cards.forEach((card, cardIndex) => {
            const isActive = cardIndex === nextIndex;
            card.classList.toggle('is-active', isActive);
            card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        spotlightImage.src = activeCard.dataset.image || spotlightImage.src;
        spotlightImage.alt = activeCard.dataset.alt || '';
        spotlightTag.textContent = activeCard.dataset.tag || activeCard.dataset.title || `Frame ${nextIndex + 1}`;
        spotlightTitle.textContent = activeCard.dataset.headline || activeCard.dataset.title || `Frame ${nextIndex + 1}`;
        spotlightDescription.textContent = activeCard.dataset.description || '';
        spotlightIndex.textContent = `${formatIndex(nextIndex + 1)} / ${formatIndex(cards.length)}`;
        currentLabel.textContent = `Selected frame: ${activeCard.dataset.title || `Frame ${nextIndex + 1}`}`;
        prevBtn.disabled = nextIndex === 0;
        nextBtn.disabled = nextIndex === cards.length - 1;

        if (mobileMediaQuery.matches) {
            activeCard.scrollIntoView({
                behavior: options.instant ? 'auto' : 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }

        if (options.focus) {
            activeCard.focus({ preventScroll: true });
        }
    }

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            setActiveCard(index);
        });

        card.addEventListener('focus', () => {
            setActiveCard(index);
        });
    });

    track.addEventListener('keydown', (event) => {
        let nextIndex = activeIndex;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIndex = Math.min(activeIndex + 1, cards.length - 1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIndex = Math.max(activeIndex - 1, 0);
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = cards.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        setActiveCard(nextIndex, { focus: true });
    });

    prevBtn.addEventListener('click', () => {
        setActiveCard(activeIndex - 1, { focus: true });
    });

    nextBtn.addEventListener('click', () => {
        setActiveCard(activeIndex + 1, { focus: true });
    });

    spotlight.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? 0;
        touchStartY = event.changedTouches[0]?.clientY ?? 0;
    }, { passive: true });

    spotlight.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0]?.clientX ?? 0;
        const touchEndY = event.changedTouches[0]?.clientY ?? 0;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) < 36 || Math.abs(deltaX) <= Math.abs(deltaY)) {
            return;
        }

        if (deltaX < 0) {
            setActiveCard(activeIndex + 1);
            return;
        }

        setActiveCard(activeIndex - 1);
    }, { passive: true });

    setActiveCard(0, { instant: true, force: true });

    const preloadImages = () => {
        cards.forEach((card) => {
            const src = card.dataset.image;
            if (!src || src === spotlightImage.src) {
                return;
            }

            const image = new Image();
            image.decoding = 'async';
            image.src = src;
        });
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(preloadImages, { timeout: 1200 });
    } else {
        window.setTimeout(preloadImages, 400);
    }
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const phoneInput = document.getElementById('contactNumber');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const progressBar = document.getElementById('bookingProgressBar');
    const stepIndicators = Array.from(document.querySelectorAll('[data-step-indicator]'));
    const nextBtn = document.getElementById('bookingNext');
    const backBtn = document.getElementById('bookingBack');
    const submitBtn = document.getElementById('bookingSubmit');
    const summaryField = document.getElementById('inquirySummary');
    const summaryContainer = document.getElementById('bookingSummary');
    const preferredDateInput = document.getElementById('preferredDate');

    if (
        !form ||
        !phoneInput ||
        !steps.length ||
        !progressBar ||
        !stepIndicators.length ||
        !nextBtn ||
        !backBtn ||
        !submitBtn ||
        !summaryField ||
        !summaryContainer
    ) {
        return;
    }

    let currentStep = 0;
    const phoneRegex = /^\+[1-9]\d{1,14}$/;

    if (preferredDateInput) {
        preferredDateInput.min = new Date().toISOString().split('T')[0];
    }

    function getFieldValue(name) {
        const checked = form.querySelector(`[name="${name}"]:checked`);
        if (checked) {
            return checked.value.trim();
        }

        const field = form.elements[name];
        if (!field || typeof field.value !== 'string') {
            return '';
        }

        return field.value.trim();
    }

    function formatDate(value) {
        if (!value) {
            return 'Flexible';
        }

        const date = new Date(`${value}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
    }

    function escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function buildSummaryItems() {
        return [
            ['Service', getFieldValue('serviceType') || 'Not selected yet'],
            ['Coverage', getFieldValue('coverageType') || 'Not selected yet'],
            ['Timeline', getFieldValue('timeline') || 'Not selected yet'],
            ['Preferred date', formatDate(getFieldValue('preferredDate'))],
            ['Location', getFieldValue('location') || 'Not shared yet'],
            ['Budget', getFieldValue('budgetRange') || 'Not selected yet'],
            ['Name', getFieldValue('name') || 'Not shared yet'],
            ['Email', getFieldValue('email') || 'Not shared yet'],
            ['Phone', getFieldValue('contactNumber') || 'Not shared yet']
        ];
    }

    function renderSummary() {
        const summaryItems = buildSummaryItems();

        summaryContainer.innerHTML = `
            <div class="booking-summary-head">
                <h4>Inquiry snapshot</h4>
                <p>This is the context I will use when I respond with the best-fit quote and next steps.</p>
            </div>
            <div class="booking-summary-list">
                ${summaryItems.map(([label, value]) => `
                    <div class="booking-summary-item">
                        <span>${escapeHtml(label)}</span>
                        <strong>${escapeHtml(value)}</strong>
                    </div>
                `).join('')}
            </div>
        `;

        summaryField.value = summaryItems
            .map(([label, value]) => `${label}: ${value}`)
            .join(' | ');
    }

    function focusCurrentStep() {
        const activeStep = steps[currentStep];
        const focusTarget = activeStep.querySelector(
            'input:not([type="hidden"]):not([type="radio"]), textarea, .booking-choice input, button'
        );

        if (focusTarget) {
            focusTarget.focus({ preventScroll: true });
        }
    }

    function updateStepUi() {
        steps.forEach((step, index) => {
            const isActive = index === currentStep;
            step.hidden = !isActive;
            step.classList.toggle('is-active', isActive);
            step.setAttribute('aria-hidden', String(!isActive));
        });

        stepIndicators.forEach((indicator, index) => {
            const isActive = index === currentStep;
            indicator.classList.toggle('is-active', isActive);
            indicator.classList.toggle('is-complete', index < currentStep);
            indicator.setAttribute('aria-current', isActive ? 'step' : 'false');
        });

        progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
        backBtn.hidden = currentStep === 0;
        nextBtn.hidden = currentStep === steps.length - 1;
        submitBtn.hidden = currentStep !== steps.length - 1;
        nextBtn.textContent = currentStep === steps.length - 2 ? 'Review Inquiry' : 'Continue';

        renderSummary();
    }

    function validateGroup(group) {
        const radios = Array.from(group.querySelectorAll('input[type="radio"]'));
        if (!radios.length) {
            return true;
        }

        if (radios.some((radio) => radio.checked)) {
            return true;
        }

        setFormStatus('error', group.dataset.error || 'Please choose an option to continue.');
        radios[0].focus();
        return false;
    }

    function validateStep(index) {
        const step = steps[index];
        if (!step) {
            return true;
        }

        setFormStatus('', '');

        const groups = Array.from(step.querySelectorAll('[data-required-group]'));
        for (const group of groups) {
            if (!validateGroup(group)) {
                return false;
            }
        }

        const fields = Array.from(step.querySelectorAll('input, textarea'))
            .filter((field) => field.required && field.type !== 'radio' && field.type !== 'hidden');

        for (const field of fields) {
            if (!field.reportValidity()) {
                setFormStatus('error', 'Please complete the required fields before continuing.');
                return false;
            }
        }

        return true;
    }

    function goToStep(index) {
        currentStep = Math.min(Math.max(index, 0), steps.length - 1);
        updateStepUi();
        window.requestAnimationFrame(focusCurrentStep);
    }

    function resetGuidedFlow() {
        form.reset();
        currentStep = 0;
        renderSummary();
        updateStepUi();
        setFormStatus('', '');
    }

    form.reset();
    renderSummary();
    updateStepUi();
    form._resetBookingFlow = resetGuidedFlow;

    phoneInput.addEventListener('input', (event) => {
        event.target.value = sanitizePhone(event.target.value);
        renderSummary();
    });

    form.addEventListener('input', (event) => {
        if (event.target !== phoneInput) {
            renderSummary();
        }
    });

    form.addEventListener('change', renderSummary);

    nextBtn.addEventListener('click', () => {
        if (!validateStep(currentStep)) {
            return;
        }

        goToStep(currentStep + 1);
    });

    backBtn.addEventListener('click', () => {
        setFormStatus('', '');
        goToStep(currentStep - 1);
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        for (let index = 0; index < steps.length; index += 1) {
            if (!validateStep(index)) {
                goToStep(index);
                return;
            }
        }

        if (!phoneRegex.test(phoneInput.value)) {
            goToStep(steps.length - 1);
            setFormStatus('error', 'Enter a valid international phone number, like +971509943327.');
            phoneInput.focus();
            return;
        }

        renderSummary();
        setFormStatus('', 'Sending your inquiry...');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            resetGuidedFlow();
            setFormStatus('success', 'Inquiry sent successfully. I will get back to you with the best-fit package and next steps.');
        } catch (error) {
            setFormStatus('error', 'Inquiry failed to send. Please try again in a moment.');
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
        revealElements.forEach((el) => el.classList.add('visible'));
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

function initCameraCursor() {
    const cursor = document.getElementById('cameraCursor');
    const clickBurst = document.getElementById('cameraClickBurst');
    const finePointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!cursor || !clickBurst || !finePointerQuery.matches || reducedMotionQuery.matches) {
        return;
    }

    document.body.classList.add('camera-cursor-enabled');

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animationFrame = 0;
    let shootTimeout = 0;
    let flashTimeout = 0;
    let isTextFieldTarget = false;
    let isFramingTarget = false;

    const lerp = (start, end, amount) => start + ((end - start) * amount);

    function renderCursor() {
        currentX = lerp(currentX, targetX, 0.32);
        currentY = lerp(currentY, targetY, 0.32);

        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

        if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
            animationFrame = window.requestAnimationFrame(renderCursor);
            return;
        }

        currentX = targetX;
        currentY = targetY;
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        animationFrame = 0;
    }

    function startCursorRender() {
        if (!animationFrame) {
            animationFrame = window.requestAnimationFrame(renderCursor);
        }
    }

    function updateCursorState(target) {
        const textField = target.closest('input, textarea, select, [contenteditable="true"]');
        const framingTarget = target.closest('a, button, .hero-media, .portfolio-spotlight');
        const nextIsTextFieldTarget = Boolean(textField);
        const nextIsFramingTarget = Boolean(framingTarget) && !nextIsTextFieldTarget;

        if (
            nextIsTextFieldTarget === isTextFieldTarget &&
            nextIsFramingTarget === isFramingTarget
        ) {
            return;
        }

        isTextFieldTarget = nextIsTextFieldTarget;
        isFramingTarget = nextIsFramingTarget;

        cursor.classList.toggle('is-hidden', isTextFieldTarget);
        cursor.classList.toggle('is-aiming', isFramingTarget);
    }

    function showCursor() {
        cursor.classList.add('is-visible');
    }

    function hideCursor() {
        cursor.classList.remove('is-visible', 'is-aiming', 'is-hidden', 'is-shooting');
        isTextFieldTarget = false;
        isFramingTarget = false;
    }

    function triggerShutter(x, y) {
        cursor.classList.remove('is-shooting');
        clickBurst.classList.remove('is-active');
        document.body.classList.remove('camera-shutter-flash');

        document.body.style.setProperty('--shutter-x', `${x}px`);
        document.body.style.setProperty('--shutter-y', `${y}px`);
        clickBurst.style.setProperty('--burst-x', `${x}px`);
        clickBurst.style.setProperty('--burst-y', `${y}px`);

        void cursor.offsetWidth;
        void clickBurst.offsetWidth;

        cursor.classList.add('is-shooting');
        clickBurst.classList.add('is-active');
        document.body.classList.add('camera-shutter-flash');

        window.clearTimeout(shootTimeout);
        window.clearTimeout(flashTimeout);

        shootTimeout = window.setTimeout(() => {
            cursor.classList.remove('is-shooting');
        }, 320);

        flashTimeout = window.setTimeout(() => {
            clickBurst.classList.remove('is-active');
            document.body.classList.remove('camera-shutter-flash');
        }, 360);
    }

    document.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') {
            return;
        }

        targetX = event.clientX;
        targetY = event.clientY;

        showCursor();
        startCursorRender();
    }, { passive: true });

    document.addEventListener('pointerover', (event) => {
        if (event.pointerType !== 'mouse') {
            return;
        }

        updateCursorState(event.target);
    }, { passive: true });

    document.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse') {
            return;
        }

        targetX = event.clientX;
        targetY = event.clientY;

        showCursor();
        startCursorRender();
        triggerShutter(event.clientX, event.clientY);
    });

    document.addEventListener('pointerleave', hideCursor);
    window.addEventListener('blur', hideCursor);
    window.addEventListener('mouseout', (event) => {
        if (!event.relatedTarget) {
            hideCursor();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCameraCursor();
    initPortfolioGallery();
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
            if (typeof form._resetBookingFlow === 'function') {
                form._resetBookingFlow();
            } else {
                form.reset();
                setFormStatus('', '');
            }
        }
    }
});
