import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Minus,
  Undo,
  Redo,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  Loader2,
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  meta_description: string | null;
  tags: string[];
  author: string;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  scheduled_at: string | null;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-foreground/70 hover:bg-muted hover:text-primary"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url }).run();
      } catch {
        alert("Failed to upload image");
      }
    };
    input.click();
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-border p-2 flex flex-wrap gap-1">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px bg-border mx-1" />

      <ToolbarButton
        onClick={addLink}
        active={editor.isActive("link")}
        title="Insert Link"
      >
        <Link2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} title="Insert Image">
        <ImagePlus className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}

function PostEditor({
  postId,
  onBack,
}: {
  postId: number | null;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [author, setAuthor] = useState("Germaine Washington");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = postId !== null;

  const { data: existingPost, isLoading: loadingPost } = useQuery<BlogPost>({
    queryKey: [`/api/admin/blog/posts/${postId}`],
    enabled: isEditing,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({ placeholder: "Start writing your blog post..." }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[400px] p-6 focus:outline-none prose-headings:font-heading prose-headings:text-primary",
      },
    },
  });

  useEffect(() => {
    if (existingPost && editor) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setSlugManuallyEdited(true);
      setExcerpt(existingPost.excerpt);
      setMetaDescription(existingPost.meta_description || "");
      setTagsInput(
        Array.isArray(existingPost.tags) ? existingPost.tags.join(", ") : ""
      );
      setFeaturedImage(existingPost.featured_image || "");
      setAuthor(existingPost.author);
      if (existingPost.scheduled_at) {
        const dt = new Date(existingPost.scheduled_at);
        setScheduledDate(dt.toISOString().split("T")[0]);
        setScheduledTime(dt.toTimeString().slice(0, 5));
      }
      editor.commands.setContent(existingPost.content);
    }
  }, [existingPost, editor]);

  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManuallyEdited]);

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
  };

  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFeaturedImage(data.url);
      toast({ title: "Image uploaded successfully" });
    } catch {
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploadingFeatured(false);
    }
  };

  const savePost = async (status: string) => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    if (!slug.trim()) {
      toast({ title: "Slug is required", variant: "destructive" });
      return;
    }

    if (status === "scheduled") {
      if (!scheduledDate || !scheduledTime) {
        toast({ title: "Please set a date and time for scheduling", variant: "destructive" });
        return;
      }
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (scheduledDateTime <= new Date()) {
        toast({ title: "Scheduled time must be in the future", variant: "destructive" });
        return;
      }
    }

    const content = editor?.getHTML() || "";
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    let scheduled_at: string | null = null;
    if (status === "scheduled" && scheduledDate && scheduledTime) {
      scheduled_at = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    }

    const postData = {
      title,
      slug,
      content,
      excerpt,
      meta_description: metaDescription,
      tags,
      author,
      status,
      featured_image: featuredImage || null,
      published_at: status === "published" ? new Date().toISOString() : (existingPost?.published_at || null),
      scheduled_at,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await apiRequest("PUT", `/api/admin/blog/posts/${postId}`, postData);
      } else {
        await apiRequest("POST", "/api/admin/blog/posts", postData);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
      toast({
        title: isEditing ? "Post updated" : "Post created",
        description:
          status === "published" ? "Post is now live" : status === "scheduled" ? "Post scheduled for publication" : "Saved as draft",
      });
      onBack();
    } catch (err: any) {
      toast({
        title: "Failed to save post",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isEditing && loadingPost) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => savePost("draft")}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save as Draft
          </button>
          <button
            onClick={() => savePost("scheduled")}
            disabled={saving || !scheduledDate || !scheduledTime}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
            title={!scheduledDate || !scheduledTime ? "Set a date and time below to schedule" : ""}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button
            onClick={() => savePost("published")}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-primary rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Publish Now
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
        <h2 className="font-heading font-bold text-primary text-2xl">
          {isEditing ? "Edit Post" : "New Post"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors text-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="post-url-slug"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors font-mono text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of the post..."
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="LSAT, Strategy, Tips"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Schedule Publication
            </label>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
              />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
              />
              {scheduledDate && scheduledTime && (
                <span className="text-sm text-blue-600 font-medium">
                  Will publish: {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                </span>
              )}
              {(scheduledDate || scheduledTime) && (
                <button
                  type="button"
                  onClick={() => { setScheduledDate(""); setScheduledTime(""); }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO meta description..."
              rows={2}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-y"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Featured Image
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFeatured}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
              >
                {uploadingFeatured ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Upload Image
              </button>
              {featuredImage && (
                <div className="flex items-center gap-3">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-16 h-16 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Content
          </label>
          <div className="border border-border rounded-lg overflow-hidden">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PostListing() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog/posts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/blog/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
      toast({ title: "Post deleted" });
      setDeleteConfirmId(null);
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to delete post",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({
      id,
      currentStatus,
    }: {
      id: number;
      currentStatus: string;
    }) => {
      const newStatus =
        currentStatus === "published" ? "draft" : "published";
      await apiRequest("PUT", `/api/admin/blog/posts/${id}`, {
        status: newStatus,
        published_at:
          newStatus === "published" ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
      toast({ title: "Post status updated" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update status",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading font-bold text-primary text-3xl">
            Blog Posts
          </h2>
          <p className="text-foreground/70 mt-1">
            Manage your blog content
          </p>
        </div>
        <button
          onClick={() => setLocation("/admin/blog/new")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-primary rounded-lg font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 animate-pulse"
            >
              <div className="h-6 bg-muted rounded w-1/3 mb-3" />
              <div className="h-4 bg-muted rounded w-2/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-red-800 font-semibold mb-2">
            Failed to Load Posts
          </h3>
          <p className="text-red-600 text-sm">
            Unable to fetch blog posts. Please try again later.
          </p>
        </div>
      )}

      {posts && posts.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-primary text-xl mb-2">
            No Posts Yet
          </h3>
          <p className="text-foreground/70 mb-6">
            Create your first blog post to get started.
          </p>
          <button
            onClick={() => setLocation("/admin/blog/new")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-primary rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create First Post
          </button>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-heading font-bold text-primary text-lg truncate">
                      {post.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : post.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status === "published" ? "Published" : post.status === "scheduled" ? "Scheduled" : "Draft"}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-foreground/70 text-sm mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-foreground/50">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.created_at)}
                    </span>
                    {post.status === "scheduled" && post.scheduled_at && (
                      <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                        <Calendar className="w-3 h-3" />
                        Publishes: {new Date(post.scheduled_at).toLocaleString()}
                      </span>
                    )}
                    <span>By {post.author}</span>
                    {post.tags &&
                      Array.isArray(post.tags) &&
                      post.tags.length > 0 && (
                        <span className="hidden sm:inline">
                          {post.tags.join(", ")}
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      toggleStatusMutation.mutate({
                        id: post.id,
                        currentStatus: post.status,
                      })
                    }
                    disabled={toggleStatusMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
                    title={
                      post.status === "published" ? "Unpublish" : "Publish Now"
                    }
                  >
                    {post.status === "published" ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Publish Now</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      setLocation(`/admin/blog/edit/${post.id}`)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(post.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>

              {deleteConfirmId === post.id && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <p className="text-red-800 text-sm font-medium">
                    Are you sure you want to delete "{post.title}"?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-white hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(post.id)}
                      disabled={deleteMutation.isPending}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const AdminBlog = () => {
  const [, setLocation] = useLocation();
  const [matchNew] = useRoute("/admin/blog/new");
  const [matchEdit, editParams] = useRoute("/admin/blog/edit/:id");

  const isEditorView = matchNew || matchEdit;
  const editId = matchEdit && editParams?.id ? parseInt(editParams.id) : null;

  const handleBack = useCallback(() => {
    setLocation("/admin/blog");
  }, [setLocation]);

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          {isEditorView ? (
            <PostEditor
              postId={editId}
              onBack={handleBack}
            />
          ) : (
            <PostListing />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminBlog;
