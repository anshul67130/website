const fs = require('fs/promises');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');
const fetch = require('node-fetch'); // Required for webhook trigger

const blogDir = path.join(__dirname, 'blog');
const templatePath = path.join(__dirname, 'templates', 'blog-post.html');
const outputDir = path.join(__dirname, 'blog');
const indexPath = path.join(__dirname, 'blog-index.json');

// Format date for display
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Replace placeholders like {{ title }} safely
function injectTemplate(template, data) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => data[key] || '');
}

// Build all blog posts and blog-index.json
async function build() {
  console.log('🔧 Starting blog build...');
  const template = await fs.readFile(templatePath, 'utf-8');
  const files = await fs.readdir(blogDir);
  const posts = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(blogDir, file);
    let raw;

    try {
      raw = await fs.readFile(filePath, 'utf-8');
    } catch (err) {
      console.warn(`⚠️ Could not read file ${file}: ${err.message}`);
      continue;
    }

    let data, content;
    try {
      const parsed = matter(raw);
      data = parsed.data;
      content = parsed.content;

      // Skip if essential metadata is missing
      if (!data.title || !data.date) {
        console.warn(`⚠️ Skipping ${file}: missing title or date`);
        continue;
      }
    } catch (err) {
      console.warn(`⚠️ Error parsing frontmatter in ${file}: ${err.message}`);
      continue;
    }

    const slug = data.slug || file.replace(/\.md$/, '');
    const html = marked.parse(content);
    const formattedDate = formatDate(data.date);

    const finalHtml = injectTemplate(template, {
      title: data.title,
      category: data.category,
      date: formattedDate,
      image: data.image,
      body: html,
    });

    const outPath = path.join(outputDir, slug, 'index.html');
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, finalHtml, 'utf-8');

    posts.push({
      title: data.title,
      slug,
      date: data.date,
      image: data.image,
      category: data.category,
      excerpt: data.excerpt,
    });
  }

  // Sort posts newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write blog-index.json
  await fs.writeFile(indexPath, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`✅ Blog build complete. ${posts.length} posts processed.`);

  // Optional: Trigger second build if webhook is configured
  const webhookURL = process.env.NETLIFY_SECOND_BUILD_URL;
  if (webhookURL) {
    console.log('🔁 Triggering second Netlify build to ensure sync...');
    setTimeout(() => {
      fetch(webhookURL, { method: 'POST' })
        .then(res => {
          if (res.ok) {
            console.log('🚀 Second build triggered successfully.');
          } else {
            console.warn(`❌ Webhook failed: ${res.status} ${res.statusText}`);
          }
        })
        .catch(err => {
          console.error('❌ Error triggering webhook:', err.message);
        });
    }, 10000); // Wait 10s to ensure the commit has fully synced
  }
}

build().catch(err => {
  console.error('❌ Blog build failed:', err.message);
  process.exit(1);
});
