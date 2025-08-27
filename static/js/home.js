// Home page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Testimonials carousel
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;

    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current testimonial and activate corresponding dot
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }

    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance testimonials every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000);

    // Initialize first slide
    showSlide(0);

    // Client Logos Carousel
    (function() {
        const slides = document.querySelectorAll('.client-logo-slide');
        const dots = document.querySelectorAll('.client-logo-dot');
        const leftArrow = document.querySelector('.client-logo-arrow.left');
        const rightArrow = document.querySelector('.client-logo-arrow.right');
        let current = 0;
        let interval = null;

        function showSlide(idx) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === idx);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === idx);
            });
            current = idx;
        }

        function nextSlide() {
            showSlide((current + 1) % slides.length);
        }
        function prevSlide() {
            showSlide((current - 1 + slides.length) % slides.length);
        }

        if (slides.length) {
            showSlide(0);
            interval = setInterval(nextSlide, 2500);

            rightArrow.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
            leftArrow.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => {
                    showSlide(i);
                    resetInterval();
                });
            });
        }
        function resetInterval() {
            clearInterval(interval);
            interval = setInterval(nextSlide, 2500);
        }
    })();
});
