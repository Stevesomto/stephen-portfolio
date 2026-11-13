const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.nav-menu');
const siteHeader = document.querySelector('.site-header');
const yearEl = document.getElementById('year');
const scrollToTopBtn = document.querySelector('.scroll-to-top');

if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
}

function closeMobileNav() {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove('is-open', 'active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
}

function openMobileNav() {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.add('is-open', 'active');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
}

if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.contains('is-open');
        if (isOpen) closeMobileNav();
        else openMobileNav();
    });

    document.querySelectorAll('.nav-link, .nav-cta-mobile a').forEach((link) => {
        link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMobileNav();
    });
}

function initActiveNav() {
    const sections = document.querySelectorAll('[data-section]');
    const navLinks = document.querySelectorAll('.nav-link[data-nav]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('data-section');
            navLinks.forEach((link) => {
                link.classList.toggle('is-active', link.dataset.nav === id);
            });
        });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
}

window.addEventListener('scroll', () => {
    if (siteHeader) {
        siteHeader.classList.toggle('is-scrolled', window.scrollY > 18);
    }

    if (scrollToTopBtn) {
        scrollToTopBtn.classList.toggle('is-visible', window.scrollY > 420);
    }
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -8% 0px'
});

function initScrollReveal() {
    document.querySelectorAll('.reveal').forEach((el) => {
        const parentGrid = el.closest('.skills-matrix, .projects-grid, .projects-featured, .services-list, .trust-grid');
        if (parentGrid && !el.style.transitionDelay) {
            const siblings = [...parentGrid.querySelectorAll('.reveal')];
            const index = siblings.indexOf(el);
            el.style.transitionDelay = `${Math.min(index * 0.06, 0.4)}s`;
        }
        revealObserver.observe(el);
    });
}

function loadProjectPreview(previewEl) {
    if (previewEl.dataset.loaded === 'true') return;
    previewEl.dataset.loaded = 'true';

    const imageSrc = previewEl.dataset.image;
    if (imageSrc) {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Project preview';
        img.loading = 'lazy';
        img.onload = () => previewEl.classList.add('is-loaded');
        previewEl.appendChild(img);
        return;
    }

    const src = previewEl.dataset.src;
    if (!src) return;

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'Project live preview';
    iframe.loading = 'lazy';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
    iframe.onload = () => previewEl.classList.add('is-loaded');
    setTimeout(() => previewEl.classList.add('is-loaded'), 2500);
    previewEl.appendChild(iframe);
}

const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadProjectPreview(entry.target);
        previewObserver.unobserve(entry.target);
    });
}, { rootMargin: '140px 0px', threshold: 0.01 });

function initLazyPreviews() {
    document.querySelectorAll('.project-preview').forEach((el) => previewObserver.observe(el));
}

function initProjectFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter || 'all';

            buttons.forEach((btn) => {
                const active = btn === button;
                btn.classList.toggle('is-active', active);
                btn.setAttribute('aria-selected', active ? 'true' : 'false');
            });

            cards.forEach((card) => {
                const category = card.dataset.category;
                const show = filter === 'all' || category === filter;
                card.classList.toggle('is-hidden', !show);
            });
        });
    });
}

function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const finish = () => {
        preloader.classList.add('preloader-done');
        document.body.classList.remove('preloader-active');
        setTimeout(() => preloader.remove(), 550);
    };

    const kickoff = () => setTimeout(finish, 420);

    if (document.readyState === 'complete') kickoff();
    else window.addEventListener('load', kickoff, { once: true });
}

const roles = [
    'Full-Stack Web Developer',
    'Python & Django Builder',
    'Web Designer & Freelancer'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRoles() {
    const roleTextElement = document.getElementById('role-text');
    if (!roleTextElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
        roleTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex -= 1;
    } else {
        roleTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex += 1;
    }

    let currentSpeed = isDeleting ? 42 : 88;

    if (!isDeleting && charIndex === currentRole.length) {
        currentSpeed = 1600;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        currentSpeed = 420;
    }

    setTimeout(typeRoles, currentSpeed);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach((counter) => {
        const original = counter.textContent.trim();
        const hasPlus = original.includes('+');
        const target = Number(counter.dataset.count);
        if (!Number.isFinite(target)) return;

        const steps = 48;
        let frame = 0;

        const updateCounter = () => {
            frame += 1;
            const value = Math.round((target * frame) / steps);
            counter.textContent = hasPlus ? `${value}+` : String(value);
            if (frame < steps) requestAnimationFrame(updateCounter);
            else counter.textContent = original;
        };

        requestAnimationFrame(updateCounter);
    });
}

function initTrustCounters() {
    const trustStrip = document.querySelector('.trust-strip');
    if (!trustStrip) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounters();
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    observer.observe(trustStrip);
}

function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button type="button" class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('is-shown'));

    const hide = () => {
        notification.classList.remove('is-shown');
        setTimeout(() => notification.remove(), 280);
    };

    notification.querySelector('.notification-close')?.addEventListener('click', hide);
    setTimeout(hide, 4800);
}

function sendToWhatsApp(event) {
    event.preventDefault();

    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const tel = document.getElementById('phone')?.value.trim();
    const subject = document.getElementById('subject')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !tel || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    const text = `Hello Stephen!\n\nI am ${name}\nEmail: ${email}\nPhone: ${tel}\n*Subject:* ${subject}\n\n*Message:*\n${message}`;
    window.open(`https://wa.me/2348123443047?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    showNotification('Opening WhatsApp…', 'success');
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', sendToWhatsApp);
}

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const meta = document.getElementById('theme-color-meta');
    if (!toggle) return;

    const syncToggle = (theme) => {
        const isDark = theme === 'dark';
        toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        if (meta) meta.setAttribute('content', isDark ? '#101412' : '#eef1ef');
    };

    syncToggle(document.documentElement.getAttribute('data-theme') || 'light');

    toggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try {
            localStorage.setItem('ss-theme', next);
        } catch (error) {
            /* ignore storage errors */
        }
        syncToggle(next);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initPreloader();
    initScrollReveal();
    initLazyPreviews();
    initActiveNav();
    initProjectFilters();
    initTrustCounters();
    initContactForm();
    typeRoles();
});
