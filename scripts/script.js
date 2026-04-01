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
    const gallery = document.querySelector('.portfolio-gallery');
    const track = document.getElementById('portfolioTrack');
    const cards = Array.from(document.querySelectorAll('.portfolio-card'));
    const currentLabel = document.getElementById('portfolioCurrentLabel');
    const progressBar = document.getElementById('portfolioProgressBar');

    if (!gallery || !track || !cards.length || !currentLabel || !progressBar) {
        return;
    }

    let isPointerDown = false;
    let dragStartX = 0;
    let startScrollLeft = 0;
    let activeIndex = 0;
    let activeSyncTimer = 0;
    let activeSyncFrame = 0;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    function updateGalleryProgress() {
        const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 1);
        const progress = clamp(track.scrollLeft / maxScroll, 0, 1);
        progressBar.style.width = `${18 + progress * 82}%`;
    }

    function findActiveCardIndex() {
        const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
        const edgeThreshold = 2;

        if (track.scrollLeft <= edgeThreshold) {
            return 0;
        }

        if (track.scrollLeft >= maxScroll - edgeThreshold) {
            return cards.length - 1;
        }

        const trackBox = track.getBoundingClientRect();
        const trackCenter = trackBox.left + (trackBox.width / 2);
        let bestIndex = 0;
        let bestVisibility = -1;
        let bestOverlap = -1;
        let closestDistance = Number.POSITIVE_INFINITY;

        cards.forEach((card, index) => {
            const cardBox = card.getBoundingClientRect();
            const overlap = Math.max(
                0,
                Math.min(cardBox.right, trackBox.right) - Math.max(cardBox.left, trackBox.left)
            );
            const visibility = overlap / Math.max(cardBox.width, 1);
            const cardCenter = cardBox.left + (cardBox.width / 2);
            const distance = Math.abs(trackCenter - cardCenter);

            if (
                visibility > bestVisibility + 0.001 ||
                (
                    Math.abs(visibility - bestVisibility) <= 0.001 &&
                    (
                        overlap > bestOverlap + 1 ||
                        (Math.abs(overlap - bestOverlap) <= 1 && distance < closestDistance)
                    )
                )
            ) {
                bestVisibility = visibility;
                bestOverlap = overlap;
                closestDistance = distance;
                bestIndex = index;
            }
        });

        return bestIndex;
    }

    function setActiveCard(index) {
        activeIndex = index;
        cards.forEach((card, cardIndex) => {
            card.classList.toggle('is-active', cardIndex === index);
        });

        const title = cards[index].dataset.title || `Frame ${index + 1}`;
        currentLabel.textContent = `Now viewing: ${title}`;
        updateGalleryProgress();
    }

    function syncActiveCard() {
        setActiveCard(findActiveCardIndex());
    }

    function queueActiveCardSync(delay = isPointerDown ? 85 : 45) {
        window.clearTimeout(activeSyncTimer);

        if (activeSyncFrame) {
            window.cancelAnimationFrame(activeSyncFrame);
        }

        activeSyncTimer = window.setTimeout(() => {
            activeSyncFrame = window.requestAnimationFrame(() => {
                activeSyncFrame = 0;
                syncActiveCard();
            });
        }, delay);
    }

    function scrollToCard(index) {
        const card = cards[index];
        if (!card) {
            return;
        }

        const targetLeft = card.offsetLeft - ((track.clientWidth - card.offsetWidth) / 2);
        track.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: 'smooth'
        });
    }

    gallery.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        isPointerDown = true;
        dragStartX = event.clientX;
        startScrollLeft = track.scrollLeft;
        gallery.classList.add('is-dragging');
        gallery.setPointerCapture(event.pointerId);
    });

    gallery.addEventListener('pointermove', (event) => {
        if (!isPointerDown) {
            return;
        }

        const delta = event.clientX - dragStartX;
        track.scrollLeft = startScrollLeft - delta;
    });

    function endDrag(event) {
        if (!isPointerDown) {
            return;
        }

        isPointerDown = false;
        gallery.classList.remove('is-dragging');

        if (event && gallery.hasPointerCapture(event.pointerId)) {
            gallery.releasePointerCapture(event.pointerId);
        }

        queueActiveCardSync(30);
    }

    gallery.addEventListener('pointerup', endDrag);
    gallery.addEventListener('pointercancel', endDrag);
    gallery.addEventListener('pointerleave', (event) => {
        if (isPointerDown && event.pointerType === 'mouse') {
            endDrag(event);
        }
    });

    gallery.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
            return;
        }

        event.preventDefault();
        const nextIndex = event.key === 'ArrowRight'
            ? Math.min(activeIndex + 1, cards.length - 1)
            : Math.max(activeIndex - 1, 0);

        activeIndex = nextIndex;
        scrollToCard(nextIndex);
        queueActiveCardSync(120);
    });

    track.addEventListener('scroll', () => {
        updateGalleryProgress();
        queueActiveCardSync();
    }, { passive: true });

    window.addEventListener('resize', syncActiveCard);

    syncActiveCard();
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

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
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
