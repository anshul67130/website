const fs = require('fs/promises');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

const blogDir = path.join(__dirname, 'blog');
const templatePath = path.join(__dirname, 'templates', 'blog-post.html');
const outputDir = path.join(__dirname, 'blog');
const indexPath = path.join(__dirname, 'blog-index.json');

// Format date to readable string
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Replace placeholders like {{ title }} in the template
function injectTemplate(template, data) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => data[key] || '');
}

// Main build function
async function build() {
  console.log('🔧 Starting blog build...');

  await new Promise(resolve => setTimeout(resolve, 300)); // Buffer for Netlify timing

  const template = await fs.readFile(templatePath, 'utf-8');
  const files = await fs.readdir(blogDir);

  const posts = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(blogDir, file);
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);

    const slug = data.slug || file.replace(/\.md$/, '');
    const html = marked.parse(content);
    const formattedDate = formatDate(data.date);

    const outputPath = path.join(outputDir, slug, 'index.html');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const finalHtml = injectTemplate(template, {
      title: data.title,
      category: data.category,
      date: formattedDate,
      image: data.image,
      body: html,
    });

    await fs.writeFile(outputPath, finalHtml, 'utf-8');

    posts.push({
      title: data.title,
      slug,
      date: data.date,
      image: data.image,
      category: data.category,
      excerpt: data.excerpt,
    });
  }

  await fs.writeFile(indexPath, JSON.stringify(posts, null, 2), 'utf-8');

  console.log('✅ Blog build completed. Posts generated:', posts.length);
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
