import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
  author: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
  author: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    const mdxFiles = fileNames.filter(name => name.endsWith('.mdx'));
    
    const posts = await Promise.all(
      mdxFiles.map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { data } = matter(fileContents);
        
        return {
          slug,
          title: data.title,
          date: data.date,
          snippet: data.snippet,
          tags: data.tags || [],
          author: data.author,
        };
      })
    );
    
    // Sort posts by date, newest first
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title,
      date: data.date,
      snippet: data.snippet,
      tags: data.tags || [],
      author: data.author,
      content,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    return fileNames
      .filter(name => name.endsWith('.mdx'))
      .map(name => name.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('Error reading post slugs:', error);
    return [];
  }
}