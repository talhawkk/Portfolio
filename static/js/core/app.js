/**
 * App.js — Main initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c⚡ Portfolio Loaded', 'color: #2dd4bf; font-size: 16px; font-weight: bold;');

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

    // Dynamic tag coloring from data-color attribute
    const dynamicTags = document.querySelectorAll('.tag[data-color]');
    dynamicTags.forEach(tag => {
        const color = tag.getAttribute('data-color');
        if (color) {
            tag.style.borderColor = color + '40'; // 40 = 25% alpha in hex
            tag.style.color = color;
        }
    });

    // Subtle pointer-following light and depth for premium surfaces.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canHover && !reduceMotion) {
        const depthTargets = document.querySelectorAll(
            '.project-card, .blog-card, .skill-chip, .skill-item, .stat-card, .contact-panel, .contact-form, .cert-card, .project-detail__info-card'
        );

        depthTargets.forEach((target) => {
            target.classList.add('depth-surface');

            target.addEventListener('pointermove', (event) => {
                const rect = target.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const px = x / rect.width;
                const py = y / rect.height;
                const rotateX = (0.5 - py) * 4.5;
                const rotateY = (px - 0.5) * 5.5;

                target.style.setProperty('--pointer-x', `${px * 100}%`);
                target.style.setProperty('--pointer-y', `${py * 100}%`);
                target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            target.addEventListener('pointerleave', () => {
                target.style.removeProperty('--pointer-x');
                target.style.removeProperty('--pointer-y');
                target.style.transform = '';
            });
        });
    }
});
