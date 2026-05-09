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
    const skillBars = document.querySelectorAll('.skill-item__bar-fill');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || 80;
        gsap.to(bar, {
            width: width + '%',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
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
