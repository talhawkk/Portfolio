/**
 * Preloader — Counter animation + page reveal
 */
(function() {
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('preloader-counter');
    const progress = document.getElementById('preloader-progress');

    if (!preloader || !counter || !progress) return;

    const hasSeenPreloader = sessionStorage.getItem('preloaderSeen');
    if (hasSeenPreloader) {
        preloader.style.display = 'none';
        
        const dispatchComplete = () => {
            document.dispatchEvent(new CustomEvent('preloaderComplete'));
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', dispatchComplete);
        } else {
            dispatchComplete();
        }
        return;
    }

    let count = 0;
    const duration = 600; 
    const interval = duration / 100;

    const timer = setInterval(() => {
        count++;
        counter.textContent = count;
        progress.style.width = count + '%';

        if (count >= 100) {
            clearInterval(timer);
            sessionStorage.setItem('preloaderSeen', 'true');
            setTimeout(() => {
                preloader.style.opacity = '0';
                document.dispatchEvent(new CustomEvent('preloaderComplete'));
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 400);
            }, 100);
        }
    }, interval);

    // Fallback: force hide after 3 seconds
    setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            document.dispatchEvent(new CustomEvent('preloaderComplete'));
        }
    }, 3000);
})();
