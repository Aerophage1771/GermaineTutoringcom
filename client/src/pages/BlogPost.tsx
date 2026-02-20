import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Clock, ArrowLeft, ArrowRight, ChevronRight, ChevronUp, User, List, Link2, MessageCircle, Send } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BlogComment } from "@shared/schema";
import { blogPosts } from "@/data/posts";

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

const ShareButtons = ({ title, compact }: { title: string; compact?: boolean }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btnClass = `w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
    compact
      ? 'bg-muted/60 text-foreground/60 hover:bg-accent/10 hover:text-accent'
      : 'bg-primary/10 text-primary hover:bg-accent hover:text-white'
  }`;

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'mt-5'}`}>
      {!compact && <span className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mr-1">Share</span>}
      <button onClick={handleTwitter} className={btnClass} aria-label="Share on Twitter/X" title="Share on X">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </button>
      <button onClick={handleFacebook} className={btnClass} aria-label="Share on Facebook" title="Share on Facebook">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </button>
      <button onClick={handleLinkedIn} className={btnClass} aria-label="Share on LinkedIn" title="Share on LinkedIn">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </button>
      <div className="relative">
        <button onClick={handleCopyLink} className={btnClass} aria-label="Copy link" title="Copy link">
          <Link2 className="w-4 h-4" />
        </button>
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-200">
            Copied!
          </span>
        )}
      </div>
    </div>
  );
};

const timeAgo = (dateStr: string | Date | null | undefined): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 30) return `${Math.floor(diffDay / 30)} months ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  if (diffHr > 0) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  return 'just now';
};

const BlogPost = () => {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const [tocOpen, setTocOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const { toast } = useToast();

  const post = blogPosts.find((p) => p.slug === slug);
  const isLoading = false;

  const { data: comments = [], isLoading: commentsLoading } = useQuery<BlogComment[]>({
    queryKey: ['/api/blog/posts', slug, 'comments'],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
    enabled: !!slug && !!post,
  });

  const commentMutation = useMutation({
    mutationFn: async (data: { author_name: string; comment: string }) => {
      const res = await apiRequest('POST', `/api/blog/posts/${slug}/comments`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts', slug, 'comments'] });
      setCommentName('');
      setCommentText('');
      toast({ title: "Comment posted!", description: "Your comment has been added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to post comment. Please try again.", variant: "destructive" });
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    commentMutation.mutate({ author_name: commentName.trim(), comment: commentText.trim() });
  };

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

  const baseUrl = "https://germainetutoring.com";
  const postUrl = post ? `${baseUrl}/blog/${post.slug}` : "";

  const combinedJsonLd = useMemo(() => {
    if (!post) return undefined;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.snippet,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "datePublished": post.date,
          "image": post.featured_image || `${baseUrl}/og-image.jpg`,
          "publisher": {
            "@type": "Organization",
            "name": "Germaine Tutoring",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": baseUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": `${baseUrl}/blog`
            }
          ]
        }
      ]
    };
  }, [post, postUrl]);

  if (post && combinedJsonLd) {
    (combinedJsonLd["@graph"] as any[])[1].itemListElement.push({
      "@type": "ListItem",
      "position": 3,
      "name": post.title,
      "item": postUrl
    });
  }

  useSEO({
    title: post?.title,
    description: post?.snippet,
    ogTitle: post?.title,
    ogDescription: post?.snippet,
    ogImage: post?.featured_image || `${baseUrl}/og-image.jpg`,
    ogUrl: postUrl,
    ogType: "article",
    twitterCard: "summary_large_image",
    articlePublishedTime: post?.date,
    articleAuthor: post?.author,
    articleTags: post?.tags,
    canonical: postUrl,
    jsonLd: combinedJsonLd,
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
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-foreground/60">
              <Link href="/home">
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
        {!post && (
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

                  {/* Share Buttons */}
                  <ShareButtons title={post.title} />
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
                    loading="lazy"
                    decoding="async"
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

                {/* Bottom Share Buttons */}
                <div className="mt-10 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground/50">Enjoyed this article? Share it:</span>
                    <ShareButtons title={post.title} compact />
                  </div>
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

                {/* Comments Section */}
                <div className="mt-14">
                  <h3 className="font-heading font-bold text-primary text-xl md:text-2xl mb-6 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    Comments {comments.length > 0 && `(${comments.length})`}
                  </h3>

                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mb-10 bg-muted/30 rounded-xl border border-border/60 p-6">
                    <div className="mb-4">
                      <label htmlFor="comment-name" className="block text-sm font-semibold text-foreground/70 mb-1.5">Name</label>
                      <input
                        id="comment-name"
                        type="text"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="comment-text" className="block text-sm font-semibold text-foreground/70 mb-1.5">Comment</label>
                      <textarea
                        id="comment-text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={4}
                        maxLength={2000}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-vertical"
                        required
                      />
                      <p className="text-xs text-foreground/40 mt-1">{commentText.length}/2000</p>
                    </div>
                    <button
                      type="submit"
                      disabled={commentMutation.isPending || !commentName.trim() || !commentText.trim()}
                      className="inline-flex items-center gap-2 bg-primary text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                    </button>
                  </form>

                  {/* Comments List */}
                  {commentsLoading ? (
                    <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="animate-pulse bg-muted/30 rounded-xl p-5">
                          <div className="h-4 bg-muted rounded w-1/4 mb-3" />
                          <div className="h-3 bg-muted rounded w-3/4" />
                        </div>
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-foreground/50 text-sm text-center py-8">No comments yet. Be the first to share your thoughts!</p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((c) => (
                        <div key={c.id} className="bg-muted/20 rounded-xl p-5 border border-border/40">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                              {c.author_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-sm text-primary">{c.author_name}</span>
                              <span className="text-xs text-foreground/40 ml-2">{timeAgo(c.created_at)}</span>
                            </div>
                          </div>
                          <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{c.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-primary text-white shadow-lg hover:bg-accent transition-all duration-300 flex items-center justify-center hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default BlogPost;
