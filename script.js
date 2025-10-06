// ===== GLOBAL VARIABLES =====
let isMenuOpen = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== MAIN INITIALIZATION =====
function initializeWebsite() {
    initializeEmailJS();
    setupNavigation();
    setupScrollEffects();
    setupFormHandling();
    setupAnimationObserver();
    setupTypingEffect();
}

// ===== NAVIGATION FUNCTIONALITY =====
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            isMenuOpen = !isMenuOpen;
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        });
    }
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            isMenuOpen = false;
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            isMenuOpen = false;
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== SCROLL EFFECTS =====
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active nav link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero buttons smooth scroll
    const contactButtons = document.querySelectorAll('a[href="#contact"]');
    contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FORM HANDLING =====
function setupFormHandling() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Submit form using EmailJS or fallback
                const result = await submitFormWithEmailJS(name, email, message);
                
                if (result.success) {
                    showNotification('Message sent successfully! Main aapko jald reply karunga.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Message send nahi ho saka. Please WhatsApp ya email se directly contact kariye.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// ===== EmailJS Configuration =====
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
    serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
    templateId: 'YOUR_TEMPLATE_ID' // Replace with your EmailJS template ID
};

// Initialize EmailJS
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
}

// ===== FORM SUBMISSION WITH EMAILJS =====
async function submitFormWithEmailJS(name, email, message) {
    // Check if EmailJS is properly configured
    if (typeof emailjs === 'undefined' || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        // Fallback to mailto if EmailJS is not configured
        return fallbackMailto(name, email, message);
    }
    
    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: 'sujantechdev@gmail.com',
        subject: 'Portfolio Contact Form Submission'
    };
    
    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );
        
        if (response.status === 200) {
            return { success: true, message: 'Email sent successfully!' };
        } else {
            throw new Error('EmailJS response not successful');
        }
    } catch (error) {
        console.error('EmailJS Error:', error);
        // Fallback to mailto
        return fallbackMailto(name, email, message);
    }
}

// ===== FALLBACK MAILTO FUNCTION =====
function fallbackMailto(name, email, message) {
    return new Promise((resolve, reject) => {
        try {
            const subject = encodeURIComponent('Portfolio Contact Form Submission');
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:sujantechdev@gmail.com?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            resolve({ success: true, message: 'Opening email client...' });
        } catch (error) {
            reject(error);
        }
    });
}

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    const styles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 1rem;
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .notification-success {
            border-left: 4px solid var(--accent-color);
        }
        
        .notification-error {
            border-left: 4px solid #ff4757;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            color: var(--text-primary);
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-success .notification-content i {
            color: var(--accent-color);
        }
        
        .notification-error .notification-content i {
            color: #ff4757;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 0.9rem;
            margin-left: auto;
            padding: 0;
        }
        
        .notification-close:hover {
            color: var(--text-primary);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function setupAnimationObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .service-card, .skill-item, .about-content, .contact-content');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Add CSS for scroll animations
    const scrollAnimationStyles = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill-item.animate-on-scroll {
            transition-delay: 0.1s;
        }
        
        .skill-item:nth-child(2).animate-on-scroll {
            transition-delay: 0.2s;
        }
        
        .skill-item:nth-child(3).animate-on-scroll {
            transition-delay: 0.3s;
        }
        
        .skill-item:nth-child(4).animate-on-scroll {
            transition-delay: 0.4s;
        }
        
        .project-card:nth-child(2).animate-on-scroll {
            transition-delay: 0.2s;
        }
        
        .project-card:nth-child(3).animate-on-scroll {
            transition-delay: 0.4s;
        }
        
        .service-card:nth-child(2).animate-on-scroll {
            transition-delay: 0.15s;
        }
        
        .service-card:nth-child(3).animate-on-scroll {
            transition-delay: 0.3s;
        }
        
        .service-card:nth-child(4).animate-on-scroll {
            transition-delay: 0.45s;
        }
    `;
    
    if (!document.querySelector('#scroll-animation-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'scroll-animation-styles';
        styleSheet.textContent = scrollAnimationStyles;
        document.head.appendChild(styleSheet);
    }
}

// ===== TYPING EFFECT FOR HERO TAGLINE =====
function setupTypingEffect() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;
    
    const text = tagline.textContent;
    tagline.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            // Add cursor blink effect
            tagline.innerHTML += '<span class="cursor">|</span>';
            
            // Add cursor animation
            const cursorStyles = `
                .cursor {
                    animation: blink 1s infinite;
                    color: var(--accent-color);
                }
                
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            
            if (!document.querySelector('#cursor-styles')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'cursor-styles';
                styleSheet.textContent = cursorStyles;
                document.head.appendChild(styleSheet);
            }
        }
    };
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for resize events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== UTILITY FUNCTIONS =====

// Check if device supports touch
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

// Get viewport dimensions
function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

// ===== EASTER EGG =====
let konamiCode = [];
const correctCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > correctCode.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === correctCode.length) {
        if (konamiCode.every((key, index) => key === correctCode[index])) {
            activateEasterEgg();
        }
    }
});

function activateEasterEgg() {
    // Create special effects
    const body = document.body;
    body.style.animation = 'rainbow 2s infinite';
    
    // Add rainbow animation
    const rainbowStyles = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            25% { filter: hue-rotate(90deg); }
            50% { filter: hue-rotate(180deg); }
            75% { filter: hue-rotate(270deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = rainbowStyles;
    document.head.appendChild(styleSheet);
    
    showNotification('🎉 Easter egg activated! You found the secret code!', 'success');
    
    // Reset after 5 seconds
    setTimeout(() => {
        body.style.animation = '';
        styleSheet.remove();
    }, 5000);
}