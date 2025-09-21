document.addEventListener('DOMContentLoaded', () => {
    // Get all elements that can trigger a modal
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const modalId = trigger.getAttribute('data-modal-trigger');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                // Show the modal
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
    });

    // Get all elements that can close a modal
    const modalClosers = document.querySelectorAll('[data-modal-close]');

    modalClosers.forEach(closer => {
        closer.addEventListener('click', () => {
            const modal = closer.closest('.modal-container');
            if (modal) {
                // Hide the modal
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    });

    // Also close modal if clicking on the background overlay
    const modalContainers = document.querySelectorAll('.modal-container');
    modalContainers.forEach(container => {
        container.addEventListener('click', (event) => {
            if (event.target === container) {
                container.classList.add('hidden');
                container.classList.remove('flex');
            }
        });
    });
});