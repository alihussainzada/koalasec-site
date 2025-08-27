// Blog JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const categoryLinks = document.querySelectorAll('.category-link');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (categoryLinks.length > 0) {
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active category
                categoryLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                filterBlogPosts(category);
            });
        });
    }
    
    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Initialize blog interactions
    initializeBlogInteractions();
});

function filterBlogPosts(category) {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
            card.classList.add('animate-in');
        } else {
            const cardCategories = card.getAttribute('data-categories');
            if (cardCategories && cardCategories.includes(category)) {
                card.style.display = 'block';
                card.classList.add('animate-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('animate-in');
            }
        }
    });
    
    // Update URL hash
    if (category !== 'all') {
        window.location.hash = category;
    } else {
        history.pushState('', document.title, window.location.pathname);
    }
}

async function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (!emailInput.value.trim()) {
        showToast('Please enter your email address.', 'error');
        return;
    }
    
    if (!isValidEmail(emailInput.value)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    try {
        // Simulate newsletter subscription
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showToast('Thank you for subscribing! You\'ll receive our latest security insights.', 'success');
        form.reset();
        
    } catch (error) {
        showToast('An error occurred. Please try again.', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function initializeBlogInteractions() {
    // Add hover effects to blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-card)';
        });
    });
    
    // Add reading time badges
    const readingTimeElements = document.querySelectorAll('.blog-reading-time');
    readingTimeElements.forEach(element => {
        const time = element.textContent;
        if (time.includes('min read')) {
            element.style.background = 'var(--primary)';
            element.style.color = 'white';
            element.style.padding = '0.25rem 0.5rem';
            element.style.borderRadius = 'var(--radius-sm)';
            element.style.fontSize = '0.75rem';
            element.style.fontWeight = '600';
        }
    });
    
    // Add tag styling
    const blogTags = document.querySelectorAll('.blog-tag');
    blogTags.forEach(tag => {
        tag.style.background = 'rgba(168, 85, 247, 0.1)';
        tag.style.color = 'var(--primary)';
        tag.style.padding = '0.25rem 0.5rem';
        tag.style.borderRadius = 'var(--radius-sm)';
        tag.style.fontSize = '0.75rem';
        tag.style.fontWeight = '500';
        tag.style.border = '1px solid rgba(168, 85, 247, 0.2)';
    });
}

// Search functionality (if implemented)
function searchBlogPosts(query) {
    const blogCards = document.querySelectorAll('.blog-card');
    const searchTerm = query.toLowerCase();
    
    blogCards.forEach(card => {
        const title = card.querySelector('.blog-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
        const tags = card.getAttribute('data-categories') || '';
        
        if (title.includes(searchTerm) || 
            excerpt.includes(searchTerm) || 
            tags.toLowerCase().includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('animate-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('animate-in');
        }
    });
}

// Lazy loading for blog images (if implemented)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Share functionality
function sharePost(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy link.', 'error');
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlogInteractions);
} else {
    initializeBlogInteractions();
}
