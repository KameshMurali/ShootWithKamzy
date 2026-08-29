const WHATSAPP_NUMBER = '971509969876';

function buildWhatsAppUrl(text) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

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

        if (mobileMediaQuery.matches && !options.initial) {
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

    setActiveCard(0, { instant: true, force: true, initial: true });

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

    // Preloading all seven full-size frames on load cost every visitor the whole
    // gallery whether they touched it or not. Warm them on first intent instead.
    let preloaded = false;

    const warmGallery = () => {
        if (preloaded) {
            return;
        }

        preloaded = true;

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(preloadImages, { timeout: 1200 });
        } else {
            window.setTimeout(preloadImages, 200);
        }
    };

    ['pointerenter', 'touchstart', 'focusin', 'click'].forEach((evt) => {
        track.addEventListener(evt, warmGallery, { once: true, passive: true });
    });

    if ('IntersectionObserver' in window) {
        const galleryObserver = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                warmGallery();
                galleryObserver.disconnect();
            }
        }, { rootMargin: '200px' });

        galleryObserver.observe(track);
    } else {
        warmGallery();
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
            ['Package', getFieldValue('configuredPackage') || 'Not configured'],
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
            setFormStatus('error', 'Enter a valid international phone number, like +971509969876.');
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
            setFormStatus('error', 'Inquiry failed to send. Reach me on WhatsApp or at hello@tonewbeginning.com instead.');
            offerWhatsAppFallback(form);
        }
    });
}

