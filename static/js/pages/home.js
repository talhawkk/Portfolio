/**
 * Home Page — Premium interaction layer
 */
document.addEventListener('DOMContentLoaded', function () {
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Magnetic CTA buttons — subtle, premium pull effect
    if (canHover) {
        var magneticBtns = document.querySelectorAll('.hero__actions .btn');
        magneticBtns.forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.12) + 'px,' + (y * 0.12) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
            });
        });
    }

    // Premium tilt on project cards (desktop only, with damping)
    if (canHover && window.innerWidth > 1024) {
        var cards = document.querySelectorAll('.project-card');
        cards.forEach(function (card) {
            var raf = null;
            var targetX = 0, targetY = 0, currentX = 0, currentY = 0;

            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                targetX = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
                targetY = ((e.clientX - rect.left) / rect.width - 0.5) * 6;

                if (!raf) {
                    raf = requestAnimationFrame(function step() {
                        currentX += (targetX - currentX) * 0.12;
                        currentY += (targetY - currentY) * 0.12;
                        card.style.transform =
                            'perspective(1000px) rotateX(' + currentX + 'deg) rotateY(' + currentY + 'deg) translateY(-6px)';

                        if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
                            raf = requestAnimationFrame(step);
                        } else {
                            raf = null;
                        }
                    });
                }
            });

            card.addEventListener('mouseleave', function () {
                targetX = 0;
                targetY = 0;
                if (raf) { cancelAnimationFrame(raf); raf = null; }

                // Smooth return
                function settle() {
                    currentX += (0 - currentX) * 0.1;
                    currentY += (0 - currentY) * 0.1;
                    card.style.transform =
                        'perspective(1000px) rotateX(' + currentX + 'deg) rotateY(' + currentY + 'deg) translateY(0)';

                    if (Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
                        requestAnimationFrame(settle);
                    } else {
                        card.style.transform = '';
                    }
                }
                requestAnimationFrame(settle);
            });
        });
    }
});
