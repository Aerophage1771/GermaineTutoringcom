export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
  author: string;
  readTime: number;
  content: string;
  featured_image?: string;
}
