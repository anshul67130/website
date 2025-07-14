const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');


const { marked } = require('marked');
const blogDir = path.join(__dirname, 'blog');
const templatePath = path.join(__dirname, 'templates', 'blog-post.html');
const outputDir = path.join(__dirname, 'blog');
const indexPath = path.join(__dirname, 'blog-index.json');

const template = fs.readFileSync(templatePath, 'utf-8');

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const posts = [];

fs.readdirSync(blogDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(blogDir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    const html = marked(content);
    const slug = data.slug || file.replace(/\.md$/, '');
    const outPath = path.join(outputDir, slug, 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    const finalHtml = template
      .replace('{{ title }}', data.title)
      .replace('{{ category }}', data.category)
      .replace('{{ date | formatDate }}', formatDate(data.date))
      .replace('{{ image }}', data.image)
      .replace('{{ body | markdown }}', html);

    fs.writeFileSync(outPath, finalHtml, 'utf-8');

    posts.push({
      title: data.title,
      slug: slug,
      date: data.date,
      image: data.image,
      category: data.category,
      excerpt: data.excerpt,
    });
  }
});

fs.writeFileSync(indexPath, JSON.stringify(posts, null, 2), 'utf-8');

console.log('✅ Blog posts built successfully');
