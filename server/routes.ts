import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSubscriberSchema, 
  insertConsultationSchema,
  insertSessionSchema,
  insertTimeAddOnSchema,
  insertBlogPostSchema,
  insertBlogCommentSchema
} from "@shared/schema";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import bcrypt from "bcrypt";
import sharp from "sharp";

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'u', 's', 'hr']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'width', 'height'],
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'data'],
};

const blogPostInputSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(200).transform(s => s.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')).pipe(z.string().min(1).regex(/^[a-z0-9-]+$/)),
  content: z.string().min(1),
  excerpt: z.string().min(1).max(1000),
  meta_description: z.string().max(300).optional().nullable(),
  featured_image: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  author: z.string().min(1).max(200).optional().default("Germaine Washington"),
  status: z.enum(["draft", "published", "scheduled"]).optional().default("draft"),
  scheduled_at: z.string().optional().nullable(),
});

const uploadDir = path.join(process.cwd(), "public", "uploads");
fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

// Extend the session interface to include user information
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const uuidParamSchema = z.string().uuid();

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session.userId || !req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.getUserByUsername(email);
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await storage.validatePassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId || !req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      // Get fresh user data with updated counters
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          sessions_held: user.sessions_held,
          time_remaining: parseFloat(user.time_remaining),
          bonus_test_review_time: parseFloat(user.bonus_test_review_time)
        }
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard data routes
  app.get("/api/dashboard/sessions", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    return res.json([]);
  });

  app.post("/api/dashboard/sessions", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const validatedData = insertSessionSchema.parse({
        ...req.body,
        user_id: req.session.userId
      });
      const session = await storage.createSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request data" });
    }
  });

  // Time add-ons routes
  app.get("/api/dashboard/time-addons", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    return res.json([]);
  });

  app.post("/api/dashboard/time-addons", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const validatedData = insertTimeAddOnSchema.parse({
        ...req.body,
        user_id: req.session.userId
      });
      const addon = await storage.createTimeAddOn(validatedData);
      
      // Update user's time balance
      const user = await storage.getUser(req.session.userId);
      if (user) {
        const timeField = addon.addon_type === 'bonus_test_review' ? 'bonus_test_review_time' : 'time_remaining';
        const currentTime = parseFloat(user[timeField]);
        const newTime = currentTime + parseFloat(addon.hours_added);
        
        await storage.updateUser(req.session.userId, {
          [timeField]: newTime.toString()
        });
      }
      
      res.status(201).json(addon);
    } catch (error) {
      console.error("Error creating time add-on:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request data" });
    }
  });

  // Email subscription route
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(validatedData);
      res.status(201).json({
        message: "Successfully subscribed",
        subscriber
      });
    } catch (error) {
      console.error("Subscribe error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Invalid request data" 
      });
    }
  });

  // Consultation request route
  app.post("/api/consultation", async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(validatedData);
      res.status(201).json({
        message: "Consultation request received",
        consultation
      });
    } catch (error) {
      console.error("Consultation request error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Invalid request data" 
      });
    }
  });

  // Public blog routes (database-backed)
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(false);
      res.json(posts.map(p => ({
        ...p,
        tags: JSON.parse(p.tags || "[]"),
        date: p.published_at || p.created_at,
        snippet: p.excerpt,
        readTime: Math.max(1, Math.ceil((p.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0) / 250)),
      })));
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({
        ...post,
        tags: JSON.parse(post.tags || "[]"),
        date: post.published_at || post.created_at,
        snippet: post.excerpt,
        readTime: Math.max(1, Math.ceil((post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0) / 250)),
      });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/posts/:slug/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByPostSlug(req.params.slug);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/blog/posts/:slug/comments", async (req, res) => {
    try {
      const commentInputSchema = z.object({
        author_name: z.string().min(1),
        comment: z.string().min(1).max(2000),
      });
      const validated = commentInputSchema.parse(req.body);
      const comment = await storage.createComment({
        post_slug: req.params.slug,
        author_name: validated.author_name,
        comment: validated.comment,
      });
      res.status(201).json(comment);
    } catch (error: any) {
      if (error?.name === "ZodError") {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Admin blog routes (authenticated)
  app.get("/api/admin/blog/posts", requireAdmin, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(true);
      res.json(posts.map(p => ({
        ...p,
        tags: JSON.parse(p.tags || "[]"),
      })));
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/admin/blog/posts/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.getBlogPostById(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ ...post, tags: JSON.parse(post.tags || "[]") });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog/posts", requireAdmin, async (req, res) => {
    try {
      const validated = blogPostInputSchema.parse(req.body);
      const postData: any = {
        title: validated.title,
        slug: validated.slug,
        content: sanitizeHtml(validated.content, sanitizeOptions),
        excerpt: validated.excerpt,
        meta_description: validated.meta_description || null,
        featured_image: validated.featured_image || null,
        tags: JSON.stringify(validated.tags),
        author: validated.author,
        status: validated.status,
        published_at: validated.status === "published" ? new Date() : null,
        scheduled_at: validated.status === "scheduled" && req.body.scheduled_at ? new Date(req.body.scheduled_at) : null,
      };
      const post = await storage.createBlogPost(postData);
      res.status(201).json({ ...post, tags: JSON.parse(post.tags || "[]") });
    } catch (error: any) {
      if (error?.name === "ZodError") {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/posts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getBlogPostById(id);
      if (!existing) {
        return res.status(404).json({ message: "Post not found" });
      }
      const validated = blogPostInputSchema.partial().parse(req.body);
      const updates: any = {};
      if (validated.title !== undefined) updates.title = validated.title;
      if (validated.slug !== undefined) updates.slug = validated.slug;
      if (validated.content !== undefined) updates.content = sanitizeHtml(validated.content, sanitizeOptions);
      if (validated.excerpt !== undefined) updates.excerpt = validated.excerpt;
      if (validated.meta_description !== undefined) updates.meta_description = validated.meta_description;
      if (validated.featured_image !== undefined) updates.featured_image = validated.featured_image;
      if (validated.tags !== undefined) updates.tags = JSON.stringify(validated.tags);
      if (validated.author !== undefined) updates.author = validated.author;
      if (validated.status !== undefined) {
        updates.status = validated.status;
        if (validated.status === "published" && existing.status !== "published") {
          updates.published_at = new Date();
        }
        if (validated.status === "scheduled" && req.body.scheduled_at) {
          updates.scheduled_at = new Date(req.body.scheduled_at);
        }
        if (validated.status !== "scheduled") {
          updates.scheduled_at = null;
        }
      }
      const post = await storage.updateBlogPost(id, updates);
      res.json({ ...post, tags: JSON.parse(post.tags || "[]") });
    } catch (error: any) {
      if (error?.name === "ZodError") {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/posts/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteBlogPost(parseInt(req.params.id));
      res.json({ message: "Post deleted" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Image upload for blog (with compression)
  app.post("/api/admin/upload", requireAdmin, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }

      const originalPath = req.file.path;
      const webpFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
      const webpPath = path.join(uploadDir, webpFilename);

      await sharp(originalPath)
        .resize(1200, 800, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(webpPath);

      await fs.unlink(originalPath).catch(() => {});

      const url = `/uploads/${webpFilename}`;
      res.json({ url });
    } catch (error) {
      console.error("Error uploading image:", error);
      if (req.file) {
        const url = `/uploads/${req.file.filename}`;
        res.json({ url });
      } else {
        res.status(500).json({ message: "Failed to upload image" });
      }
    }
  });

  // Admin: Get all students
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const safeUsers = allUsers.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        sessions_held: u.sessions_held,
        time_remaining: u.time_remaining,
        bonus_test_review_time: u.bonus_test_review_time,
        created_at: u.created_at,
      }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin: Update student
  app.put("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      if (!uuidParamSchema.safeParse(id).success) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const { username, email, sessions_held, time_remaining, bonus_test_review_time, role } = req.body;
      const updates: any = {};
      if (username !== undefined) updates.username = username;
      if (email !== undefined) updates.email = email;
      if (sessions_held !== undefined) updates.sessions_held = sessions_held;
      if (time_remaining !== undefined) updates.time_remaining = time_remaining;
      if (bonus_test_review_time !== undefined) updates.bonus_test_review_time = bonus_test_review_time;
      if (role !== undefined) updates.role = role;
      const user = await storage.updateUser(id, updates);
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        sessions_held: user.sessions_held,
        time_remaining: user.time_remaining,
        bonus_test_review_time: user.bonus_test_review_time,
        created_at: user.created_at,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Admin: Reset student password
  app.put("/api/admin/users/:id/password", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      if (!uuidParamSchema.safeParse(id).success) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const { password } = req.body;
      if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await storage.updateUserPassword(id, hashedPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // Admin: Delete student
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      if (!uuidParamSchema.safeParse(id).success) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      await storage.deleteUser(id);
      res.json({ message: "User deleted" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Admin: Get sessions for a user
  app.get("/api/admin/users/:id/sessions", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      if (!uuidParamSchema.safeParse(id).success) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const sessions = await storage.getSessionsByUserId(id);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Admin: Create session for a user
  app.post("/api/admin/sessions", requireAdmin, async (req, res) => {
    try {
      const session = await storage.createSession(req.body);
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Admin: Update a session
  app.put("/api/admin/sessions/:id", requireAdmin, async (req, res) => {
    try {
      const session = await storage.updateSession(parseInt(req.params.id), req.body);
      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Admin: Delete a session
  app.delete("/api/admin/sessions/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteSession(parseInt(req.params.id));
      res.json({ message: "Session deleted" });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: "Failed to delete session" });
    }
  });

  setInterval(async () => {
    try {
      const duePosts = await storage.getScheduledPostsDue();
      for (const post of duePosts) {
        await storage.publishScheduledPost(post.id);
        console.log(`Auto-published scheduled post: "${post.title}" (id: ${post.id})`);
      }
    } catch (error) {
      console.error("Error checking scheduled posts:", error);
    }
  }, 60000);

  const httpServer = createServer(app);
  return httpServer;
}
