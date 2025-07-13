// build.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // For parsing front matter

// 1. Configure paths
const BLOG_DIR = path.join(__dirname, 'blog');
const OUTPUT_FILE = path.join(__dirname, 'blog-index.json');

// 2. Get all blog post folders
const getPosts = () => {
  return fs.readdirSync(BLOG_DIR)
    .filter(folder => 
      folder !== 'index.html' && 
      fs.statSync(path.join(BLOG_DIR, folder)).isDirectory()
    )
    .map(folder => {
      const postPath = path.join(BLOG_DIR, folder, 'index.html');
      const content = fs.readFileSync(postPath, 'utf8');
      
      // Extract metadata from HTML comments or front matter
      const metaMatch = content.match(/<!-- META:({.*?})-->/s);
      const meta = metaMatch ? JSON.parse(metaMatch[1]) : {};
      
      return {
        title: meta.title || folder.replace(/-/g, ' '),
        date: meta.date || new Date().toISOString(),
        category: meta.category || 'Uncategorized',
        image: meta.image || '/images/blog-default.webp',
        url: `/blog/${folder}`,
        excerpt: meta.excerpt || ''
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
};

// 3. Generate the index
fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(getPosts(), null, 2)
);

console.log('✅ Generated blog-index.json');
