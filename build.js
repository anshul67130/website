const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Paths
const BLOG_DIR = path.join(__dirname, 'blog');
const TEMPLATE_FILE = path.join(__dirname, 'blog-template.html');
const OUTPUT_FILE = path.join(__dirname, 'blog-index.json');

// Process all blog posts
function processBlogPosts() {
    const posts = [];
    const blogFolders = fs.readdirSync(BLOG_DIR).filter(f => 
        fs.statSync(path.join(BLOG_DIR, f)).isDirectory()
    );

    blogFolders.forEach(folder => {
        const postPath = path.join(BLOG_DIR, folder, 'index.html');
        if (fs.existsSync(postPath)) {
            const fileContent = fs.readFileSync(postPath, 'utf8');
            const { data: frontmatter, content } = matter(fileContent);
            
            // Create complete HTML file using your template
            const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
            const htmlContent = template
                .replace(/{{title}}/g, frontmatter.title || 'Untitled')
                .replace(/{{category}}/g, frontmatter.category || 'Uncategorized')
                .replace(/{{date}}/g, frontmatter.date || new Date().toISOString())
                .replace(/{{image}}/g, frontmatter.image || '/images/blog-default.jpg')
                .replace(/{{body}}/g, content);

            fs.writeFileSync(postPath, htmlContent);

            // Add to index
            posts.push({
                title: frontmatter.title,
                date: frontmatter.date,
                category: frontmatter.category,
                excerpt: frontmatter.excerpt,
                image: frontmatter.image,
                slug: folder
            });
        }
    });

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
    console.log(`Processed ${posts.length} blog posts`);
}

processBlogPosts();
