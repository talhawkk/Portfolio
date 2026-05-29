/**
 * Contact Page — AJAX form submission
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get CSRF token
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken,
                },
            });

            const data = await response.json();

            status.style.display = 'block';
            if (data.success) {
                status.textContent = data.message;
                status.style.color = 'var(--success)';
                form.reset();
            } else {
                status.textContent = data.message || 'Something went wrong.';
                status.style.color = 'var(--error)';
            }
        } catch (err) {
            status.style.display = 'block';
            status.textContent = 'Network error. Please try again.';
            status.style.color = 'var(--error)';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';

            // Hide status after 5s
            setTimeout(() => {
                status.style.display = 'none';
            }, 5000);
        }
    });
});
