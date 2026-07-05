/**
 * About page interactions.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Skills Filtering Logic
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    if (filterBtns.length > 0 && skillCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => {
                    b.classList.remove('is-active');
                    b.setAttribute('aria-selected', 'false');
                });
                
                // Add active class to clicked button
                btn.classList.add('is-active');
                btn.setAttribute('aria-selected', 'true');

                const filterValue = btn.getAttribute('data-filter');

                let visibleIndex = 0;

                // Apply filtering
                skillCards.forEach((card) => {
                    const match = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
                    
                    if (match) {
                        card.classList.remove('is-hidden');
                        card.classList.remove('animate-in');
                        
                        // Trigger reflow to restart animation
                        void card.offsetWidth;
                        
                        card.classList.add('animate-in');
                        // Stagger animation based on visual order
                        card.style.animationDelay = `${visibleIndex * 0.03}s`;
                        visibleIndex++;
                    } else {
                        card.classList.add('is-hidden');
                        card.classList.remove('animate-in');
                        card.style.animationDelay = '0s';
                    }
                });
            });
        });
    }
});
