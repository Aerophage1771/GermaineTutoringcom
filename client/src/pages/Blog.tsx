import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles, Filter, Search, TrendingUp, Mail, GraduationCap } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
  author: string;
  featured_image?: string | null;
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

const CATEGORY_FILTERS = [
  { key: "all", label: "All Posts" },
  { key: "logical-reasoning", label: "Logical Reasoning" },
  { key: "reading-comprehension", label: "Reading Comprehension" },
  { key: "strategy", label: "Strategy" },
  { key: "mindset", label: "Mindset" },
];

const THUMBNAIL_COLORS = [
  { bg: "from-primary/90 to-primary/70", icon: "text-white/80" },
  { bg: "from-accent/90 to-accent/70", icon: "text-white/80" },
  { bg: "from-primary/80 to-accent/60", icon: "text-white/80" },
  { bg: "from-[#0f766e]/90 to-[#0f766e]/70", icon: "text-white/80" },
  { bg: "from-[#4c1d95]/90 to-[#4c1d95]/70", icon: "text-white/80" },
  { bg: "from-[#b91c1c]/80 to-[#b91c1c]/60", icon: "text-white/80" },
];

const getTagLabel = (tag: string) => TAG_LABELS[tag] || tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const getPrimaryCategory = (tags: string[]) => {
  const priority = ["logical-reasoning", "reading-comprehension", "strategy", "mindset"];
  for (const p of priority) {
    if (tags.includes(p)) return p;
  }
  return tags[0] || "lsat-prep";
};

