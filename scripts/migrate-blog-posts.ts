import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { db } from '../server/db';
import { blogPosts } from '../shared/schema';

async function migratePosts() {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = await fs.readdir(postsDir);
  const mdxFiles = files.filter(f => f.endsWith('.mdx'));

  console.log(`Found ${mdxFiles.length} MDX posts to migrate...`);

  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/, '');
    const filePath = path.join(postsDir, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);

    const htmlContent = content
      .split('\n\n')
      .map(block => {
        block = block.trim();
        if (!block) return '';
        
        if (block.startsWith('## ')) {
          return `<h2>${block.slice(3)}</h2>`;
        }
        if (block.startsWith('### ')) {
          return `<h3>${block.slice(4)}</h3>`;
        }
        if (block.startsWith('# ')) {
          return `<h1>${block.slice(2)}</h1>`;
        }
        if (block.startsWith('> ')) {
          const lines = block.split('\n').map(l => l.replace(/^>\s?-?\s?/, '').trim());
          return `<blockquote><p>${lines.join('<br>')}</p></blockquote>`;
        }
        if (block.startsWith('- ') || block.startsWith('* ')) {
          const items = block.split('\n').map(l => `<li>${l.replace(/^[-*]\s/, '')}</li>`).join('');
          return `<ul>${items}</ul>`;
        }
        if (/^\d+\.\s/.test(block)) {
          const items = block.split('\n').map(l => `<li>${l.replace(/^\d+\.\s/, '')}</li>`).join('');
          return `<ol>${items}</ol>`;
        }
        if (block === '---') {
          return '<hr>';
        }

        let processed = block
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/`(.+?)`/g, '<code>$1</code>')
          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
        
        return `<p>${processed}</p>`;
      })
      .filter(Boolean)
      .join('\n');

    const postDate = new Date(data.date);

    try {
      await db.insert(blogPosts).values({
        title: data.title,
        slug,
        content: htmlContent,
        excerpt: data.snippet || '',
        tags: JSON.stringify(data.tags || []),
        author: data.author || 'Germaine Washington',
        status: 'published',
        published_at: postDate,
      });
      console.log(`  Migrated: ${data.title}`);
    } catch (err: any) {
      if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
        console.log(`  Skipped (already exists): ${slug}`);
      } else {
        console.error(`  Error migrating ${slug}:`, err.message);
      }
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

migratePosts().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
