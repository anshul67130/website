// Main Website Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('show');
        this.innerHTML = mainNav.classList.contains('show') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mainNav.classList.contains('show')) {
                    mainNav.classList.remove('show');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                phone: this.querySelector('#phone').value,
                message: this.querySelector('#message').value
            };
            
            // Here you would typically send to a server
            console.log('Form submitted:', formData);
            
            // Show success message
            alert('Thank you for your message. We will contact you soon.');
            this.reset();
        });
    }
    
    // Load dynamic content
    loadDynamicContent();
});

// Load content from JSON files
async function loadDynamicContent() {
    try {
        // Load main content
        const contentResponse = await fetch('data/content.json');
        const content = await contentResponse.json();
        
        // Load blog posts
        const blogResponse = await fetch('data/blog.json');
        const blog = await blogResponse.json();
        
        // Populate content
        populateContent(content);
        populateBlog(blog);
        
    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback to hardcoded content if files fail to load
        loadFallbackContent();
    }
}

function populateContent(content) {
    // Home section
    if (content.home) {
        if (document.getElementById('hero-title')) {
            document.getElementById('hero-title').textContent = content.home.heroTitle;
        }
        if (document.getElementById('hero-subtitle')) {
            document.getElementById('hero-subtitle').textContent = content.home.heroSubtitle;
        }
        if (document.getElementById('cta-primary')) {
            document.getElementById('cta-primary').textContent = content.home.ctaPrimary;
        }
        if (document.getElementById('cta-secondary')) {
            document.getElementById('cta-secondary').textContent = content.home.ctaSecondary;
        }
    }
    
    // Practice Areas
    if (content.practiceAreas && document.getElementById('areas-container')) {
        const container = document.getElementById('areas-container');
        container.innerHTML = '';
        
        content.practiceAreas.forEach(area => {
            const areaElement = document.createElement('div');
            areaElement.className = 'area-card';
            areaElement.innerHTML = `
                <div class="area-icon">
                    <i class="fas fa-gavel"></i>
                </div>
                <h3>${area.title}</h3>
                <p>${area.description}</p>
                <a href="#contact" class="btn">Get Consultation</a>
            `;
            container.appendChild(areaElement);
        });
    }
    
    // About section
    if (content.about) {
        if (document.getElementById('about-title')) {
            document.getElementById('about-title').textContent = content.about.title;
        }
        if (document.getElementById('about-text')) {
            document.getElementById('about-text').innerHTML = content.about.content;
        }
        
        if (document.getElementById('credentials') && content.about.credentials) {
            const credentialsList = document.getElementById('credentials');
            credentialsList.innerHTML = '';
            content.about.credentials.forEach(credential => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${credential}`;
                credentialsList.appendChild(li);
            });
        }
    }
    
    // Testimonials
    if (content.testimonials && document.getElementById('testimonials-container')) {
        const container = document.getElementById('testimonials-container');
        container.innerHTML = '';
        
        content.testimonials.forEach(testimonial => {
            const testimonialElement = document.createElement('div');
            testimonialElement.className = 'testimonial-card';
            testimonialElement.innerHTML = `
                <div class="testimonial-content">
                    <p>"${testimonial.content}"</p>
                </div>
                <div class="client-info">
                    <h4>${testimonial.clientName}</h4>
                    <p>${testimonial.clientTitle}</p>
                </div>
            `;
            container.appendChild(testimonialElement);
        });
    }
    
    // Contact info
    if (content.contact) {
        if (document.getElementById('contact-title')) {
            document.getElementById('contact-title').textContent = content.contact.title;
        }
        if (document.getElementById('address')) {
            document.getElementById('address').textContent = content.contact.address;
        }
        if (document.getElementById('phone')) {
            document.getElementById('phone').textContent = content.contact.phone;
        }
        if (document.getElementById('email')) {
            document.getElementById('email').textContent = content.contact.email;
        }
        if (document.getElementById('hours')) {
            document.getElementById('hours').textContent = content.contact.hours;
        }
    }
    
    // Settings
    if (content.settings) {
        if (document.getElementById('firm-name')) {
            document.getElementById('firm-name').textContent = content.settings.firmName;
        }
        if (document.getElementById('footer-about-title')) {
            document.getElementById('footer-about-title').textContent = `About ${content.settings.firmName}`;
        }
        if (document.getElementById('copyright')) {
            document.getElementById('copyright').textContent = content.settings.copyright;
        }
        
        // Social links
        if (document.getElementById('social-links') && content.settings.socialLinks) {
            const socialContainer = document.getElementById('social-links');
            socialContainer.innerHTML = '';
            content.settings.socialLinks.forEach(link => {
                const socialLink = document.createElement('a');
                socialLink.href = link.url;
                socialLink.target = '_blank';
                socialLink.rel = 'noopener noreferrer';
                socialLink.innerHTML = `<i class="fab fa-${link.platform}"></i>`;
                socialContainer.appendChild(socialLink);
            });
        }
    }
}

function populateBlog(blogPosts) {
    const container = document.getElementById('blog-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    blogPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-card';
        postElement.innerHTML = `
            <div class="blog-image">
                <img src="assets/blog-placeholder.jpg" alt="${post.title}">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        container.appendChild(postElement);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function loadFallbackContent() {
    // Simple fallback content if JSON fails to load
    console.log('Loading fallback content');
    
    const fallbackContent = {
        home: {
            heroTitle: "Professional Legal Services",
            heroSubtitle: "Experienced legal representation for your needs",
            ctaPrimary: "Free Consultation",
            ctaSecondary: "Call Now"
        },
        practiceAreas: [
            {
                title: "Legal Services",
                description: "Comprehensive legal solutions tailored to your needs"
            }
        ],
        about: {
            title: "About Our Practice",
            content: "We provide dedicated legal services with a focus on client satisfaction.",
            credentials: [
                "Experienced Attorneys",
                "Client-Focused Approach"
            ]
        },
        contact: {
            title: "Contact Us",
            address: "123 Law Street, Suite 100",
            phone: "(555) 123-4567",
            email: "contact@example.com",
            hours: "Monday-Friday: 9AM-5PM"
        },
        settings: {
            firmName: "Legal Practice",
            copyright: "© 2023 Legal Practice. All rights reserved.",
            socialLinks: []
        }
    };
    
    populateContent(fallbackContent);
}

// Sticky header on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});