function offerWhatsAppFallback(form) {
    const status = document.getElementById('formStatus');

    if (!status || status.querySelector('.form-status-whatsapp')) {
        return;
    }

    const data = new FormData(form);
    const lines = [
        'Hi Kamzy, my inquiry did not send through the website. Details:',
        `Name: ${data.get('name') || '-'}`,
        `Email: ${data.get('email') || '-'}`,
        `Phone: ${data.get('contactNumber') || '-'}`,
        `Service: ${data.get('serviceType') || '-'}`,
        `Coverage: ${data.get('coverageType') || '-'}`,
        `Timeline: ${data.get('timeline') || '-'}`,
        `Location: ${data.get('location') || '-'}`,
        `Budget: ${data.get('budgetRange') || '-'}`
    ];

    const notes = data.get('message');

    if (notes) {
        lines.push(`Notes: ${notes}`);
    }

    const link = document.createElement('a');
    link.className = 'form-status-whatsapp btn btn-whatsapp';
    link.href = buildWhatsAppUrl(lines.join('\n'));
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Send via WhatsApp';
    status.appendChild(document.createElement('br'));
    status.appendChild(link);
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

function initHeroVideo() {
    const video = document.querySelector('.hero-video-main');

    if (!video || !video.dataset.src) {
        return;
    }

    // The poster carries the hero on phones and on metered or slow connections;
    // only attach the clip where it is cheap to fetch and decode.
    const connection = navigator.connection || {};
    const slow = /2g/.test(connection.effectiveType || '');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wideEnough = window.matchMedia('(min-width: 900px)').matches;

    if (!wideEnough || slow || connection.saveData || reduced) {
        return;
    }

    const source = document.createElement('source');
    source.src = video.dataset.src;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();

    const play = video.play();

    if (play && typeof play.catch === 'function') {
        play.catch(() => {});
    }
}

/* ---------------------------------------------------------------------------
   Service configurator: pick a package, drag for extra edited images, tick
   add-ons, see an itemised total, send it to WhatsApp.
   Reads every price from scripts/pricing-data.js.
   --------------------------------------------------------------------------- */

function formatAed(amount) {
    return new Intl.NumberFormat(PRICING_CONFIG.locale, { maximumFractionDigits: 0 }).format(amount);
}

function getTierList(service, groupId) {
    if (!service.groups) {
        return service.tiers;
    }

    const group = service.groups.find((item) => item.id === groupId) || service.groups[0];
    return group.tiers;
}

function getAddOnList(service, groupId) {
    const keys = service.groups
        ? (service.groups.find((item) => item.id === groupId) || service.groups[0]).addOns
        : service.addOns || [];

    const shared = keys.map((key) => Object.assign({ id: key }, SHARED_ADD_ONS[key]));
    const extra = Object.keys(service.extraAddOns || {})
        .map((key) => Object.assign({ id: key }, service.extraAddOns[key]));

    return shared.concat(extra);
}

/* Pure: no DOM. The returned `lines` array is the audit trail shown on screen,
   so every dirham in `total` is traceable to a row the visitor can read. */
function computeQuote(serviceKey, selection) {
    const service = SERVICE_PRICING[serviceKey];

    if (!service) {
        return null;
    }

    const tiers = getTierList(service, selection.groupId);
    const tier = tiers.find((item) => item.id === selection.tierId) || tiers[0];
    const lines = [];
    const notes = [];
    let subtotal = 0;
    let mode = 'exact';

    if (tier.enquireOnly) {
        mode = 'enquire';
    } else if (tier.fromPrice) {
        mode = 'from';
    }

    if (!tier.enquireOnly) {
        lines.push({ label: tier.name, detail: tier.includes.slice(0, 3).join(' · '), amount: tier.price });
        subtotal += tier.price;
    } else {
        lines.push({ label: tier.name, detail: 'Quoted on your brief', amount: null });
    }

    // Extra edited images, on top of what the package already includes.
    const extraEdits = Math.min(
        Math.max(0, Number(selection.extraEdits) || 0),
        PRICING_CONFIG.maxExtraEdits
    );

    if (extraEdits > 0 && service.extraEditPrice > 0 && !tier.enquireOnly) {
        const amount = extraEdits * service.extraEditPrice;
        const included = tier.includedEdits || 0;
        lines.push({
            label: `${extraEdits} extra edited image${extraEdits === 1 ? '' : 's'}`,
            detail: `${included} included + ${extraEdits} = ${included + extraEdits} total`,
            amount: amount
        });
        subtotal += amount;
    }

    // Team headcount beyond what the package covers.
    if (tier.perPerson) {
        const people = Math.max(tier.minPeople || 0, Number(selection.people) || tier.includedPeople);
        const extraPeople = Math.max(0, people - tier.includedPeople);

        if (extraPeople > 0) {
            const amount = extraPeople * tier.perPerson;
            lines.push({
                label: `${extraPeople} additional ${extraPeople === 1 ? 'person' : 'people'}`,
                detail: `${people} people total, ${tier.includedPeople} included`,
                amount: amount
            });
            subtotal += amount;
        }
    }

    // Video deliverables are netted against the tier so nothing already
    // bundled is charged for a second time.
    if (service.videoOptions && !tier.enquireOnly) {
        const video = selection.video || {};
        const reelQty = Math.max(0, Number(video.reelQty) || 0);
        const chargeableReels = Math.max(0, reelQty - (tier.includedReels || 0));
        const format = service.videoOptions.reelFormats.find((item) => item.id === video.reelFormat)
            || service.videoOptions.reelFormats[0];

        if (chargeableReels > 0) {
            const amount = chargeableReels * format.price;
            lines.push({
                label: `${chargeableReels} × ${format.label}`,
                detail: (tier.includedReels ? `${tier.includedReels} already included` : 'Added to your package'),
                amount: amount
            });
            subtotal += amount;
        } else if (reelQty > 0) {
            lines.push({ label: `${reelQty} × ${format.label}`, detail: 'Included in this package', amount: 0 });
        }

        const film = service.videoOptions.films.find((item) => item.id === video.filmLength);

        if (film && film.id !== 'none') {
            if (tier.includedFilm === film.id) {
                lines.push({ label: film.label, detail: 'Included in this package', amount: 0 });
            } else {
                lines.push({ label: film.label, detail: 'Upgrade on this package', amount: film.price });
                subtotal += film.price;
            }
        }
    }

    // Add-ons.
    const available = getAddOnList(service, selection.groupId);

    available.forEach((addOn) => {
        const qty = Number((selection.addOns || {})[addOn.id]) || 0;

        if (qty <= 0) {
            return;
        }

        if (addOn.note) {
            notes.push(addOn.note);
        }

        if (addOn.fromPrice) {
            // Real figure depends on approval or scope, so it cannot sit in a total.
            lines.push({
                label: addOn.label,
                detail: `from ${PRICING_CONFIG.currency} ${formatAed(addOn.price)} — quoted separately`,
                amount: null
            });
            mode = mode === 'enquire' ? 'enquire' : 'from';
            return;
        }

        const amount = qty * addOn.price;
        const unit = addOn.unit && qty > 1 ? ` (${qty} ${addOn.unit}s)` : (qty > 1 ? ` × ${qty}` : '');
        lines.push({ label: addOn.label + unit, detail: addOn.atCost ? 'Third-party fees extra' : '', amount: amount });
        subtotal += amount;
    });

    if (service.rawFilesIncluded && tier.rawValue) {
        lines.push({
            label: 'Raw files',
            detail: `Included — a ${PRICING_CONFIG.currency} ${formatAed(tier.rawValue)} add-on elsewhere`,
            amount: 0
        });
    }

    let vatAmount = 0;

    if (PRICING_CONFIG.vatRegistered === true) {
        if (service.vatMode === 'exclusive') {
            vatAmount = Math.round(subtotal * PRICING_CONFIG.vatRate);
            lines.push({ label: 'VAT (5%)', detail: '', amount: vatAmount });
        } else {
            notes.push('Prices include VAT.');
        }
    }

    const total = subtotal + vatAmount;
    let headline;

    if (mode === 'enquire') {
        headline = 'Custom quote';
    } else if (mode === 'from') {
        headline = `From ${PRICING_CONFIG.currency} ${formatAed(total)}`;
    } else {
        headline = `${PRICING_CONFIG.currency} ${formatAed(total)}`;
    }

    return { mode: mode, tier: tier, lines: lines, subtotal: subtotal, total: total, notes: notes, headline: headline };
}

function initServiceConfigurator() {
    const container = document.querySelector('.services-container');
    const panel = document.getElementById('serviceConfigurator');

    if (!container || !panel || typeof SERVICE_PRICING === 'undefined') {
        return;
    }

    const cards = Array.from(container.querySelectorAll('.service[data-service]'));

    if (!cards.length) {
        return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeKey = null;
    let activeCard = null;
    let selection = null;
    let liveTimer = null;

    cards.forEach((card) => {
        const toggle = card.querySelector('.service-toggle');
        const key = card.dataset.service;
        const service = SERVICE_PRICING[key];

        if (!toggle || !service) {
            return;
        }

        toggle.hidden = false;

        // Advertise the real floor instead of the old wide range.
        const priceEl = card.querySelector('[data-price-range]');
        const tiers = service.groups ? service.groups[0].tiers : service.tiers;
        // A per-image rate is not comparable with a package price: without this,
        // product's "from 65 per image" would beat its 1,450 Starter Pack and
        // advertise a floor no package actually costs.
        const comparable = tiers.filter((tier) => !tier.perImage);
        const pool = comparable.length ? comparable : tiers;
        const cheapest = pool.reduce((low, tier) => (tier.price < low.price ? tier : low), pool[0]);

        if (priceEl) {
            priceEl.textContent = `From ${PRICING_CONFIG.currency} ${formatAed(cheapest.price)}`
                + (cheapest.perImage ? ' per image' : '');
        }
    });

    function defaultSelection(key) {
        const service = SERVICE_PRICING[key];
        const groupId = service.groups ? service.groups[0].id : null;
        const tiers = getTierList(service, groupId);
        const preferred = tiers.find((tier) => tier.popular) || tiers[0];
        const state = { groupId: groupId, tierId: preferred.id, extraEdits: 0, addOns: {} };

        if (preferred.perPerson) {
            state.people = preferred.includedPeople;
        }

        if (service.videoOptions) {
            const reel = service.videoOptions.reelFormats.find((item) => item.recommended);
            const film = service.videoOptions.films.find((item) => item.recommended);
            state.video = {
                reelFormat: reel ? reel.id : service.videoOptions.reelFormats[0].id,
                reelQty: preferred.includedReels || 0,
                filmLength: preferred.includedFilm || (film ? film.id : 'none')
            };
        }

        return state;
    }

    function positionPanelForCard(card) {
        const wasHidden = panel.hidden;

        // Measure with the panel out of flow, or its own height skews the row test.
        panel.hidden = true;
        void container.offsetHeight;

        const rowTop = card.offsetTop;
        let last = cards.indexOf(card);

        while (last + 1 < cards.length && cards[last + 1].offsetTop === rowTop) {
            last += 1;
        }

        const anchor = cards[last + 1] || null;

        // Moving the node re-parents it and drops focus, so only move it if the
        // slot actually changed.
        if (panel.nextElementSibling !== anchor || panel.parentElement !== container) {
            container.insertBefore(panel, anchor);
        }

        panel.hidden = wasHidden ? true : false;
    }

    function renderList(items, className) {
        return items.map((item) => `<li class="${className}">${escapeConfigHtml(item)}</li>`).join('');
    }

    function breakdownHtml(quote) {
        return quote.lines.map((line) => `
            <div class="config-line">
                <span class="config-line-label">${escapeConfigHtml(line.label)}
                    ${line.detail ? `<small>${escapeConfigHtml(line.detail)}</small>` : ''}</span>
                <span class="config-line-amount">${line.amount === null
                    ? 'quoted separately'
                    : (line.amount === 0 ? 'included' : PRICING_CONFIG.currency + ' ' + formatAed(line.amount))}</span>
            </div>`).join('');
    }

    function render() {
        const service = SERVICE_PRICING[activeKey];
        const quote = computeQuote(activeKey, selection);
        const tiers = getTierList(service, selection.groupId);
        const tier = quote.tier;
        const addOns = getAddOnList(service, selection.groupId);

        const groupHtml = service.groups ? `
            <div class="config-groups" role="group" aria-label="Type of coverage">
                ${service.groups.map((group) => `
                    <button type="button" class="config-group${group.id === selection.groupId ? ' is-active' : ''}"
                            data-group="${group.id}" aria-pressed="${group.id === selection.groupId}">
                        ${escapeConfigHtml(group.label)}
                    </button>`).join('')}
            </div>` : '';

        const tiersHtml = `
            <div class="config-tiers" role="radiogroup" aria-label="Choose a package">
                ${tiers.map((item) => `
                    <label class="config-choice">
                        <input type="radio" name="configTier" value="${item.id}"${item.id === tier.id ? ' checked' : ''}>
                        <span class="config-choice-body">
                            ${item.popular ? '<span class="config-badge">Most booked</span>' : ''}
                            <strong>${escapeConfigHtml(item.name)}</strong>
                            <span class="config-choice-price">${item.enquireOnly || item.fromPrice
                                ? 'from ' + PRICING_CONFIG.currency + ' ' + formatAed(item.price) + (item.perImage ? ' / image' : '')
                                : PRICING_CONFIG.currency + ' ' + formatAed(item.price)}</span>
                            <small>${escapeConfigHtml(item.includes.slice(0, 2).join(' · '))}</small>
                        </span>
                    </label>`).join('')}
            </div>`;

        const canSlide = service.extraEditPrice > 0 && !tier.enquireOnly;
        const sliderHtml = canSlide ? `
            <div class="config-slider">
                <label class="config-slider-label" id="extraEditsLabel" for="extraEdits">
                    Extra edited images
                    <span class="config-slider-rate">${PRICING_CONFIG.currency} ${formatAed(service.extraEditPrice)} each</span>
                </label>
                <div class="config-slider-row">
                    <button type="button" class="config-step" data-step="-1" aria-label="One fewer extra image">&minus;</button>
                    <input type="range" id="extraEdits" min="0" max="${PRICING_CONFIG.maxExtraEdits}" step="1"
                           value="${selection.extraEdits}" aria-labelledby="extraEditsLabel"
                           aria-valuetext="${selection.extraEdits} extra images">
                    <button type="button" class="config-step" data-step="1" aria-label="One more extra image">+</button>
                    <output class="config-slider-readout" aria-hidden="true">${selection.extraEdits}</output>
                </div>
                <p class="config-slider-total">
                    ${tier.includedEdits || 0} included + ${selection.extraEdits} extra =
                    <strong>${(tier.includedEdits || 0) + selection.extraEdits} edited images</strong>
                </p>
            </div>` : '';

        const peopleHtml = tier.perPerson ? `
            <div class="config-slider">
                <label class="config-slider-label" for="teamPeople">
                    Team size
                    <span class="config-slider-rate">${PRICING_CONFIG.currency} ${formatAed(tier.perPerson)} per person past ${tier.includedPeople}</span>
                </label>
                <div class="config-slider-row">
                    <button type="button" class="config-step" data-people="-1" aria-label="One fewer person">&minus;</button>
                    <input type="number" id="teamPeople" min="${tier.minPeople}" max="60" step="1"
                           value="${selection.people || tier.includedPeople}" inputmode="numeric">
                    <button type="button" class="config-step" data-people="1" aria-label="One more person">+</button>
                </div>
                <p class="config-slider-total">Minimum ${tier.minPeople} people</p>
            </div>` : '';

        const videoHtml = service.videoOptions && !tier.enquireOnly ? `
            <div class="config-block">
                <h5>Reel format</h5>
                <div class="config-pills" role="radiogroup" aria-label="Reel format">
                    ${service.videoOptions.reelFormats.map((item) => `
                        <label class="config-pill">
                            <input type="radio" name="reelFormat" value="${item.id}"${selection.video.reelFormat === item.id ? ' checked' : ''}>
                            <span>${escapeConfigHtml(item.label)}</span>
                        </label>`).join('')}
                </div>
                <div class="config-slider-row config-inline">
                    <span>How many reels?</span>
                    <button type="button" class="config-step" data-reel="-1" aria-label="One fewer reel">&minus;</button>
                    <output class="config-slider-readout">${selection.video.reelQty}</output>
                    <button type="button" class="config-step" data-reel="1" aria-label="One more reel">+</button>
                </div>
                <h5>Candid film</h5>
                <div class="config-pills" role="radiogroup" aria-label="Candid film length">
                    ${service.videoOptions.films.map((item) => `
                        <label class="config-pill">
                            <input type="radio" name="filmLength" value="${item.id}"${selection.video.filmLength === item.id ? ' checked' : ''}>
                            <span>${escapeConfigHtml(item.label)}</span>
                        </label>`).join('')}
                </div>
            </div>` : '';

        const addOnsHtml = addOns.length && !tier.enquireOnly ? `
            <div class="config-block">
                <h5>Add-ons</h5>
                <div class="config-addons">
                    ${addOns.map((addOn) => {
                        const qty = Number((selection.addOns || {})[addOn.id]) || 0;
                        const priceLabel = (addOn.fromPrice ? 'from ' : '') + PRICING_CONFIG.currency + ' ' + formatAed(addOn.price);

                        if (addOn.type === 'stepper') {
                            return `
                                <div class="config-addon config-addon-stepper">
                                    <span class="config-addon-name">${escapeConfigHtml(addOn.label)}
                                        <small>${priceLabel}${addOn.unit ? ' per ' + addOn.unit : ''}</small></span>
                                    <span class="config-slider-row">
                                        <button type="button" class="config-step" data-addon-step="${addOn.id}" data-delta="-1"
                                                aria-label="Fewer: ${escapeConfigHtml(addOn.label)}">&minus;</button>
                                        <output class="config-slider-readout">${qty}</output>
                                        <button type="button" class="config-step" data-addon-step="${addOn.id}" data-delta="1"
                                                aria-label="More: ${escapeConfigHtml(addOn.label)}">+</button>
                                    </span>
                                </div>`;
                        }

                        return `
                            <label class="config-addon">
                                <input type="checkbox" data-addon="${addOn.id}"${qty ? ' checked' : ''}>
                                <span class="config-addon-name">${escapeConfigHtml(addOn.label)}
                                    <small>${priceLabel}${addOn.atCost ? ' + fees at cost' : ''}</small></span>
                            </label>`;
                    }).join('')}
                </div>
            </div>` : '';

        const breakdown = breakdownHtml(quote);

        panel.innerHTML = `
            <div class="config-head">
                <div>
                    <p class="config-kicker">Build your package</p>
                    <h4>${escapeConfigHtml(service.cardTitle)}</h4>
                </div>
                <button type="button" class="config-close" aria-label="Close package builder">Close</button>
            </div>
            ${groupHtml}
            ${tiersHtml}
            <div class="config-body">
                <div class="config-controls">
                    ${sliderHtml}
                    ${peopleHtml}
                    ${videoHtml}
                    ${addOnsHtml}
                </div>
                <aside class="config-summary">
                    <p class="config-total-label">Your estimate</p>
                    <p class="config-total" data-config-total>${quote.headline}</p>
                    <div class="config-breakdown">${breakdown}</div>
                    ${quote.notes.length ? `<ul class="config-notes">${renderList(quote.notes, 'config-note')}</ul>` : ''}
                    <div class="config-includes">
                        <strong>Included</strong>
                        <ul>${renderList(tier.includes, 'config-inc')}</ul>
                        ${tier.excludes && tier.excludes.length
                            ? `<strong>Not included</strong><ul>${renderList(tier.excludes, 'config-exc')}</ul>` : ''}
                    </div>
                    <div class="config-actions">
                        <a class="btn btn-whatsapp" data-config-whatsapp href="#" target="_blank" rel="noopener noreferrer">
                            ${quote.mode === 'enquire' ? 'Ask Kamzy for a quote' : 'Send this on WhatsApp'}
                        </a>
                        <button type="button" class="btn btn-secondary" data-config-enquiry>Add to my enquiry</button>
                    </div>
                    <p class="config-disclaimer">${escapeConfigHtml(PRICING_CONFIG.estimateDisclaimer)}
                        Prices updated ${escapeConfigHtml(PRICING_CONFIG.pricesUpdated)}.
                        Not VAT-registered — the price you see is the price you pay.</p>
                </aside>
            </div>
            <p class="config-live sr-only" role="status" aria-live="polite"></p>`;

        const link = panel.querySelector('[data-config-whatsapp]');
        link.href = buildWhatsAppUrl(buildConfigMessage(service, quote));

        announceTotal(quote.headline);
    }

    function announceTotal(text) {
        const live = panel.querySelector('.config-live');

        if (!live) {
            return;
        }

        window.clearTimeout(liveTimer);
        liveTimer = window.setTimeout(() => {
            live.textContent = `Estimate ${text}`;
        }, 500);
    }

    function buildConfigMessage(service, quote) {
        const lines = ['Hi Kamzy - I built this package on your site as per my requirement:', '', `Service: ${service.cardTitle}`];

        quote.lines.forEach((line) => {
            const amount = line.amount === null
                ? 'quoted separately'
                : (line.amount === 0 ? 'included' : `${PRICING_CONFIG.currency} ${formatAed(line.amount)}`);
            lines.push(`- ${line.label}: ${amount}`);
        });

        lines.push('', `Estimated total: ${quote.headline}`, PRICING_CONFIG.estimateDisclaimer);

        return lines.join('\n');
    }

    function openCard(card) {
        const key = card.dataset.service;

        if (!SERVICE_PRICING[key]) {
            return;
        }

        cards.forEach((item) => {
            const toggle = item.querySelector('.service-toggle');
            const isTarget = item === card;
            item.classList.toggle('is-open', isTarget);

            if (toggle) {
                toggle.setAttribute('aria-expanded', String(isTarget));
            }
        });

        activeKey = key;
        activeCard = card;
        selection = defaultSelection(key);

        const heading = card.querySelector('h3');

        if (heading && heading.id) {
            panel.setAttribute('aria-labelledby', heading.id);
        }

        render();
        panel.hidden = false;
        positionPanelForCard(card);
        panel.focus({ preventScroll: true });
        // Put the opened card just below the fixed header so the card and the top
        // of its panel are both in view. Computed after a frame so the freshly
        // inserted panel has been laid out, and scrolled instantly: a smooth
        // scroll races the surrounding content still settling and overshoots.
        // scroll-margin-top on .service keeps the card clear of the fixed header.
        // A second pass covers lazy images above settling and shifting the page.
        const settle = () => card.scrollIntoView({ block: 'start', behavior: 'auto' });

        window.requestAnimationFrame(settle);
        window.setTimeout(settle, 200);
        window.setTimeout(settle, 500);
    }

    function closePanel(returnFocus) {
        if (!activeCard) {
            return;
        }

        const toggle = activeCard.querySelector('.service-toggle');

        activeCard.classList.remove('is-open');

        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');

            if (returnFocus) {
                toggle.focus({ preventScroll: true });
            }
        }

        panel.hidden = true;
        panel.innerHTML = '';
        activeKey = null;
        activeCard = null;
        selection = null;
    }

    container.addEventListener('click', (event) => {
        if (event.target.closest('.service-config')) {
            return;
        }

        const card = event.target.closest('.service[data-service]');

        if (!card) {
            return;
        }

        if (card === activeCard) {
            closePanel(true);
            return;
        }

        openCard(card);
    });

    panel.addEventListener('click', (event) => {
        const target = event.target;

        if (target.closest('.config-close')) {
            closePanel(true);
            return;
        }

        const group = target.closest('[data-group]');

        if (group) {
            selection = defaultSelection(activeKey);
            selection.groupId = group.dataset.group;
            const tiers = getTierList(SERVICE_PRICING[activeKey], selection.groupId);
            selection.tierId = (tiers.find((tier) => tier.popular) || tiers[0]).id;
            render();
            return;
        }

        const step = target.closest('[data-step]');

        if (step) {
            const max = PRICING_CONFIG.maxExtraEdits;
            selection.extraEdits = Math.min(max, Math.max(0, selection.extraEdits + Number(step.dataset.step)));
            render();
            return;
        }

        const people = target.closest('[data-people]');

        if (people) {
            const tier = computeQuote(activeKey, selection).tier;
            const next = (selection.people || tier.includedPeople) + Number(people.dataset.people);
            selection.people = Math.min(60, Math.max(tier.minPeople, next));
            render();
            return;
        }

        const reel = target.closest('[data-reel]');

        if (reel) {
            selection.video.reelQty = Math.min(6, Math.max(0, selection.video.reelQty + Number(reel.dataset.reel)));
            render();
            return;
        }

        const addonStep = target.closest('[data-addon-step]');

        if (addonStep) {
            const id = addonStep.dataset.addonStep;
            const current = Number(selection.addOns[id]) || 0;
            selection.addOns[id] = Math.min(10, Math.max(0, current + Number(addonStep.dataset.delta)));
            render();
            return;
        }

        if (target.closest('[data-config-enquiry]')) {
            sendToBookingForm();
        }
    });

    panel.addEventListener('change', (event) => {
        const target = event.target;

        if (target.name === 'configTier') {
            const keep = selection.extraEdits;
            selection = Object.assign(defaultSelection(activeKey), { groupId: selection.groupId });
            selection.tierId = target.value;
            selection.extraEdits = keep;
            render();
            return;
        }

        if (target.name === 'reelFormat') {
            selection.video.reelFormat = target.value;
            render();
            return;
        }

        if (target.name === 'filmLength') {
            selection.video.filmLength = target.value;
            render();
            return;
        }

        if (target.id === 'teamPeople') {
            selection.people = Number(target.value) || 0;
            render();
            return;
        }

        if (target.dataset.addon) {
            selection.addOns[target.dataset.addon] = target.checked ? 1 : 0;
            render();
        }
    });

    // Live drag: update the visible number without re-rendering the whole panel.
    panel.addEventListener('input', (event) => {
        if (event.target.id !== 'extraEdits') {
            return;
        }

        const value = Number(event.target.value);
        selection.extraEdits = value;
        event.target.setAttribute('aria-valuetext', `${value} extra images`);
        event.target.style.setProperty('--range-fill', `${(value / PRICING_CONFIG.maxExtraEdits) * 100}%`);

        const quote = computeQuote(activeKey, selection);
        const totalEl = panel.querySelector('[data-config-total]');
        const readout = panel.querySelector('.config-slider-readout');
        const running = panel.querySelector('.config-slider-total');

        if (totalEl) {
            totalEl.textContent = quote.headline;
        }

        if (readout) {
            readout.textContent = value;
        }

        if (running) {
            const included = quote.tier.includedEdits || 0;
            running.innerHTML = `${included} included + ${value} extra = <strong>${included + value} edited images</strong>`;
        }

        const link = panel.querySelector('[data-config-whatsapp]');

        if (link) {
            link.href = buildWhatsAppUrl(buildConfigMessage(SERVICE_PRICING[activeKey], quote));
        }

        // Refresh the itemised lines in place. A full re-render here would
        // replace the range input mid-interaction and drop keyboard focus,
        // so arrow keys would only ever register one step.
        const breakdown = panel.querySelector('.config-breakdown');

        if (breakdown) {
            breakdown.innerHTML = breakdownHtml(quote);
        }

        announceTotal(quote.headline);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && activeCard) {
            closePanel(true);
        }
    });

    if ('ResizeObserver' in window) {
        let frame = null;
        let lastWidth = 0;
        const observer = new ResizeObserver((entries) => {
            const width = Math.round(entries[0].contentRect.width);

            // Height changes come from the panel's own content and must not
            // trigger a reposition; only a width change can alter the columns.
            if (width === lastWidth) {
                return;
            }

            lastWidth = width;

            if (!activeCard) {
                return;
            }

            window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => positionPanelForCard(activeCard));
        });

        observer.observe(container);
    }

    function sendToBookingForm() {
        const service = SERVICE_PRICING[activeKey];
        const quote = computeQuote(activeKey, selection);
        const form = document.getElementById('contactForm');

        if (!form) {
            return;
        }

        const setRadio = (name, value) => {
            const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);

            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        };

        setRadio('serviceType', service.formBucket);

        const wantsVideo = Boolean(service.videoOptions)
            || (selection.video && selection.video.filmLength && selection.video.filmLength !== 'none');
        setRadio('coverageType', service.coverage === 'Video' ? 'Video' : (wantsVideo ? 'Photo + Video' : service.coverage));

        const budget = quote.total >= 10000 ? 'AED 10,000+'
            : quote.total >= 5000 ? 'AED 5,000-10,000'
            : quote.total >= 3000 ? 'AED 3,000-5,000'
            : quote.total >= 1000 ? 'AED 1,000-3,000' : 'AED 300-1,000';
        setRadio('budgetRange', budget);

        const configured = document.getElementById('configuredPackage');
        const text = `${service.cardTitle} — ${quote.tier.name}`
            + (selection.extraEdits ? `, +${selection.extraEdits} edited images` : '')
            + ` — ${quote.headline}`;

        if (configured) {
            configured.value = text;
            configured.defaultValue = text;
            configured.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const source = form.querySelector('input[name="inquirySource"]');

        if (source) {
            source.value = 'Service configurator';
        }

        const contact = document.getElementById('contact');

        if (contact) {
            contact.classList.add('visible');
            window.requestAnimationFrame(() => {
                contact.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
            });
        }
    }
}

function escapeConfigHtml(value) {
    return String(value === undefined || value === null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initHeroVideo();
    initCameraCursor();
    initPortfolioGallery();
    initContactForm();
    initServiceConfigurator();
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
