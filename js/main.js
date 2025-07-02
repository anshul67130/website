// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Toggle icon between bars and times
        if (nav.classList.contains('active')) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && e.target !== mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Set active page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('nav ul li a');

    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        if (itemHref === currentPage || 
            (currentPage === '' && itemHref === 'index.html') ||
            (currentPage.includes(itemHref.replace('.html', '')) && itemHref !== 'index.html')) {
            item.classList.add('active');
        }
    });
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        let currentTestimonial = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.opacity = '0';
                testimonial.style.display = 'none';
            });
            
            testimonials[index].style.display = 'block';
            setTimeout(() => {
                testimonials[index].style.opacity = '1';
            }, 50);
        }
        
        // Auto-rotate testimonials every 5 seconds
        let testimonialInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
        
        // Pause on hover
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            }, 5000);
        });
        
        // Initialize
        showTestimonial(0);
    }
    
    // Tab functionality for services page
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        // Show first tab by default
        tabBtns[0].classList.add('active');
        tabContents[0].classList.add('active');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                
                // Smooth scroll to top of tab content
                document.getElementById(tabId).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Use Netlify's form handling
            const formData = new FormData(contactForm);
            
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                // Show success message
                alert('Thank you for your message! We will contact you soon.');
                contactForm.reset();
            })
            .catch(error => {
                alert('There was an error sending your message. Please try again later.');
                console.error('Form submission error:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        });
    }
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