const Blog = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [ckEmail, setCkEmail] = useState("");
  const [ckStatus, setCkStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (!document.querySelector('script[src="https://f.convertkit.com/ckjs/ck.5.js"]')) {
      const script = document.createElement("script");
      script.src = "https://f.convertkit.com/ckjs/ck.5.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useSEO({
    title: "LSAT Strategy Blog",
    description: "Practical, systems-based LSAT techniques from a perfect 180 scorer. Tips for Logical Reasoning, Reading Comprehension, and more.",
    ogType: "website",
  });

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

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let result = posts;
    if (activeFilter !== "all") {
      result = result.filter(p => p.tags.includes(activeFilter));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.snippet.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeFilter, searchQuery]);

  const popularPosts = useMemo(() => {
    if (!posts) return [];
    return posts.slice(0, 4);
  }, [posts]);

  const showFeatured = activeFilter === "all";
  const featuredPost = showFeatured ? posts?.[0] : null;
  const regularPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(210 40% 96.1%) 0%, hsl(0 0% 100%) 100%)' }}>
        <div className="container mx-auto px-4 pt-16 pb-8 md:pt-20 md:pb-10">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 md:gap-10 items-center max-w-4xl mx-auto">
            {/* Left: Title + value prop + CTA */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">From a Perfect 180 Scorer</span>
              </div>
              <h1 className="font-heading font-bold text-primary text-4xl md:text-5xl lg:text-[3.25rem] mb-3 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                LSAT Strategy Blog
              </h1>
              <p className="text-foreground/80 text-lg md:text-xl leading-relaxed mb-5 max-w-xl">
                Practical, systems-based techniques you can apply in your next timed section — from someone who's mastered every question type.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    if (window.Calendly) {
                      window.Calendly.initPopupWidget({
                        url: 'https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=1b385f'
                      });
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-md"
                >
                  Book a Free Consult
                </button>
                <Link href="/methodology" className="inline-flex items-center gap-2 bg-white text-foreground font-semibold py-3 px-6 rounded-xl border border-border hover:border-primary/30 transition-colors no-underline">
                  How My Approach Works
                </Link>
              </div>
            </div>

            {/* Right: Featured post card */}
            {featuredPost && (
              <aside>
                <p className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Article
                </p>
                <Link href={`/blog/${featuredPost.slug}`} className="group block bg-white rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer no-underline">
                    <div className={`w-full h-28 rounded-xl bg-gradient-to-br ${THUMBNAIL_COLORS[0].bg} flex items-center justify-center mb-4`}>
                      <BookOpen className={`w-10 h-10 ${THUMBNAIL_COLORS[0].icon}`} />
                    </div>
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent mb-3">
                      {getTagLabel(getPrimaryCategory(featuredPost.tags))}
                    </span>
                    <h2 className="font-heading font-bold text-primary text-xl mb-2 group-hover:text-accent transition-colors leading-snug">
                      {featuredPost.title}
                    </h2>
                    <p className="text-sm text-foreground/60 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(featuredPost.date)}</span>
                      {featuredPost.readTime && (
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featuredPost.readTime} min read</span>
                      )}
                    </p>
                </Link>
              </aside>
            )}
          </div>
        </div>
      </section>

      <main className="py-10 md:py-14">
        <div className="container mx-auto px-4">

          <div className="grid lg:grid-cols-[1fr_300px] gap-10">

            {/* Main Content Area */}
            <div>
              {/* Category Filters */}
              <div className="flex items-center gap-1 pb-6 overflow-x-auto no-scrollbar">
                <Filter className="w-4 h-4 text-foreground/40 mr-2 flex-shrink-0" />
                {CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveFilter(cat.key)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                      activeFilter === cat.key
                        ? "bg-primary text-white shadow-sm"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
                      <div className="h-44 bg-muted" />
                      <div className="p-6">
                        <div className="h-4 bg-muted rounded w-24 mb-4" />
                        <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                        <div className="h-4 bg-muted rounded w-full mb-2" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                    <h3 className="text-red-800 font-heading font-semibold text-lg mb-2">Unable to Load Posts</h3>
                    <p className="text-red-600 text-sm leading-relaxed">
                      We're having trouble loading the blog posts. Please try again later.
                    </p>
                  </div>
                </div>
              )}

              {/* Post Cards Grid */}
              {regularPosts.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2">
                  {regularPosts.map((post, index) => (
                    <article
                      key={post.slug}
                      className="group bg-white rounded-2xl border border-border overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-primary/25"
                      style={{ transform: 'translateY(0)', transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <div className={`w-full h-44 bg-gradient-to-br ${THUMBNAIL_COLORS[(index + 1) % THUMBNAIL_COLORS.length].bg} flex items-center justify-center cursor-pointer relative overflow-hidden`}>
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <BookOpen className={`w-14 h-14 ${THUMBNAIL_COLORS[(index + 1) % THUMBNAIL_COLORS.length].icon} opacity-60`} />
                          )}
                        </div>
                      </Link>

                      <div className="p-6">
                        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent mb-3">
                          {getTagLabel(getPrimaryCategory(post.tags))}
                        </span>

                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="font-heading font-bold text-primary text-lg mb-2.5 leading-snug group-hover:text-accent transition-colors cursor-pointer line-clamp-2">
                            {post.title}
                          </h2>
                        </Link>

                        <p className="text-foreground/70 text-sm leading-relaxed mb-4 line-clamp-3">
                          {post.snippet}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border/60">
                          <div className="flex items-center gap-3 text-xs text-foreground/50">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(post.date)}
                            </span>
                            {post.readTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {post.readTime} min
                              </span>
                            )}
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer">
                              Read
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Empty filtered state */}
              {posts && filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <Filter className="w-10 h-10 text-foreground/20 mx-auto mb-4" />
                    <h3 className="font-heading text-foreground font-semibold text-lg mb-2">No Posts Found</h3>
                    <p className="text-foreground/60 text-sm leading-relaxed mb-4">
                      {searchQuery ? "Try a different search term or clear your search." : "Try selecting a different category or view all posts."}
                    </p>
                    <button
                      onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
                      className="text-accent font-semibold text-sm hover:text-accent/80 transition-colors"
                    >
                      View All Posts
                    </button>
                  </div>
                </div>
              )}

              {/* Mid-page CTA */}
              {posts && posts.length > 0 && (
                <div className="mt-16 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 text-center border border-border/50">
                  <h3 className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
                    Want a Personalized Study Plan?
                  </h3>
                  <p className="text-foreground/70 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
                    Schedule a free consultation and get a tailored strategy based on your current score, target, and timeline.
                  </p>
                  <button
                    onClick={() => {
                      if (window.Calendly) {
                        window.Calendly.initPopupWidget({
                          url: 'https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=1b385f'
                        });
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors shadow-md"
                  >
                    Book a Free Consultation
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-16 lg:self-start">

              {/* Author Branding */}
              <div className="bg-white rounded-2xl border border-border p-6 text-center">
                <img
                  src="/germaine_photo.webp"
                  alt="Germaine Washington"
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-primary/20"
                />
                <h3 className="font-heading font-bold text-primary text-sm mb-1">Germaine Washington</h3>
                <p className="text-xs text-accent font-semibold mb-2">180 LSAT Scorer</p>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Every article on this blog is written by Germaine — drawing from years of tutoring experience and a perfect score.
                </p>
              </div>

              {/* Search */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <h4 className="font-heading font-bold text-primary text-sm mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4 text-accent" />
                  Search Articles
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or topic..."
                    className="w-full text-sm border border-border rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-colors bg-muted/30 placeholder:text-foreground/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Popular Posts */}
              {popularPosts.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-5">
                  <h4 className="font-heading font-bold text-primary text-sm mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    Popular Articles
                  </h4>
                  <div className="space-y-3">
                    {popularPosts.map((post, i) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex items-start gap-3 no-underline">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-foreground/80 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Signup — ConvertKit */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-border/50 p-5">
                <h4 className="font-heading font-bold text-primary text-sm mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  Get LSAT Tips by Email
                </h4>
                <p className="text-xs text-foreground/60 mb-3 leading-relaxed">
                  New strategies and articles delivered to your inbox. No spam.
                </p>
                {ckStatus === "success" ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-800 text-sm font-semibold mb-0.5">You're in!</p>
                    <p className="text-green-700 text-xs">Check your email to confirm your subscription.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!ckEmail.trim()) return;
                      setCkStatus("submitting");
                      try {
                        const formData = new FormData();
                        formData.append("email_address", ckEmail.trim());
                        await fetch("https://app.kit.com/forms/9078575/subscriptions", {
                          method: "POST",
                          body: formData,
                          mode: "no-cors",
                        });
                        setCkStatus("success");
                      } catch {
                        setCkStatus("error");
                      }
                    }}
                    className="space-y-2"
                  >
                    <input
                      type="email"
                      value={ckEmail}
                      onChange={(e) => setCkEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-colors bg-white placeholder:text-foreground/40"
                    />
                    {ckStatus === "error" && (
                      <p className="text-red-600 text-xs">Something went wrong. Please try again.</p>
                    )}
                    <button
                      type="submit"
                      disabled={ckStatus === "submitting"}
                      className="w-full bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {ckStatus === "submitting" ? "Subscribing..." : "Subscribe"}
                    </button>
                  </form>
                )}
              </div>

              {/* Quick Link to Tutoring */}
              <Link href="/programs" className="group block bg-white rounded-2xl border border-border p-5 hover:border-accent/40 hover:shadow-md transition-all no-underline">
                <h4 className="font-heading font-bold text-primary text-sm mb-1.5 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-accent" />
                  Ready for 1-on-1 Tutoring?
                </h4>
                <p className="text-xs text-foreground/60 leading-relaxed mb-3">
                  Get a personalized study plan and guided practice from a 180 scorer.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:text-accent/80 transition-colors">
                  View Programs
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
