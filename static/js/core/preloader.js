/**
 * Preloader — Counter animation + page reveal
 */
(function() {
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('preloader-counter');
    const progress = document.getElementById('preloader-progress');

    if (!preloader || !counter || !progress) return;

    let count = 0;
    const duration = 1500; // 1.5 seconds
    const interval = duration / 100;

    const timer = setInterval(() => {
        count++;
        counter.textContent = count;
        progress.style.width = count + '%';

        if (count >= 100) {
            clearInterval(timer);
            setTimeout(() => {
                preloader.style.opacity = '0';
                // Trigger hero animations after preloader
                document.dispatchEvent(new CustomEvent('preloaderComplete'));
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 300);
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
