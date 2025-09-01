// Oracle Counters Animation
document.addEventListener('DOMContentLoaded', function() {
    // Counter animation function
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Intersection Observer for triggering animations
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target.querySelector('.count-text');
                const targetValue = parseInt(counterElement.getAttribute('data-stop'));
                
                if (counterElement && !counterElement.classList.contains('animated')) {
                    counterElement.classList.add('animated');
                    animateCounter(counterElement, targetValue);
                }
            }
        });
    }, observerOptions);

    // Observe all counter items
    const counterItems = document.querySelectorAll('.counter-item');
    counterItems.forEach(item => {
        observer.observe(item);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return; // ignore invalid selectors
            e.preventDefault();
            try {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch (_) {
                // ignore invalid selector errors
            }
        });
    });

    // Add hover effects for Oracle solution cards
    const solutionCards = document.querySelectorAll('.oracle-solutions-area .service-item, .oracle-solutions-area .feature-item');
    solutionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img[src*="data-website"]');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize for responsive design
window.addEventListener('resize', debounce(function() {
    // Recalculate any dynamic layouts if needed
    console.log('Window resized');
}, 250));
