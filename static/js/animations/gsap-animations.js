/**
 * GSAP Animations — ScrollTrigger powered reveals
 */
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal elements on scroll
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, i) => {
        gsap.fromTo(el, 
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    end: 'top 20%',
                    toggleActions: 'play none none none',
                },
                delay: (i % 3) * 0.1, // Stagger within visible groups
            }
        );
    });

    // Dimensional reveal for premium surfaces.
    const premiumSurfaces = document.querySelectorAll('.project-card, .blog-card, .contact-panel, .contact-form-card, .skill-cluster, .cert-card');
    premiumSurfaces.forEach((surface, i) => {
        gsap.fromTo(surface,
            { y: 36, opacity: 0, rotationX: 4, transformPerspective: 900 },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: surface,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
                delay: (i % 4) * 0.045,
            }
        );
    });

    // Counter animations
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        gsap.fromTo(counter,
            { innerText: 0 },
            {
                innerText: target,
                duration: 2,
                ease: 'power2.out',
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                onUpdate: function() {
                    counter.textContent = Math.round(counter.innerText) + (target > 10 ? '+' : '');
                }
            }
        );
    });

    // Skill bar animations
    const skillBars = document.querySelectorAll('.skill-item__bar-fill, .skill-chip__bar-fill, .skill-cluster__meter-fill');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || 80;
        gsap.to(bar, {
            width: width + '%',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bar.closest('.skill-chip, .skill-cluster, .skill-item') || bar,
                start: 'top 90%',
                toggleActions: 'play none none none',
            }
        });
    });

    // Premium stagger for dense skill chips
    document.querySelectorAll('.skill-cluster').forEach(cluster => {
        const chips = cluster.querySelectorAll('.skill-chip');
        if (!chips.length) return;

        gsap.from(chips, {
            y: 22,
            opacity: 0,
            duration: 0.65,
            ease: 'power3.out',
            stagger: 0.045,
            scrollTrigger: {
                trigger: cluster,
                start: 'top 78%',
                toggleActions: 'play none none none',
            }
        });
    });

    // Parallax for orbs
    const orbs = document.querySelectorAll('.hero__orb');
    orbs.forEach(orb => {
        gsap.to(orb, {
            y: -100,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initGSAPAnimations);
