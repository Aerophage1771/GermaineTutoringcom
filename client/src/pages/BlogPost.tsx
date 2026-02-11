import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Clock, ArrowLeft, ArrowRight, ChevronRight, User, List } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
  author: string;
  content: string;
  featured_image?: string | null;
  meta_description?: string | null;
  readTime?: number;
}

const TAG_LABELS: Record<string, string> = {
  "logical-reasoning": "Logical Reasoning",
  "reading-comprehension": "Reading Comprehension",
  "strategy": "Strategy",
  "lsat-prep": "LSAT Prep",
  "mindset": "Mindset",
  "evaluate": "Evaluate",
  "weaken": "Weaken",
  "principle-questions": "Principle Questions",
  "motivation": "Motivation",
  "180-scorer": "180 Scorer",
  "rules": "Rules",
};

const getTagLabel = (tag: string) => TAG_LABELS[tag] || tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

const BlogPost = () => {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const [tocOpen, setTocOpen] = useState(false);

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog/posts', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      return response.json();
    },
    enabled: !!slug
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

  const processInlineMarkdown = (html: string): string => {
    return html
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  };

  const addHeadingIds = (html: string): string => {
    let counter = 0;
    return html.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
      const plainText = text.replace(/<[^>]*>/g, '');
      const id = `heading-${counter++}-${plainText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
      return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
    });
  };

  const extractToc = (html: string): TocEntry[] => {
    const entries: TocEntry[] = [];
    const regex = /<(h[23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/\1>/gi;
    let m;
    while ((m = regex.exec(html)) !== null) {
      entries.push({
        id: m[2],
        text: m[3].replace(/<[^>]*>/g, ''),
        level: parseInt(m[1][1]),
      });
    }
    return entries;
  };

  const processedContent = useMemo(() => {
    if (!post?.content) return '';
    let html = post.content;
    if (isHtml(html)) {
      html = processInlineMarkdown(html);
    }
    html = addHeadingIds(html);
    return html;
  }, [post?.content]);

  const toc = useMemo(() => extractToc(processedContent), [processedContent]);

  useSEO({
    title: post?.title,
    description: post?.meta_description ?? post?.snippet,
    ogTitle: post?.title,
    ogDescription: post?.meta_description ?? post?.snippet,
    ogImage: post?.featured_image || undefined,
    ogType: "article",
    articlePublishedTime: post?.date,
    articleAuthor: post?.author,
    articleTags: post?.tags,
  });

  if (!match) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main>
        {/* Breadcrumb bar */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-foreground/60">
              <Link href="/">
                <span className="hover:text-accent transition-colors cursor-pointer">Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/blog">
                <span className="hover:text-accent transition-colors cursor-pointer">Blog</span>
              </Link>
              {post && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-foreground/40 truncate max-w-[200px] md:max-w-md">{post.title}</span>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto animate-pulse">
              <div className="h-10 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/3 mb-10" />
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-muted rounded" style={{ width: `${90 - i * 8}%` }} />)}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <h3 className="text-red-800 font-heading font-semibold text-lg mb-2">Post Not Found</h3>
              <p className="text-red-600 text-sm mb-4 leading-relaxed">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/blog">
                <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Back to Blog
                </button>
              </Link>
            </div>
          </div>
        )}

        {post && (
          <>
            {/* Post Hero */}
            <section className="pt-10 pb-8 md:pt-14 md:pb-10" style={{ background: 'linear-gradient(180deg, hsl(210 40% 96.1%) 0%, hsl(0 0% 100%) 100%)' }}>
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent"
                      >
                        {getTagLabel(tag)}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="font-heading font-bold text-primary mb-5 leading-tight" style={{ fontSize: 'clamp(28px, 2rem + 1.2vw, 44px)', letterSpacing: '-0.02em' }}>
                    {post.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time>{formatDate(post.date)}</time>
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {post.readTime} min read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="container mx-auto px-4 -mt-2 mb-8">
                <div className="max-w-3xl mx-auto">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full rounded-2xl object-cover shadow-md"
                    style={{ maxHeight: '420px' }}
                  />
                </div>
              </div>
            )}

            {/* Content area */}
            <div className="container mx-auto px-4 pb-16">
              <div className="max-w-3xl mx-auto">
                {/* Table of Contents */}
                {toc.length > 2 && (
                  <div className="mb-10 bg-muted/40 rounded-xl border border-border/60 overflow-hidden">
                    <button
                      onClick={() => setTocOpen(!tocOpen)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/60 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-heading font-semibold text-primary text-sm">
                        <List className="w-4 h-4" />
                        Table of Contents
                      </span>
                      <ChevronRight className={`w-4 h-4 text-foreground/40 transition-transform duration-200 ${tocOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {tocOpen && (
                      <nav className="px-6 pb-5 pt-0">
                        <ol className="space-y-1.5">
                          {toc.map((entry) => (
                            <li key={entry.id}>
                              <a
                                href={`#${entry.id}`}
                                className={`block text-sm hover:text-accent transition-colors ${
                                  entry.level === 3 ? 'pl-5 text-foreground/50' : 'text-foreground/70 font-medium'
                                }`}
                              >
                                {entry.text}
                              </a>
                            </li>
                          ))}
                        </ol>
                      </nav>
                    )}
                  </div>
                )}

                {/* Article content */}
                <div className="blog-article-content">
                  {isHtml(post.content) ? (
                    <div
                      className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-primary prose-h2:text-[1.55rem] prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-[1.2rem] prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground prose-p:leading-[1.75] prose-strong:text-primary prose-a:text-accent prose-a:underline prose-a:underline-offset-2 prose-a:decoration-accent/40 hover:prose-a:decoration-accent prose-li:text-foreground prose-li:leading-[1.75] prose-blockquote:border-accent prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:text-foreground/80 prose-blockquote:not-italic prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-hr:border-border prose-img:rounded-xl prose-img:shadow-md"
                      dangerouslySetInnerHTML={{ __html: processedContent }}
                    />
                  ) : (
                    <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-primary prose-h2:text-[1.55rem] prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-[1.2rem] prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground prose-p:leading-[1.75] prose-strong:text-primary prose-a:text-accent prose-a:underline prose-a:underline-offset-2 prose-a:decoration-accent/40 hover:prose-a:decoration-accent prose-li:text-foreground prose-li:leading-[1.75] prose-blockquote:border-accent prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:text-foreground/80 prose-blockquote:not-italic prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-hr:border-border prose-img:rounded-xl prose-img:shadow-md">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* End of post CTA */}
                <div className="mt-14 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-10 border border-border/50">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-primary text-xl md:text-2xl mb-2">
                        Ready to Apply These Strategies?
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
                        Get a personalized study plan built around your strengths, weaknesses, and target score. Your first consultation is free.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => {
                          if ((window as any).Calendly) {
                            (window as any).Calendly.initPopupWidget({
                              url: 'https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=1b385f'
                            });
                          }
                        }}
                        className="inline-flex items-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-md whitespace-nowrap"
                      >
                        Book Free Consult
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back to blog */}
                <div className="mt-10 pt-8 border-t border-border">
                  <Link href="/blog">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer">
                      <ArrowLeft className="w-4 h-4" />
                      Back to All Articles
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
