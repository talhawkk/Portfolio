/**
 * Text Animations — Premium hero reveal sequence with GSAP
 */
function initTextAnimations() {
    document.addEventListener('preloaderComplete', function () {
        var tl = gsap.timeline({
            defaults: { ease: 'power4.out' },
        });

        // Hero title — staggered line reveal
        tl.to('.hero__title .line-inner', {
            y: '0%',
            duration: 1.4,
            stagger: 0.18,
            ease: 'expo.out',
        })

        // Subtitle fades in
        .to('#hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
        }, '-=0.55')

        // CTA buttons
        .to('#hero-actions', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
        }, '-=0.4')

        // Proof tags stagger in
        .to('#hero-proof', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
        }, '-=0.45')

        // Scroll indicator
        .to('#hero-scroll', {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
        }, '-=0.3');
    });
}

document.addEventListener('DOMContentLoaded', initTextAnimations);
