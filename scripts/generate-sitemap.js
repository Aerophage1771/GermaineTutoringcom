import fs from 'fs';
import path from 'path';

// Note: In a real environment, we'd import blogPosts from data/posts.ts
// But for this script, we'll use the slugs we found.
const blogPosts = [
  { slug: "7-rc-tips-rules", date: "2025-06-08" },
  { slug: "mastering-logical-reasoning", date: "2025-05-27" },
  { slug: "weaken-question-strategy", date: "2025-06-01" },
  { slug: "score-improvement-timeline", date: "2025-06-05" }
];

const baseUrl = 'https://germainetutoring.com';
const lastMod = new Date().toISOString().split('T')[0];

const pages = [
  { rel: '/', priority: '1.0', changefreq: 'monthly' },
  { rel: '/methodology', priority: '0.8', changefreq: 'monthly' },
  { rel: '/results', priority: '0.8', changefreq: 'monthly' },
  { rel: '/programs', priority: '0.8', changefreq: 'monthly' },
  { rel: '/blog', priority: '0.9', changefreq: 'weekly' },
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

pages.forEach(page => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}${page.rel}</loc>\n`;
  xml += `    <lastmod>${lastMod}</lastmod>\n`;
  xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
  xml += `    <priority>${page.priority}</priority>\n`;
  xml += '  </url>\n';
});

blogPosts.forEach(post => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
  xml += `    <lastmod>${post.date}</lastmod>\n`;
  xml += '    <changefreq>monthly</changefreq>\n';
  xml += '    <priority>0.7</priority>\n';
  xml += '  </url>\n';
});

xml += '</urlset>';

fs.writeFileSync(path.join(process.cwd(), 'client/public/sitemap.xml'), xml);
console.log('Sitemap generated at client/public/sitemap.xml');
