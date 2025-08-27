// Blog Post JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Table of contents functionality
    initializeTableOfContents();
    
    // Code highlighting
    initializeCodeHighlighting();
    
    // Post interactions
    initializePostInteractions();
    
    // Reading progress
    initializeReadingProgress();
});

function initializeTableOfContents() {
    const tocToggle = document.querySelector('.toc-toggle');
    const tocContent = document.querySelector('.toc-content');
    
    if (tocToggle && tocContent) {
        tocToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                tocContent.style.maxHeight = '0';
            } else {
                tocContent.style.maxHeight = tocContent.scrollHeight + 'px';
            }
        });
    }
    
    // Smooth scrolling for TOC links
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile TOC if open
                if (tocToggle && tocToggle.getAttribute('aria-expanded') === 'true') {
                    tocToggle.click();
                }
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add highlight to target heading
                targetElement.classList.add('toc-highlight');
                setTimeout(() => {
                    targetElement.classList.remove('toc-highlight');
                }, 2000);
            }
        });
    });
    
    // Highlight current section in TOC
    highlightCurrentSection();
}

function highlightCurrentSection() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (headings.length === 0 || tocLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all TOC links
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const currentLink = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
                if (currentLink) {
                    currentLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -70% 0px'
    });
    
    headings.forEach(heading => observer.observe(heading));
}

function initializeCodeHighlighting() {
    // Add copy button to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        
        // Skip if already has copy button
        if (pre.querySelector('.copy-button')) return;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
        `;
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(block.textContent);
                copyButton.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Copied!
                `;
                copyButton.classList.add('copied');
                
                setTimeout(() => {
                    copyButton.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    `;
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
                showToast('Failed to copy code to clipboard.', 'error');
            }
        });
        
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
    });
}

function initializePostInteractions() {
    // Share buttons
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const postTitle = document.querySelector('.post-title').textContent;
            const postUrl = window.location.href;
            
            if (this.classList.contains('share-twitter')) {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`, '_blank');
            } else if (this.classList.contains('share-linkedin')) {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
            }
        });
    });
    
    // Add reading time estimate
    const readingTime = document.querySelector('.post-reading-time');
    if (readingTime) {
        const time = readingTime.textContent;
        readingTime.style.background = 'var(--primary)';
        readingTime.style.color = 'white';
        readingTime.style.padding = '0.5rem 1rem';
        readingTime.style.borderRadius = 'var(--radius)';
        readingTime.style.fontSize = '0.875rem';
        readingTime.style.fontWeight = '600';
        readingTime.style.display = 'inline-block';
    }
    
    // Add tag styling
    const postTags = document.querySelectorAll('.post-tag');
    postTags.forEach(tag => {
        tag.style.background = 'rgba(168, 85, 247, 0.1)';
        tag.style.color = 'var(--primary)';
        tag.style.padding = '0.5rem 1rem';
        tag.style.borderRadius = 'var(--radius-sm)';
        tag.style.fontSize = '0.875rem';
        tag.style.fontWeight = '500';
        tag.style.border = '1px solid rgba(168, 85, 247, 0.2)';
        tag.style.display = 'inline-block';
        tag.style.marginRight = '0.5rem';
        tag.style.marginBottom = '0.5rem';
    });
}

function initializeReadingProgress() {
    // Create reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Newsletter form handling for post pages
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
});

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

// Add CSS for TOC highlight
const style = document.createElement('style');
style.textContent = `
    .toc-highlight {
        background: rgba(168, 85, 247, 0.1) !important;
        border-left: 3px solid var(--primary) !important;
        padding-left: 1rem !important;
    }
    
    .toc-link.active {
        color: var(--primary) !important;
        font-weight: 600 !important;
    }
    
    .copy-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--card);
        border: 1px solid var(--border);
        color: var(--text);
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all var(--transition);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .copy-button:hover {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
    }
    
    .copy-button.copied {
        background: var(--success);
        border-color: var(--success);
        color: white;
    }
    
    .copy-button svg {
        width: 16px;
        height: 16px;
    }
`;
document.head.appendChild(style);
