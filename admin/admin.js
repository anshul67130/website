document.addEventListener('DOMContentLoaded', function() {
    // Initialize website data
    let websiteData = {
        home: {
            heroTitle: "Your Trusted Legal Partners",
            heroSubtitle: "With over 20 years of combined experience, we provide exceptional legal representation tailored to your unique needs."
        },
        services: [
            {
                title: "Corporate Law",
                description: "Comprehensive legal solutions for businesses including formation, contracts, and compliance."
            },
            {
                title: "Family Law",
                description: "Sensitive handling of divorce, child custody, and other family-related legal matters."
            }
        ],
        about: {
            title: "About Our Firm",
            content: "Founded in 2003, Law & Partners has grown from a small practice to one of the most respected law firms in the region. Our team of dedicated attorneys brings diverse expertise to every case.",
            credentials: [
                "20+ Years Combined Experience",
                "1000+ Cases Handled",
                "Award-Winning Legal Team"
            ]
        },
        testimonials: [
            {
                clientName: "Sarah Johnson",
                clientTitle: "Corporate Client",
                content: "The team at Law & Partners saved our business during a critical contract dispute. Their expertise was invaluable."
            }
        ],
        contact: {
            title: "Our Office",
            address: "123 Justice Ave, Suite 500\nNew York, NY 10001",
            phone: "+1 (123) 456-7890",
            email: "contact@lawandpartners.com",
            hours: "Mon-Fri: 9:00 AM - 6:00 PM"
        },
        settings: {
            firmName: "Law & Partners",
            socialLinks: [
                {
                    platform: "facebook",
                    url: "https://facebook.com/lawandpartners"
                },
                {
                    platform: "linkedin",
                    url: "https://linkedin.com/company/law-and-partners"
                }
            ]
        },
        blog: [
            {
                title: "Understanding the New Corporate Transparency Act",
                date: "2023-11-15",
                content: "The Corporate Transparency Act (CTA) introduces significant reporting requirements for businesses. Effective January 1, 2024, most corporations, LLCs, and similar entities will need to report beneficial ownership information to FinCEN."
            }
        ]
    };

    let currentEditItem = null;

    // Load saved data if available
    function loadSavedData() {
        const savedContent = localStorage.getItem('lawWebsiteContent');
        const savedBlog = localStorage.getItem('lawWebsiteBlog');
        
        if (savedContent) {
            const parsedContent = JSON.parse(savedContent);
            websiteData = {
                ...websiteData,
                ...parsedContent
            };
        }
        
        if (savedBlog) {
            websiteData.blog = JSON.parse(savedBlog);
        }
    }

    // Initialize the admin panel
    function initAdminPanel() {
        loadSavedData();
        setupTabNavigation();
        populateForms();
        setupEventListeners();
    }

    // Set up tab navigation
    function setupTabNavigation() {
        const tabs = document.querySelectorAll('.admin-nav a');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show the selected tab content
                const tabId = this.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // Update admin title
                document.getElementById('admin-title').textContent = this.textContent.trim();
            });
        });
        
        // Activate the first tab by default
        if (tabs.length > 0) {
            tabs[0].click();
        }
    }

    // Populate forms with current data
    function populateForms() {
        // Home tab
        document.getElementById('hero-title').value = websiteData.home.heroTitle;
        document.getElementById('hero-subtitle').value = websiteData.home.heroSubtitle;
        
        // Services tab
        renderServicesList();
        
        // About tab
        document.getElementById('about-title').value = websiteData.about.title;
        document.getElementById('about-text').value = websiteData.about.content;
        renderCredentialsList();
        
        // Testimonials tab
        renderTestimonialsList();
        
        // Blog tab
        renderBlogPostsList();
        
        // Contact tab
        document.getElementById('contact-title').value = websiteData.contact.title;
        document.getElementById('address').value = websiteData.contact.address;
        document.getElementById('phone').value = websiteData.contact.phone;
        document.getElementById('email').value = websiteData.contact.email;
        document.getElementById('hours').value = websiteData.contact.hours;
        
        // Settings tab
        document.getElementById('firm-name').value = websiteData.settings.firmName;
        renderSocialLinksList();
    }

    // Render services list
    function renderServicesList() {
        const container = document.getElementById('services-list');
        if (!container) return;
        
        container.innerHTML = websiteData.services.map((service, index) => `
            <div class="item-card">
                <div>
                    <h4>${service.title}</h4>
                    <p>${service.description.substring(0, 60)}...</p>
                </div>
                <div class="item-actions">
                    <button class="edit-service" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-service" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        addServicesEventListeners();
    }

    // Render testimonials list
    function renderTestimonialsList() {
        const container = document.getElementById('testimonials-list');
        if (!container) return;
        
        container.innerHTML = websiteData.testimonials.map((testimonial, index) => `
            <div class="item-card">
                <div>
                    <h4>${testimonial.clientName}</h4>
                    <p>${testimonial.clientTitle}</p>
                    <p>"${testimonial.content.substring(0, 60)}..."</p>
                </div>
                <div class="item-actions">
                    <button class="edit-testimonial" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-testimonial" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        addTestimonialsEventListeners();
    }

    // Render blog posts list
    function renderBlogPostsList() {
        const container = document.getElementById('posts-list');
        if (!container) return;
        
        container.innerHTML = websiteData.blog.map((post, index) => `
            <div class="item-card">
                <div>
                    <h4>${post.title}</h4>
                    <p>${new Date(post.date).toLocaleDateString()}</p>
                    <p>${post.content.substring(0, 60)}...</p>
                </div>
                <div class="item-actions">
                    <button class="edit-post" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-post" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        addBlogPostsEventListeners();
    }

    // Render credentials list
    function renderCredentialsList() {
        const container = document.getElementById('credentials-list');
        if (!container) return;
        
        container.innerHTML = websiteData.about.credentials.map((credential, index) => `
            <div class="credential-item">
                <input type="text" value="${credential}" data-index="${index}">
                <button class="delete-credential" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        addCredentialsEventListeners();
    }

    // Render social links list
    function renderSocialLinksList() {
        const container = document.getElementById('social-links-admin');
        if (!container) return;
        
        container.innerHTML = websiteData.settings.socialLinks.map((link, index) => `
            <div class="social-item">
                <select data-index="${index}" data-field="platform">
                    <option value="facebook" ${link.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                    <option value="twitter" ${link.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                    <option value="linkedin" ${link.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                    <option value="instagram" ${link.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                </select>
                <input type="url" value="${link.url}" data-index="${index}" data-field="url" placeholder="URL">
                <button class="delete-social" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        addSocialLinksEventListeners();
    }

    // Add event listeners for services
    function addServicesEventListeners() {
        document.querySelectorAll('.edit-service').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editService(index);
            });
        });
        
        document.querySelectorAll('.delete-service').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteService(index);
            });
        });
    }

    // Add event listeners for testimonials
    function addTestimonialsEventListeners() {
        document.querySelectorAll('.edit-testimonial').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editTestimonial(index);
            });
        });
        
        document.querySelectorAll('.delete-testimonial').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteTestimonial(index);
            });
        });
    }

    // Add event listeners for blog posts
    function addBlogPostsEventListeners() {
        document.querySelectorAll('.edit-post').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editBlogPost(index);
            });
        });
        
        document.querySelectorAll('.delete-post').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteBlogPost(index);
            });
        });
    }

    // Add event listeners for credentials
    function addCredentialsEventListeners() {
        document.querySelectorAll('.credential-item input').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const value = this.value;
                updateCredential(index, value);
            });
        });
        
        document.querySelectorAll('.delete-credential').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteCredential(index);
            });
        });
    }

    // Add event listeners for social links
    function addSocialLinksEventListeners() {
        document.querySelectorAll('.social-item select').forEach(select => {
            select.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const field = this.getAttribute('data-field');
                const value = this.value;
                updateSocialLink(index, field, value);
            });
        });
        
        document.querySelectorAll('.social-item input').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const field = this.getAttribute('data-field');
                const value = this.value;
                updateSocialLink(index, field, value);
            });
        });
        
        document.querySelectorAll('.delete-social').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteSocialLink(index);
            });
        });
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Add buttons
        document.getElementById('add-service').addEventListener('click', addNewService);
        document.getElementById('add-testimonial').addEventListener('click', addNewTestimonial);
        document.getElementById('add-post').addEventListener('click', addNewBlogPost);
        document.getElementById('add-credential').addEventListener('click', addNewCredential);
        document.getElementById('add-social').addEventListener('click', addNewSocialLink);
        
        // Save all button
        document.getElementById('save-all').addEventListener('click', saveAllChanges);
        
        // Preview button
        document.getElementById('preview').addEventListener('click', previewWebsite);
        
        // Modal buttons
        document.getElementById('save-modal').addEventListener('click', saveModalChanges);
        document.getElementById('cancel-modal').addEventListener('click', closeModal);
        document.querySelector('.close-modal').addEventListener('click', closeModal);
    }

    // Add new service
    function addNewService() {
        currentEditItem = { type: 'service', index: -1 };
        showModal(
            'Add New Service',
            `
            <div class="form-group">
                <label for="modal-title">Service Title</label>
                <input type="text" id="modal-title" required>
            </div>
            <div class="form-group">
                <label for="modal-description">Description</label>
                <textarea id="modal-description" required></textarea>
            </div>
            `
        );
    }

    // Add new testimonial
    function addNewTestimonial() {
        currentEditItem = { type: 'testimonial', index: -1 };
        showModal(
            'Add New Testimonial',
            `
            <div class="form-group">
                <label for="modal-client-name">Client Name</label>
                <input type="text" id="modal-client-name" required>
            </div>
            <div class="form-group">
                <label for="modal-client-title">Client Title</label>
                <input type="text" id="modal-client-title">
            </div>
            <div class="form-group">
                <label for="modal-content">Testimonial Content</label>
                <textarea id="modal-content" required></textarea>
            </div>
            `
        );
    }

    // Add new blog post
    function addNewBlogPost() {
        currentEditItem = { type: 'blog', index: -1 };
        showModal(
            'Add New Blog Post',
            `
            <div class="form-group">
                <label for="modal-title">Post Title</label>
                <input type="text" id="modal-title" required>
            </div>
            <div class="form-group">
                <label for="modal-date">Date</label>
                <input type="date" id="modal-date" required>
            </div>
            <div class="form-group">
                <label for="modal-content">Post Content</label>
                <textarea id="modal-content" required rows="8"></textarea>
            </div>
            `
        );
    }

    // Add new credential
    function addNewCredential() {
        if (!websiteData.about.credentials) {
            websiteData.about.credentials = [];
        }
        websiteData.about.credentials.push("New Credential");
        renderCredentialsList();
        
        // Focus the new input
        const inputs = document.querySelectorAll('.credential-item input');
        if (inputs.length > 0) {
            const newInput = inputs[inputs.length - 1];
            newInput.focus();
            newInput.select();
        }
    }

    // Add new social link
    function addNewSocialLink() {
        if (!websiteData.settings.socialLinks) {
            websiteData.settings.socialLinks = [];
        }
        websiteData.settings.socialLinks.push({
            platform: 'facebook',
            url: ''
        });
        renderSocialLinksList();
    }

    // Edit service
    function editService(index) {
        const service = websiteData.services[index];
        currentEditItem = { type: 'service', index: index };
        
        showModal(
            'Edit Service',
            `
            <div class="form-group">
                <label for="modal-title">Service Title</label>
                <input type="text" id="modal-title" value="${service.title}" required>
            </div>
            <div class="form-group">
                <label for="modal-description">Description</label>
                <textarea id="modal-description" required>${service.description}</textarea>
            </div>
            `
        );
    }

    // Edit testimonial
    function editTestimonial(index) {
        const testimonial = websiteData.testimonials[index];
        currentEditItem = { type: 'testimonial', index: index };
        
        showModal(
            'Edit Testimonial',
            `
            <div class="form-group">
                <label for="modal-client-name">Client Name</label>
                <input type="text" id="modal-client-name" value="${testimonial.clientName}" required>
            </div>
            <div class="form-group">
                <label for="modal-client-title">Client Title</label>
                <input type="text" id="modal-client-title" value="${testimonial.clientTitle || ''}">
            </div>
            <div class="form-group">
                <label for="modal-content">Testimonial Content</label>
                <textarea id="modal-content" required>${testimonial.content}</textarea>
            </div>
            `
        );
    }

    // Edit blog post
    function editBlogPost(index) {
        const post = websiteData.blog[index];
        currentEditItem = { type: 'blog', index: index };
        
        showModal(
            'Edit Blog Post',
            `
            <div class="form-group">
                <label for="modal-title">Post Title</label>
                <input type="text" id="modal-title" value="${post.title}" required>
            </div>
            <div class="form-group">
                <label for="modal-date">Date</label>
                <input type="date" id="modal-date" value="${post.date}" required>
            </div>
            <div class="form-group">
                <label for="modal-content">Post Content</label>
                <textarea id="modal-content" required rows="8">${post.content}</textarea>
            </div>
            `
        );
    }

    // Delete service
    function deleteService(index) {
        if (confirm('Are you sure you want to delete this service?')) {
            websiteData.services.splice(index, 1);
            renderServicesList();
        }
    }

    // Delete testimonial
    function deleteTestimonial(index) {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            websiteData.testimonials.splice(index, 1);
            renderTestimonialsList();
        }
    }

    // Delete blog post
    function deleteBlogPost(index) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            websiteData.blog.splice(index, 1);
            renderBlogPostsList();
        }
    }

    // Delete credential
    function deleteCredential(index) {
        websiteData.about.credentials.splice(index, 1);
        renderCredentialsList();
    }

    // Delete social link
    function deleteSocialLink(index) {
        websiteData.settings.socialLinks.splice(index, 1);
        renderSocialLinksList();
    }

    // Update credential
    function updateCredential(index, value) {
        websiteData.about.credentials[index] = value;
    }

    // Update social link
    function updateSocialLink(index, field, value) {
        websiteData.settings.socialLinks[index][field] = value;
    }

    // Show modal
    function showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-form').innerHTML = content;
        document.getElementById('edit-modal').style.display = 'flex';
    }

    // Close modal
    function closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
        currentEditItem = null;
    }

    // Save modal changes
    function saveModalChanges() {
        if (!currentEditItem) return;
        
        switch (currentEditItem.type) {
            case 'service':
                const serviceTitle = document.getElementById('modal-title').value;
                const serviceDescription = document.getElementById('modal-description').value;
                
                const serviceData = {
                    title: serviceTitle,
                    description: serviceDescription
                };
                
                if (currentEditItem.index === -1) {
                    // Add new service
                    if (!websiteData.services) websiteData.services = [];
                    websiteData.services.push(serviceData);
                } else {
                    // Update existing service
                    websiteData.services[currentEditItem.index] = serviceData;
                }
                renderServicesList();
                break;
                
            case 'testimonial':
                const clientName = document.getElementById('modal-client-name').value;
                const clientTitle = document.getElementById('modal-client-title').value;
                const testimonialContent = document.getElementById('modal-content').value;
                
                const testimonialData = {
                    clientName: clientName,
                    clientTitle: clientTitle,
                    content: testimonialContent
                };
                
                if (currentEditItem.index === -1) {
                    // Add new testimonial
                    if (!websiteData.testimonials) websiteData.testimonials = [];
                    websiteData.testimonials.push(testimonialData);
                } else {
                    // Update existing testimonial
                    websiteData.testimonials[currentEditItem.index] = testimonialData;
                }
                renderTestimonialsList();
                break;
                
            case 'blog':
                const postTitle = document.getElementById('modal-title').value;
                const postDate = document.getElementById('modal-date').value;
                const postContent = document.getElementById('modal-content').value;
                
                const postData = {
                    title: postTitle,
                    date: postDate,
                    content: postContent
                };
                
                if (currentEditItem.index === -1) {
                    // Add new post
                    if (!websiteData.blog) websiteData.blog = [];
                    websiteData.blog.push(postData);
                } else {
                    // Update existing post
                    websiteData.blog[currentEditItem.index] = postData;
                }
                renderBlogPostsList();
                break;
        }
        
        closeModal();
    }

    // Save all changes
    function saveAllChanges() {
        // Update from form fields
        websiteData.home.heroTitle = document.getElementById('hero-title').value;
        websiteData.home.heroSubtitle = document.getElementById('hero-subtitle').value;
        
        websiteData.about.title = document.getElementById('about-title').value;
        websiteData.about.content = document.getElementById('about-text').value;
        
        websiteData.contact.title = document.getElementById('contact-title').value;
        websiteData.contact.address = document.getElementById('address').value;
        websiteData.contact.phone = document.getElementById('phone').value;
        websiteData.contact.email = document.getElementById('email').value;
        websiteData.contact.hours = document.getElementById('hours').value;
        
        websiteData.settings.firmName = document.getElementById('firm-name').value;
        
        // Save to localStorage (in a real app, you would send to a server)
        localStorage.setItem('lawWebsiteContent', JSON.stringify({
            home: websiteData.home,
            services: websiteData.services,
            about: websiteData.about,
            testimonials: websiteData.testimonials,
            contact: websiteData.contact,
            settings: websiteData.settings
        }));
        
        localStorage.setItem('lawWebsiteBlog', JSON.stringify(websiteData.blog));
        
        alert('All changes have been saved successfully!');
    }

    // Preview website
    function previewWebsite() {
        // Save changes first
        saveAllChanges();
        
        // Open in new tab
        window.open('../index.html', '_blank');
    }

    // Initialize the admin panel
    initAdminPanel();
});