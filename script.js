/* ============================================= */
/* Fitness Sports Center – Main JavaScript       */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // THEME TOGGLE (LIGHT/DARK MODE)
    // =========================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }


    // =========================================
    // NAVBAR – Scroll Effect & Active Links
    // =========================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.navbar__link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavbarScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    }

    function updateActiveLink() {
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveLink();
    });

    // =========================================
    // MOBILE MENU TOGGLE
    // =========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });


    // =========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });


    // =========================================
    // SCROLL REVEAL ANIMATIONS
    // =========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // =========================================
    // COUNTER ANIMATION (Hero Stats)
    // =========================================
    const counters = document.querySelectorAll('.hero__stat-number[data-target]');
    let countersAnimated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3 });

    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }


    // =========================================
    // TRAINERS SEARCH FILTER
    // =========================================
    const searchInput = document.getElementById('trainer-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.trainer-card');
            
            cards.forEach(card => {
                const name = card.querySelector('.trainer-card__name').textContent.toLowerCase();
                const role = card.querySelector('.trainer-card__role').textContent.toLowerCase();
                
                if (name.includes(term) || role.includes(term)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    // =========================================
    // CONTACT FORM HANDLING & API INTEGRATION
    // =========================================
    const contactForm = document.getElementById('contact-form');
    const emailInput = document.getElementById('contact-email');
    const submitBtn = document.getElementById('contact-submit-btn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnArrow = submitBtn ? submitBtn.querySelector('.btn-arrow') : null;
    const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
    const formFeedback = document.getElementById('form-feedback');

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (contactForm) {
        // Real-time email validation
        emailInput.addEventListener('input', () => {
            if (emailInput.value && !isValidEmail(emailInput.value)) {
                emailInput.parentElement.classList.add('error');
            } else {
                emailInput.parentElement.classList.remove('error');
            }
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const email = emailInput.value;
            const message = document.getElementById('contact-message').value;

            // Final Validation
            if (!name.trim() || !email.trim() || !message.trim() || message.length < 10) return;
            if (!isValidEmail(email)) {
                emailInput.parentElement.classList.add('error');
                return;
            }

            // Set Loading State
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = "Sending...";
            if (btnArrow) btnArrow.style.display = 'none';
            if (btnSpinner) btnSpinner.style.display = 'block';
            if (formFeedback) {
                formFeedback.style.display = 'none';
                formFeedback.className = 'form-feedback';
            }

            try {
                // API Integration Mock Request
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json; charset=UTF-8' },
                    body: JSON.stringify({ name, email, message, source: 'gym-website' })
                });

                if (response.ok) {
                    // Success state
                    if (formFeedback) {
                        formFeedback.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <p>Message sent successfully! Thanks for reaching out.</p>`;
                        formFeedback.classList.add('success');
                        formFeedback.style.display = 'flex';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('API Response Error');
                }
            } catch (error) {
                // Error state
                if (formFeedback) {
                    formFeedback.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p>Oops, something went wrong. Please try again later.</p>`;
                    formFeedback.classList.add('error');
                    formFeedback.style.display = 'flex';
                }
            } finally {
                // Reset Button state
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = "Send Inquiry";
                if (btnArrow) btnArrow.style.display = 'block';
                if (btnSpinner) btnSpinner.style.display = 'none';
                
                if (formFeedback) {
                    setTimeout(() => { 
                        formFeedback.style.opacity = '0';
                        setTimeout(() => { formFeedback.style.display = 'none'; formFeedback.style.opacity = '1'; }, 300);
                    }, 6000);
                }
            }
        });
    }


    // =========================================
    // BACK TO TOP BUTTON
    // =========================================
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // =========================================
    // STAGGERED SERVICE CARDS ANIMATION
    // =========================================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const trainerCards = document.querySelectorAll('.trainer-card');
    trainerCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.12}s`;
    });


    // =========================================
    // NAVBAR LINK HOVER RIPPLE EFFECT
    // =========================================
    const ctaButtons = document.querySelectorAll('.btn--primary');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transform: translate(-50%, -50%);
                left: ${x}px;
                top: ${y}px;
                animation: btnRipple 0.6s ease-out forwards;
                pointer-events: none;
            `;
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes btnRipple {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);


    // =========================================
    // PARALLAX SUBTLE EFFECT ON HERO
    // =========================================
    const heroBg = document.querySelector('.hero__bg-img');
    
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768) {
            const scrolled = window.scrollY;
            if (heroBg && scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
            }
        }
    });

    // Set initial scale for parallax
    if (heroBg && window.innerWidth > 768) {
        heroBg.style.transform = 'scale(1.1)';
    }

});
