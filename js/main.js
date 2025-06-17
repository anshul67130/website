document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('show');
        this.innerHTML = mainNav.classList.contains('show') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (mainNav.classList.contains('show')) {
                    mainNav.classList.remove('show');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message. We will contact you shortly.');
            this.reset();
        });
    }
    
    // Load content
    loadContent();
});

async function loadContent() {
    try {
        const [contentRes, blogRes] = await Promise.all([
            fetch('data/content.json'),
            fetch('data/blog.json')
        ]);
        
        const content = await contentRes.json();
        const blog = await blogRes.json();
        
        populateContent(content);
        populateBlog(blog);
        
    } catch (error) {
        console.error('Error loading content:', error);
        loadFallbackContent();
    }
}

function populateContent(content) {
    // Home
    if (content.home) {
        document.getElementById('hero-title').textContent = content.home.heroTitle;
        document.getElementById('hero-subtitle').textContent = content.home.heroSubtitle;
    }
    
    // Services
    if (content.services) {
        const container = document.getElementById('areas-container');
        container.innerHTML = content.services.map(service => `
            <div class="area-card">
                <div class="area-icon">
                    <i class="fas fa-gavel"></i>
                </div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <a href="#contact" class="btn">Get Consultation</a>
            </div>
        `).join('');

        // Footer services
        const footerServices = document.getElementById('footer-services');
        footerServices.innerHTML = content.services.map(service => `
            <li><a href="#practice-areas">${service.title}</a></li>
        `).join('');
    }
    
    // About
    if (content.about) {
        document.getElementById('about-title').textContent = content.about.title;
        document.getElementById('about-text').textContent = content.about.content;
        
        const credentialsList = document.getElementById('credentials');
        credentialsList.innerHTML = content.about.credentials.map(cred => `
            <li><i class="fas fa-check"></i> ${cred}</li>
        `).join('');
    }
    
    // Testimonials
    if (content.testimonials) {
        const container = document.getElementById('testimonials-container');
        container.innerHTML = content.testimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>"${testimonial.content}"</p>
                </div>
                <div class="client-info">
                    <h4>${testimonial.clientName}</h4>
                    <p>${testimonial.clientTitle}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Contact
    if (content.contact) {
        document.getElementById('contact-title').textContent = content.contact.title;
        document.getElementById('address').textContent = content.contact.address;
        document.getElementById('phone').textContent = content.contact.phone;
        document.getElementById('email').textContent = content.contact.email;
        document.getElementById('hours').textContent = content.contact.hours;
    }
    
    // Settings
    if (content.settings) {
        document.getElementById('firm-name').textContent = content.settings.firmName;
        document.querySelector('footer .footer-col h3').textContent = content.settings.firmName;
        
        const socialContainer = document.querySelector('.social-links');
        socialContainer.innerHTML = content.settings.socialLinks.map(link => `
            <a href="${link.url}" target="_blank"><i class="fab fa-${link.platform}"></i></a>
        `).join('');
    }
}

function populateBlog(posts) {
    const container = document.getElementById('blog-container');
    if (!container) return;
    
    container.innerHTML = posts.map(post => `
        <div class="blog-card">
            <div class="blog-image">
                <img src="assets/lawyer.jpg" alt="${post.title}">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');
}

function loadFallbackContent() {
    console.log('Loading fallback content');
    // Basic fallback content would go here
}

// Sticky header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 50);
});