#!/usr/bin/env python3
"""
KoalaSec Website - Flask Application
====================================

A modern, dark + purple cybersecurity company website built with Flask.

Setup:
1. pip install -r requirements.txt
2. python app.py
3. Visit http://127.0.0.1:5000

Adding Blog Posts:
- Create markdown files in /blog folder
- Format: yyyy-mm-dd-title.md
- First H1 becomes the title
- Optional frontmatter for metadata
"""

import os
import json
import re
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, abort, jsonify
import markdown
from slugify import slugify
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
import requests
import ipaddress

app = Flask(__name__)

# Configuration
BLOG_DIR = 'blog'
DATA_DIR = 'data'
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')
BOT_TOKEN = "8241413726:AAG6_K6bph4jqhKKmEA6ztwrH3qSA3G8m14"
CHAT_ID = "-1002349365359"
TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

def save_contact_message(data):
    """Save contact form message to JSON file."""
    try:
        with open(MESSAGES_FILE, 'r') as f:
            messages = json.load(f)
        
        # Add timestamp and IP
        message_data = {
            'timestamp': datetime.now().isoformat(),
            'ip': request.remote_addr,
            'name': data.get('name', ''),
            'email': data.get('email', ''),
            'company': data.get('company', ''),
            'message': data.get('message', '')
        }
        payload = {
                "chat_id": CHAT_ID,
                "parse_mode": "Markdown",
                "text": f"""
            *📩 New Contact Form Submission*

            *🕒 Timestamp:* `{message_data['timestamp']}`
            *🌐 IP:* `{message_data['ip']}`

            *👤 Name:* `{message_data['name']}`
            *📧 Email:* `{message_data['email']}`
            🏢 *Company:* `{message_data['company']}`

            *💬 Message:*  
            _{message_data['message']}_
            """
            }
        response = requests.post(TELEGRAM_API_URL, json=payload)
        messages.append(message_data)
        
        with open(MESSAGES_FILE, 'w') as f:
            json.dump(messages, f, indent=2)
        
        return True
    except Exception as e:
        print(f"Error saving message: {e}")
        return False

# Jinja filters
@app.template_filter('datefmt')
def datefmt(date_str, format='%B %d, %Y'):
    """Format date string."""
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return date_obj.strftime(format)
    except:
        return date_str

@app.template_filter('readingtime')
def readingtime(minutes):
    """Format reading time."""
    if minutes == 1:
        return "1 min read"
    return f"{minutes} min read"

# Routes
@app.route('/')
def home():
    """Home page with hero, features, and services."""
    return render_template('home.html')

@app.route('/services')
def services():
    """Services page with security offerings."""
    return render_template('services.html')

@app.route('/blog')
def blog_redirect():
    return redirect("https://blog.koalasec.co")

@app.route('/about')
def about():
    """About page with team and company info."""
    return render_template('about.html')

@app.route('/partners')
def partners():
    partners_list = [
        {
            'name': 'Aria Soft',
            'logo': url_for('static', filename='img/partners/ariasoft.jpg'),
            'url': 'https://ariasoft.com',
            'description': '''
            Aria Soft is a software development company specializing in web and desktop applications.
Delivering innovative, reliable, and secure solutions for businesses and individuals.'''
        },
        {
            'name': 'Sky Team',
            'logo': url_for('static', filename='img/partners/netdefender.svg'),
            'url': 'https://netdefender.com',
            'description': 'Network defense and monitoring solutions.'
        },
        # {
        #     'name': 'AppShield',
        #     'logo': url_for('static', filename='img/partners/appshield.svg'),
        #     'url': 'https://appshield.com',
        #     'description': 'Application security and code review specialists.'
        # }
    ]
    return render_template('partners.html', partners=partners_list)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page with form handling."""
    if request.method == 'POST':
        # Validate form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        company = request.form.get('company', '').strip()
        message = request.form.get('message', '').strip()
        honeypot = request.form.get('website', '')  # Hidden honeypot field
        
        # Basic validation
        errors = []
        if not name:
            errors.append('Name is required')
        if not email or '@' not in email:
            errors.append('Valid email is required')
        if not message:
            errors.append('Message is required')
        if honeypot:  # If honeypot is filled, likely spam
            errors.append('Invalid submission')
        
        if not errors:
            if save_contact_message({
                'name': name,
                'email': email,
                'company': company,
                'message': message
            }):
                return jsonify({'success': True, 'message': 'Message sent successfully!'})
            else:
                errors.append('Failed to send message. Please try again.')
        
        return jsonify({'success': False, 'errors': errors})
    
    return render_template('contact.html')

# Static files
@app.route('/robots.txt')
def robots():
    """Robots.txt file."""
    return render_template('robots.txt'), 200, {'Content-Type': 'text/plain'}

@app.route('/sitemap.xml')
def sitemap():
    """Sitemap XML."""
    posts = get_blog_posts()
    return render_template('sitemap.xml', posts=posts), 200, {'Content-Type': 'application/xml'}

@app.route('/humans.txt')
def humans():
    """Humans.txt file."""
    return render_template('humans.txt'), 200, {'Content-Type': 'text/plain'}

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """404 error page."""
    return render_template('404.html'), 404

# Security headers
@app.after_request
def add_security_headers(response):
    """Add security headers to all responses."""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    # CSP header
    csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'"
    response.headers['Content-Security-Policy'] = csp
    
    return response

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
