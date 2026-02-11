import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
}

const BlogPost = () => {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

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

  if (!match) {
    return null;
  }

  const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

  const processInlineMarkdown = (html: string): string => {
    return html
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link href="/blog">
              <button className="inline-flex items-center text-accent hover:text-accent/80 font-medium transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </button>
            </Link>
          </div>

          {isLoading && (
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-12 bg-muted rounded w-3/4 mb-6"></div>
                <div className="h-4 bg-muted rounded w-1/3 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-4xl mx-auto text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-red-800 font-semibold mb-2">Post Not Found</h3>
                <p className="text-red-600 text-sm mb-4">
                  The blog post you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/blog">
                  <button className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition-colors">
                    Back to Blog
                  </button>
                </Link>
              </div>
            </div>
          )}

          {post && (
            <article className="max-w-4xl mx-auto">
              <header className="mb-12">
                {post.featured_image && (
                  <div className="mb-8 rounded-xl overflow-hidden">
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-64 md:h-96 object-cover"
                    />
                  </div>
                )}
                <h1 className="font-heading font-bold text-primary text-4xl md:text-5xl mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-foreground/70 mb-6">
                  <div className="flex items-center">
                    <span>By {post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <time>{formatDate(post.date)}</time>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-muted/50 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
                {isHtml(post.content) ? (
                  <div 
                    className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-primary prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-foreground prose-blockquote:border-accent prose-blockquote:text-foreground/80"
                    dangerouslySetInnerHTML={{ __html: processInlineMarkdown(post.content) }}
                  />
                ) : (
                  <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-primary prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-foreground prose-blockquote:border-accent prose-blockquote:text-foreground/80">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              <div className="mt-12 bg-muted/30 rounded-xl p-8 text-center">
                <h3 className="font-heading font-bold text-primary text-2xl mb-4">
                  Ready to Transform Your LSAT Score?
                </h3>
                <p className="text-foreground mb-6 leading-relaxed">
                  Schedule a consultation to discuss your personalized strategy and achieve your target score.
                </p>
                <button 
                  onClick={() => {
                    if ((window as any).Calendly) {
                      (window as any).Calendly.initPopupWidget({
                        url: 'https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=1b385f'
                      });
                    }
                  }}
                  className="bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Schedule Your Consultation
                </button>
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
