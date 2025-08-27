# KoalaSec Website

A modern, dark + purple cybersecurity company website built with Flask, featuring a blog system, contact forms, and responsive design.

## Features

- **Modern Design**: Dark theme with purple accents and cyber aesthetics
- **Responsive Layout**: Mobile-first design that works on all devices
- **Blog System**: Markdown-based blog with automatic reading time calculation
- **Contact Forms**: Secure contact form with validation and spam protection
- **Security Features**: Security headers, CSRF protection, and input validation
- **Accessibility**: WCAG AA compliant with proper semantic HTML
- **Performance**: Optimized for Core Web Vitals

## Tech Stack

- **Backend**: Flask (Python 3.10+)
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Custom CSS with CSS variables and modern features
- **Blog**: Markdown parsing with Pygments code highlighting
- **Database**: JSON file storage for simplicity
- **Fonts**: Google Fonts (Space Grotesk, Inter)

## Quick Start

### Prerequisites

- Python 3.10 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd koalasec
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://127.0.0.1:5000`

## Project Structure

```
koalasec/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── blog/                 # Markdown blog posts
│   ├── 2024-01-15-essential-web-application-security-tips.md
│   ├── 2024-01-20-incident-response-best-practices.md
│   └── 2024-01-25-cloud-security-fundamentals.md
├── data/                 # Data storage (auto-created)
│   └── messages.json     # Contact form submissions
├── static/               # Static assets
│   ├── css/
│   │   ├── reset.css     # CSS reset
│   │   └── style.css     # Main stylesheet
│   ├── js/
│   │   ├── main.js       # Main JavaScript
│   │   ├── contact.js    # Contact form handling
│   │   ├── blog.js       # Blog functionality
│   │   └── post.js       # Blog post features
│   └── img/
│       └── logo.svg      # Company logo
└── templates/            # HTML templates
    ├── base.html         # Base template
    ├── home.html         # Home page
    ├── services.html     # Services page
    ├── blog.html         # Blog listing
    ├── post.html         # Individual blog post
    ├── about.html        # About page
    ├── contact.html      # Contact page
    ├── 404.html          # Error page
    ├── robots.txt        # SEO robots file
    ├── sitemap.xml       # SEO sitemap
    ├── humans.txt        # Human-readable info
    └── components/       # Reusable components
        ├── navbar.html    # Navigation
        └── footer.html    # Footer
```

## Adding Blog Posts

1. **Create a new Markdown file** in the `blog/` directory
2. **Use the naming convention**: `YYYY-MM-DD-title.md`
3. **Add content** using Markdown syntax
4. **The first H1 heading** becomes the post title
5. **Optional frontmatter** for metadata:

```markdown
---
title: "Your Post Title"
date: "2024-01-30"
summary: "Brief description of the post"
tags: ["security", "tips", "guide"]
---

# Your Post Title

Your content here...
```

## Configuration

### Environment Variables

The application uses default configuration, but you can customize:

- `FLASK_ENV`: Set to `production` for production deployment
- `FLASK_DEBUG`: Set to `False` in production

### Security Headers

Security headers are automatically applied:

- Content Security Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

## Development

### Running in Development Mode

```bash
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

### Code Style

- **Python**: Follow PEP 8 guidelines
- **HTML**: Use semantic HTML5 elements
- **CSS**: Use CSS variables and modern features
- **JavaScript**: Use ES6+ features with fallbacks

### Testing

The application includes basic error handling and validation:

- Form validation (client and server-side)
- Input sanitization
- CSRF protection
- Spam protection (honeypot fields)

## Deployment

### Production Deployment

1. **Set environment variables**
   ```bash
   export FLASK_ENV=production
   export FLASK_DEBUG=False
   ```

2. **Use a production WSGI server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

3. **Set up a reverse proxy** (Nginx recommended)
4. **Configure SSL/TLS** certificates
5. **Set up monitoring** and logging

### Docker Deployment

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
```

## Customization

### Colors and Theme

Modify CSS variables in `static/css/style.css`:

```css
:root {
    --bg: #0b0f14;           /* Background color */
    --primary: #a855f7;      /* Primary purple */
    --accent: #22d3ee;       /* Accent cyan */
    --text: #e5e7eb;         /* Text color */
    /* ... more variables */
}
```

### Content

- Update company information in templates
- Modify services and team details
- Customize contact information
- Update logo and branding

## Performance Optimization

### Current Optimizations

- Minified CSS and JavaScript
- Optimized images and SVGs
- Efficient Flask routing
- Minimal dependencies

### Additional Optimizations

- Enable gzip compression
- Use CDN for static assets
- Implement caching headers
- Optimize images further

## Security Features

- **Input Validation**: Server-side validation for all forms
- **CSRF Protection**: Built-in Flask protection
- **Security Headers**: Comprehensive security headers
- **Spam Protection**: Honeypot fields and validation
- **Secure Storage**: JSON storage with proper permissions

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Fallbacks**: Graceful degradation for older browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## Acknowledgments

- Flask team for the excellent web framework
- Google Fonts for typography
- OWASP for security best practices
- The cybersecurity community for inspiration

---

**KoalaSec** - Securing your digital world with human expertise.
