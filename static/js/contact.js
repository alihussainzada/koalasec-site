// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
    
    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', toggleFAQ);
    });
});

async function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(form);
        const response = await fetch('/contact', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Success
            showToast(result.message, 'success');
            form.reset();
            
            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Show validation errors
            showFormErrors(form, result.errors);
            showToast('Please fix the errors below.', 'error');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showToast('An error occurred. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        if (!isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: var(--danger); font-size: 0.875rem; margin-top: 0.25rem;';
    
    // Insert error message after field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    // Remove error message
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showFormErrors(form, errors) {
    // Clear all previous errors
    form.querySelectorAll('.field-error').forEach(error => error.remove());
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    // Show new errors
    errors.forEach(error => {
        // Try to find the field by error message content
        const field = findFieldByError(form, error);
        if (field) {
            showFieldError(field, error);
        }
    });
}

function findFieldByError(form, errorMessage) {
    // Map common error messages to field names
    const errorMap = {
        'Name is required': 'name',
        'Valid email is required': 'email',
        'Message is required': 'message'
    };
    
    for (const [error, fieldName] of Object.entries(errorMap)) {
        if (errorMessage.includes(error)) {
            return form.querySelector(`[name="${fieldName}"]`);
        }
    }
    
    return null;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function toggleFAQ(event) {
    const question = event.currentTarget;
    const answer = question.nextElementSibling;
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Toggle aria-expanded
    question.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle answer visibility
    if (isExpanded) {
        answer.style.maxHeight = '0';
    } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}

// Auto-resize textarea
document.addEventListener('input', function(event) {
    if (event.target.tagName === 'TEXTAREA') {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    }
});

// Phone number formatting
document.addEventListener('input', function(event) {
    if (event.target.type === 'tel') {
        let value = event.target.value.replace(/\D/g, ''); // keep only numbers
        let formatted = '';

        // always start with country code if typed
        if (value.startsWith('93')) {
            formatted = '+93 ';
            value = value.substring(2);
        } else if (value.startsWith('0')) {
            // if user starts with 0, treat as local and add +93 automatically
            formatted = '+93 ';
            value = value.substring(1);
        }

        if (value.length > 0) {
            formatted += value.substring(0, 2); // operator code
        }
        if (value.length > 2) {
            formatted += ' ' + value.substring(2, 5);
        }
        if (value.length > 5) {
            formatted += ' ' + value.substring(5, 9);
        }

        event.target.value = formatted.trim();
    }
});

// Service selection enhancement
document.addEventListener('change', function(event) {
    if (event.target.name === 'service') {
        const messageField = document.querySelector('textarea[name="message"]');
        if (messageField && event.target.value) {
            const serviceTemplates = {
                'penetration-testing': 'I\'m interested in penetration testing services for my organization. Please provide more information about your approach, timeline, and pricing.',
                'application-security': 'I\'d like to discuss application security review services. We have web/mobile applications that need security assessment.',
                'security-training': 'I\'m looking for security training programs for our team. Please share details about your training offerings.'
            };
            
            const template = serviceTemplates[event.target.value];
            if (template && !messageField.value) {
                messageField.value = template;
                messageField.style.height = 'auto';
                messageField.style.height = messageField.scrollHeight + 'px';
            }
        }
    }
});
