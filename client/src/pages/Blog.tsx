import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
  author: string;
}

const Blog = () => {
  const { data: posts, isLoading, error } = useQuery<BlogPostMeta[]>({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-heading font-bold text-primary text-4xl md:text-5xl mb-6">
              LSAT Strategy Blog
            </h1>
            <p className="text-foreground text-lg leading-relaxed">
              Insights, strategies, and proven techniques from a perfect scorer to help you achieve your LSAT goals.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-red-800 font-semibold mb-2">Unable to Load Posts</h3>
                <p className="text-red-600 text-sm">
                  We're having trouble loading the blog posts. Please try again later.
                </p>
              </div>
            </div>
          )}

          {/* Blog Posts Grid */}
          {posts && posts.length > 0 && (
            <div className="grid gap-8 md:gap-12">
              {posts.map((post) => (
                <article key={post.slug} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="mb-4">
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3 hover:text-accent transition-colors cursor-pointer">
                            {post.title}
                          </h2>
                        </Link>
                        <div className="flex items-center text-foreground/70 text-sm mb-3">
                          <span>By {post.author}</span>
                          <span className="mx-2">•</span>
                          <time>{formatDate(post.date)}</time>
                        </div>
                      </div>
                      
                      <p className="text-foreground leading-relaxed mb-6 text-lg">
                        {post.snippet}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-muted/50 text-primary px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <button className="inline-flex items-center text-accent hover:text-accent/80 font-semibold transition-colors">
                          Read More
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {posts && posts.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-foreground font-semibold mb-2">No Posts Yet</h3>
                <p className="text-foreground/70">
                  Check back soon for new LSAT strategy insights and tips.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;