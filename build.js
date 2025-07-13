const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Paths
const BLOG_DIR = path.join(__dirname, 'blog');
const OUTPUT_FILE = path.join(__dirname, 'blog-index.json');

// Get all blog posts
function getBlogPosts() {
    const posts = [];
    const folders = fs.readdirSync(BLOG_DIR);
    
    folders.forEach(folder => {
        const folderPath = path.join(BLOG_DIR, folder);
        const indexPath = path.join(folderPath, 'index.html');
        
        if (fs.existsSync(indexPath)) {
            const fileContent = fs.readFileSync(indexPath, 'utf8');
            const { data: frontmatter } = matter(fileContent);
            
            posts.push({
                title: frontmatter.title || 'Untitled',
                date: frontmatter.date || new Date().toISOString(),
                category: frontmatter.category || 'Uncategorized',
                excerpt: frontmatter.excerpt || '',
                image: frontmatter.image || '/images/blog-default.jpg',
                slug: folder
            });
        }
    });
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return posts;
}

// Generate the index
const blogPosts = getBlogPosts();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(blogPosts, null, 2));
console.log(`Generated ${blogPosts.length} blog posts in ${OUTPUT_FILE}`);
