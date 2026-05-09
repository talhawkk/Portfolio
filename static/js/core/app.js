/**
 * App.js — Main initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c⚡ Portfolio Loaded', 'color: #00d4ff; font-size: 16px; font-weight: bold;');

    // Lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imgObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        lazyImages.forEach(img => imgObserver.observe(img));
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                if (typeof lenis !== 'undefined') {
                    lenis.scrollTo(target, { offset: -80 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
