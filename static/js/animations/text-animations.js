/**
 * Text Animations — Hero text reveal with GSAP
 */
function initTextAnimations() {
    // Wait for preloader to finish
    document.addEventListener('preloaderComplete', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // Hero title lines
        tl.to('.hero__title .line-inner', {
            y: '0%',
            duration: 1.2,
            stagger: 0.15,
        })
        .to('#hero-label', {
            opacity: 1,
            y: 0,
            duration: 0.6,
        }, '-=0.8')
        .to('#hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.6,
        }, '-=0.5')
        .to('#hero-actions', {
            opacity: 1,
            y: 0,
            duration: 0.6,
        }, '-=0.4')
        .to('#hero-proof', {
            opacity: 1,
            y: 0,
            duration: 0.6,
        }, '-=0.45')
        .to('#hero-showcase', {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
        }, '-=0.65')
        .to('#hero-scroll', {
            opacity: 1,
            duration: 0.6,
        }, '-=0.3');
    });
}

document.addEventListener('DOMContentLoaded', initTextAnimations);
