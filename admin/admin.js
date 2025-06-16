// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load all content
    let websiteContent = {};
    let currentEditItem = null;
    
    // Tab switching
    const tabs = document.querySelectorAll('.admin-nav a');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update admin title
            document.getElementById('admin-title').textContent = this.textContent.trim();
            
            // Show correct tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Load data from JSON files
    function loadContent() {
        fetch('../data/content.json')
            .then(response => response.json())
            .then(data => {
                websiteContent = data;
                populateForms();
            })
            .catch(error => console.error('Error loading content:', error));
        
        fetch('../data/blog.json')
            .then(response => response.json())
            .then(data => {
                websiteContent.blog = data;
                renderBlogPosts();
            })
            .catch(error => console.error('Error loading blog posts:', error));
    }
    
    // Populate forms with current content
    function populateForms() {
        // Home tab
        document.getElementById('hero-title').value = websiteContent.home.heroTitle;
        document.getElementById('hero-subtitle').value = websiteContent.home.heroSubtitle;
        document.getElementById('cta-primary').value = websiteContent.home.ctaPrimary;
        document.getElementById('cta-secondary').value = websiteContent.home.ctaSecondary;
        
        // Practice Areas
        renderPracticeAreas();
        
        // About tab
        document.getElementById('about-title').value = websiteContent.about.title;
        document.getElementById('about-text').value = websiteContent.about.content;
        renderCredentials();
        
        // Testimonials
        renderTestimonials();
        
        // Contact tab
        document.getElementById('contact-title').value = websiteContent.contact.title;
        document.getElementById('address').value = websiteContent.contact.address;
        document.getElementById('phone').value = websiteContent.contact.phone;
        document.getElementById('email').value = websiteContent.contact.email;
        document.getElementById('hours').value = websiteContent.contact.hours;
        
        // Settings tab
        document.getElementById('firm-name').value = websiteContent.settings.firmName;
        document.getElementById('copyright').value = websiteContent.settings.copyright;
        renderSocialLinks();
    }
    
    // Practice Areas Management
    function renderPracticeAreas() {
        const container = document.getElementById('areas-list');
        container.innerHTML = '';
        
        websiteContent.practiceAreas.forEach((area, index) => {
            const areaElement = document.createElement('div');
            areaElement.className = 'area-item';
            areaElement.innerHTML = `
                <h3>${area.title}</h3>
                <p>${area.description.substring(0, 50)}...</p>
                <div class="item-actions">
                    <button class="btn edit-area" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="btn delete-area" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            container.appendChild(areaElement);
        });
        
        // Add event listeners
        document.querySelectorAll('.edit-area').forEach(btn => {
            btn.addEventListener('click', function() {
                editPracticeArea(parseInt(this.getAttribute('data-index')));
            });
        });
        
        document.querySelectorAll('.delete-area').forEach(btn => {
            btn.addEventListener('click', function() {
                deletePracticeArea(parseInt(this.getAttribute('data-index')));
            });
        });
    }
    
    function editPracticeArea(index) {
        currentEditItem = { type: 'practiceArea', index: index };
        const area = websiteContent.practiceAreas[index];
        
        document.getElementById('modal-title').textContent = 'Edit Practice Area';
        
        const form = document.getElementById('modal-form');
        form.innerHTML = `
            <div class="form-group">
                <label for="edit-area-title">Title</label>
                <input type="text" id="edit-area-title" value="${area.title}" required>
            </div>
            <div class="form-group">
                <label for="edit-area-desc">Description</label>
                <textarea id="edit-area-desc" required>${area.description}</textarea>
            </div>
        `;
        
        document.getElementById('edit-modal').style.display = 'block';
    }
    
    function deletePracticeArea(index) {
        if (confirm('Are you sure you want to delete this practice area?')) {
            websiteContent.practiceAreas.splice(index, 1);
            renderPracticeAreas();
        }
    }
    
    document.getElementById('add-area').addEventListener('click', function() {
        currentEditItem = { type: 'practiceArea', index: -1 };
        
        document.getElementById('modal-title').textContent = 'Add Practice Area';
        
        const form = document.getElementById('modal-form');
        form.innerHTML = `
            <div class="form-group">
                <label for="edit-area-title">Title</label>
                <input type="text" id="edit-area-title" required>
            </div>
            <div class="form-group">
                <label for="edit-area-desc">Description</label>
                <textarea id="edit-area-desc" required></textarea>
            </div>
        `;
        
        document.getElementById('edit-modal').style.display = 'block';
    });
    
    // Blog Posts Management
    function renderBlogPosts() {
        const container = document.getElementById('posts-list');
        container.innerHTML = '';
        
        websiteContent.blog.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.date} • ${post.content.substring(0, 50)}...</p>
                <div class="item-actions">
                    <button class="btn edit-post" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="btn delete-post" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            container.appendChild(postElement);
        });
        
        // Add event listeners
        document.querySelectorAll('.edit-post').forEach(btn => {
            btn.addEventListener('click', function() {
                editBlogPost(parseInt(this.getAttribute('data-index')));
            });
        });
        
        document.querySelectorAll('.delete-post').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteBlogPost(parseInt(this.getAttribute('data-index')));
            });
        });
    }
    
    function editBlogPost(index) {
        currentEditItem = { type: 'blogPost', index: index };
        const post = websiteContent.blog[index];
        
        document.getElementById('modal-title').textContent = 'Edit Blog Post';
        
        const form = document.getElementById('modal-form');
        form.innerHTML = `
            <div class="form-group">
                <label for="edit-post-title">Title</label>
                <input type="text" id="edit-post-title" value="${post.title}" required>
            </div>
            <div class="form-group">
                <label for="edit-post-date">Date</label>
                <input type="date" id="edit-post-date" value="${post.date}" required>
            </div>
            <div class="form-group">
                <label for="edit-post-content">Content</label>
                <textarea id="edit-post-content" rows="6" required>${post.content}</textarea>
            </div>
        `;
        
        document.getElementById('edit-modal').style.display = 'block';
    }
    
    function deleteBlogPost(index) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            websiteContent.blog.splice(index, 1);
            renderBlogPosts();
        }
    }
    
    document.getElementById('add-post').addEventListener('click', function() {
        currentEditItem = { type: 'blogPost', index: -1 };
        
        document.getElementById('modal-title').textContent = 'Add Blog Post';
        
        const form = document.getElementById('modal-form');
        form.innerHTML = `
            <div class="form-group">
                <label for="edit-post-title">Title</label>
                <input type="text" id="edit-post-title" required>
            </div>
            <div class="form-group">
                <label for="edit-post-date">Date</label>
                <input type="date" id="edit-post-date" required>
            </div>
            <div class="form-group">
                <label for="edit-post-content">Content</label>
                <textarea id="edit-post-content" rows="6" required></textarea>
            </div>
        `;
        
        document.getElementById('edit-modal').style.display = 'block';
    });
    
    // Testimonials Management
    function renderTestimonials() {
        const container = document.getElementById('testimonials-list');
        container.innerHTML = '';
        
        websiteContent.testimonials.forEach((testimonial, index) => {
            const testimonialElement = document.createElement('div');
            testimonialElement.className = 'testimonial-item';
            testimonialElement.innerHTML = `
                <div class="client-info">
                    <h3>${testimonial.clientName}</h3>
                    <p>${testimonial.clientTitle}</p>
                </div>
                <p>"${testimonial.content.substring(0, 50)}..."</p>
                <div class="item-actions">
                    <button class="btn edit-testimonial" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="btn delete-testimonial" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            container.appendChild(testimonialElement);
        });
        
        // Add event listeners
        document.querySelectorAll('.edit-testimonial').forEach(btn => {
            btn.addEventListener('click', function() {
                editTestimonial(parseInt(this.getAttribute('data-index')));
            });
        });
        
        document.querySelectorAll('.delete-testimonial').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteTestimonial(parseInt(this.getAttribute('data-index')));
            });
        });
    }
    
    function editTestimonial(index) {
        currentEditItem = { type: 'testimonial', index: index };
        const testimonial = websiteContent.testimonials[index];
        
        document.getElementById('modal-title').textContent = 'Edit Testimonial';
        
        const form = document.getElementById('modal-form');
        form.innerHTML = `
            <div class="form-group">
                <label for="edit-testimonial-name">Client Name</label>
                <input type="text" id="edit-testimonial-name" value="${testimonial.clientName}" required>
            </div>
            <div class="form-group">
                <label for="edit-testimonial-title">Client Title</label>
                <input type="text" id="edit-testimonial-title" value="${testimonial.clientTitle}" required>
            </div>
            <div class="form-group">
                <label for="edit-testimonial-content">Testimonial</label>
                <textarea id="edit-testimonial-content" required>${testimonial.content}</textarea>
            </div>
        `;
        
        document.getElementById('edit-modal').style.display = 'block';
    }
    
    function deleteTestimonial(index) {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            websiteContent.testimonials.splice(index, 1);
            renderTestimonials();
        }
    }
    
    document.getElementById('add-testimonial').addEventListener('click', function() {
        currentEditItem = { type: 'testimonial', index: -1 };
        
        document.getElementById('modal-title').textContent = 'Add Testimonial';
        
        const form = document.getElementById('modal-form');
        form.innerHTML = `
            <div class="form-group">
                <label for="edit-testimonial-name">Client Name</label>
                <input type="text" id="edit-testimonial-name" required>
            </div>
            <div class="form-group">
                <label for="edit-testimonial-title">Client Title</label>
                <input type="text" id="edit-testimonial-title" required>
            </div>
            <div class="form-group">
                <label for="edit-testimonial-content">Testimonial</label>
                <textarea id="edit-testimonial-content" required></textarea>
            </div>
        `;
        
        document.getElementById('edit-modal').style.display = 'block';
    });
    
    // Credentials Management
    function renderCredentials() {
        const container = document.getElementById('credentials-list');
        container.innerHTML = '';
        
        websiteContent.about.credentials.forEach((credential, index) => {
            const credentialElement = document.createElement('div');
            credentialElement.className = 'credential-item';
            credentialElement.innerHTML = `
                <input type="text" value="${credential}" class="credential-input" data-index="${index}">
                <button class="btn delete-credential" data-index="${index}"><i class="fas fa-times"></i></button>
            `;
            container.appendChild(credentialElement);
        });
        
        // Add event listeners
        document.querySelectorAll('.delete-credential').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteCredential(parseInt(this.getAttribute('data-index')));
            });
        });
        
        document.querySelectorAll('.credential-input').forEach(input => {
            input.addEventListener('change', function() {
                updateCredential(parseInt(this.getAttribute('data-index')), this.value);
            });
        });
    }
    
    function updateCredential(index, value) {
        websiteContent.about.credentials[index] = value;
    }
    
    function deleteCredential(index) {
        websiteContent.about.credentials.splice(index, 1);
        renderCredentials();
    }
    
    document.getElementById('add-credential').addEventListener('click', function() {
        websiteContent.about.credentials.push('New Credential');
        renderCredentials();
        // Scroll to bottom and focus the new input
        const container = document.getElementById('credentials-list');
        const lastInput = container.lastElementChild.querySelector('input');
        lastInput.focus();
        lastInput.select();
    });
    
    // Social Links Management
    function renderSocialLinks() {
        const container = document.getElementById('social-links-admin');
        container.innerHTML = '';
        
        websiteContent.settings.socialLinks.forEach((link, index) => {
            const linkElement = document.createElement('div');
            linkElement.className = 'social-link-item';
            linkElement.innerHTML = `
                <select class="social-platform" data-index="${index}">
                    <option value="facebook" ${link.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                    <option value="twitter" ${link.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                    <option value="linkedin" ${link.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                    <option value="instagram" ${link.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                    <option value="youtube" ${link.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                </select>
                <input type="url" value="${link.url}" class="social-url" data-index="${index}" placeholder="URL">
                <button class="btn delete-social" data-index="${index}"><i class="fas fa-times"></i></button>
            `;
            container.appendChild(linkElement);
        });
        
        // Add event listeners
        document.querySelectorAll('.delete-social').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteSocialLink(parseInt(this.getAttribute('data-index')));
            });
        });
        
        document.querySelectorAll('.social-platform').forEach(select => {
            select.addEventListener('change', function() {
                updateSocialLink(parseInt(this.getAttribute('data-index')), 'platform', this.value);
            });
        });
        
        document.querySelectorAll('.social-url').forEach(input => {
            input.addEventListener('change', function() {
                updateSocialLink(parseInt(this.getAttribute('data-index')), 'url', this.value);
            });
        });
    }
    
    function updateSocialLink(index, field, value) {
        websiteContent.settings.socialLinks[index][field] = value;
    }
    
    function deleteSocialLink(index) {
        websiteContent.settings.socialLinks.splice(index, 1);
        renderSocialLinks();
    }
    
    document.getElementById('add-social').addEventListener('click', function() {
        websiteContent.settings.socialLinks.push({
            platform: 'facebook',
            url: ''
        });
        renderSocialLinks();
    });
    
    // Modal functionality
    document.getElementById('save-modal').addEventListener('click', function() {
        if (!currentEditItem) return;
        
        switch(currentEditItem.type) {
            case 'practiceArea':
                const areaData = {
                    title: document.getElementById('edit-area-title').value,
                    description: document.getElementById('edit-area-desc').value
                };
                
                if (currentEditItem.index === -1) {
                    // Add new
                    websiteContent.practiceAreas.push(areaData);
                } else {
                    // Update existing
                    websiteContent.practiceAreas[currentEditItem.index] = areaData;
                }
                renderPracticeAreas();
                break;
                
            case 'blogPost':
                const postData = {
                    title: document.getElementById('edit-post-title').value,
                    date: document.getElementById('edit-post-date').value,
                    content: document.getElementById('edit-post-content').value
                };
                
                if (currentEditItem.index === -1) {
                    // Add new
                    websiteContent.blog.push(postData);
                } else {
                    // Update existing
                    websiteContent.blog[currentEditItem.index] = postData;
                }
                renderBlogPosts();
                break;
                
            case 'testimonial':
                const testimonialData = {
                    clientName: document.getElementById('edit-testimonial-name').value,
                    clientTitle: document.getElementById('edit-testimonial-title').value,
                    content: document.getElementById('edit-testimonial-content').value
                };
                
                if (currentEditItem.index === -1) {
                    // Add new
                    websiteContent.testimonials.push(testimonialData);
                } else {
                    // Update existing
                    websiteContent.testimonials[currentEditItem.index] = testimonialData;
                }
                renderTestimonials();
                break;
        }
        
        closeModal();
    });
    
    document.getElementById('cancel-modal').addEventListener('click', closeModal);
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    function closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
        currentEditItem = null;
    }
    
    // Save all changes
    document.getElementById('save-all').addEventListener('click', function() {
        // Update content from forms
        websiteContent.home = {
            heroTitle: document.getElementById('hero-title').value,
            heroSubtitle: document.getElementById('hero-subtitle').value,
            ctaPrimary: document.getElementById('cta-primary').value,
            ctaSecondary: document.getElementById('cta-secondary').value
        };
        
        websiteContent.about = {
            title: document.getElementById('about-title').value,
            content: document.getElementById('about-text').value,
            credentials: websiteContent.about.credentials
        };
        
        websiteContent.contact = {
            title: document.getElementById('contact-title').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            hours: document.getElementById('hours').value
        };
        
        websiteContent.settings = {
            firmName: document.getElementById('firm-name').value,
            copyright: document.getElementById('copyright').value,
            socialLinks: websiteContent.settings.socialLinks
        };
        
        // Save to JSON files
        saveContent();
    });
    
    function saveContent() {
        // Split content into two files
        const mainContent = {
            home: websiteContent.home,
            practiceAreas: websiteContent.practiceAreas,
            about: websiteContent.about,
            testimonials: websiteContent.testimonials,
            contact: websiteContent.contact,
            settings: websiteContent.settings
        };
        
        const blogContent = websiteContent.blog;
        
        // In a real implementation, you would send this to a server to save
        // For this demo, we'll simulate it with localStorage
        localStorage.setItem('websiteContent', JSON.stringify(mainContent));
        localStorage.setItem('websiteBlog', JSON.stringify(blogContent));
        
        alert('All changes saved successfully!');
    }
    
    // Preview functionality
    document.getElementById('preview').addEventListener('click', function() {
        // In a real implementation, this would open a preview window
        alert('In a complete implementation, this would open a preview of the website with your changes.');
    });
    
    // Initialize
    loadContent();
});
