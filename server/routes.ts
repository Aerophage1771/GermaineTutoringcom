import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSubscriberSchema, 
  insertConsultationSchema,
  insertSessionSchema,
  insertProblemLogSchema,
  insertPracticeActivitySchema,
  insertTimeAddOnSchema,
  insertBlogPostSchema
} from "@shared/schema";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

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
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  content: z.string().min(1),
  excerpt: z.string().min(1).max(1000),
  meta_description: z.string().max(300).optional().nullable(),
  featured_image: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  author: z.string().min(1).max(200).optional().default("Germaine Washington"),
  status: z.enum(["draft", "published"]).optional().default("draft"),
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
    userId?: number;
    user?: {
      id: number;
      username: string;
      email: string;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
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
        email: user.email
      };

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
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
    
    try {
      const sessions = await storage.getUserSessions(req.session.userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
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

  // Problem log routes
  app.get("/api/dashboard/problem-log", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const problemLog = await storage.getUserProblemLog(req.session.userId);
      res.json(problemLog);
    } catch (error) {
      console.error("Error fetching problem log:", error);
      res.status(500).json({ message: "Failed to fetch problem log" });
    }
  });

  app.post("/api/dashboard/problem-log", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const validatedData = insertProblemLogSchema.parse({
        ...req.body,
        user_id: req.session.userId
      });
      const entry = await storage.createProblemLogEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating problem log entry:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request data" });
    }
  });

  app.put("/api/dashboard/problem-log/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updated = await storage.updateProblemLogEntry(id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating problem log entry:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request data" });
    }
  });

  app.delete("/api/dashboard/problem-log/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProblemLogEntry(id);
      res.json({ message: "Problem log entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting problem log entry:", error);
      res.status(500).json({ message: "Failed to delete problem log entry" });
    }
  });

  // Practice activities routes
  app.get("/api/dashboard/practice-activities", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const activities = await storage.getUserPracticeActivities(req.session.userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching practice activities:", error);
      res.status(500).json({ message: "Failed to fetch practice activities" });
    }
  });

  // LSAT Questions routes
  app.get("/api/lsat/random", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const count = parseInt(req.query.count as string) || 10;
      const sectionType = req.query.sectionType as string;
      const difficulty = req.query.difficulty ? parseInt(req.query.difficulty as string) : undefined;
      
      const questions = await storage.getRandomLSATQuestions(count, sectionType, difficulty);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching random LSAT questions:", error);
      res.status(500).json({ message: "Failed to fetch LSAT questions" });
    }
  });

  app.get("/api/lsat/prep-test/:prepTest", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const prepTest = parseInt(req.params.prepTest);
      const questions = await storage.getLSATQuestionsByTest(prepTest);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching prep test questions:", error);
      res.status(500).json({ message: "Failed to fetch prep test questions" });
    }
  });

  // Separate LR questions endpoint
  app.get("/api/lsat/lr-questions", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {};
      console.log("LR questions requested with filters:", filters);
      
      const questions = await storage.getLRQuestions({
        questionTypes: filters.questionTypes || [],
        skills: filters.skills || [],
        difficulty: filters.difficulty || [],
        prepTests: filters.prepTests || []
      });
      
      console.log("LR questions returned:", questions.length);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching LR questions:", error);
      res.status(500).json({ message: "Failed to fetch LR questions" });
    }
  });

  // Separate RC questions endpoint  
  app.get("/api/lsat/rc-questions", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {};
      console.log("RC questions requested with filters:", filters);
      
      const questions = await storage.getRCQuestions({
        passageCategories: filters.passageCategories || [],
        questionCategories: filters.questionCategories || [],
        difficulty: filters.difficulty || [],
        prepTests: filters.prepTests || []
      });
      
      console.log("RC questions returned:", questions.length);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching RC questions:", error);
      res.status(500).json({ message: "Failed to fetch RC questions" });
    }
  });

  // Legacy browse endpoint (keep for backward compatibility)
  app.get("/api/lsat/browse", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const mode = req.query.mode as string;
      const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {};
      console.log("Legacy browse called with mode:", mode, "filters:", filters);
      
      let questions;
      
      if (mode === 'lr') {
        // Use new optimized LR table
        questions = await storage.getLRQuestions({
          questionTypes: filters.questionTypes || [],
          skills: filters.skills || [],
          difficulty: filters.difficulty || [],
          prepTests: filters.prepTests || []
        });
      } else if (mode === 'rc') {
        // Use new optimized RC table
        questions = await storage.getRCQuestions({
          passageCategories: filters.passageCategories || [],
          questionCategories: filters.questionCategories || [],
          difficulty: filters.difficulty || [],
          prepTests: filters.prepTests || []
        });
      } else {
        // Default fallback to legacy method
        questions = await storage.getLSATQuestionsByType('Logical Reasoning', 50);
      }
      
      console.log("Legacy browse returning:", questions.length, "questions for mode:", mode);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching browse questions:", error);
      res.status(500).json({ message: "Failed to fetch browse questions" });
    }
  });

  app.get("/api/lsat/prep-test/:prepTest/section/:section", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const prepTest = parseInt(req.params.prepTest);
      const section = parseInt(req.params.section);
      const questions = await storage.getLSATQuestionsBySection(prepTest, section);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching section questions:", error);
      res.status(500).json({ message: "Failed to fetch section questions" });
    }
  });

  app.post("/api/dashboard/practice-activities", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const validatedData = insertPracticeActivitySchema.parse({
        ...req.body,
        user_id: req.session.userId
      });
      const activity = await storage.createPracticeActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating practice activity:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request data" });
    }
  });

  // Time add-ons routes
  app.get("/api/dashboard/time-addons", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const addons = await storage.getUserTimeAddOns(req.session.userId);
      res.json(addons);
    } catch (error) {
      console.error("Error fetching time add-ons:", error);
      res.status(500).json({ message: "Failed to fetch time add-ons" });
    }
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

  // Smart drill creation endpoint
  app.post('/api/practice/smart-drill', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const { type, difficulty, questionCount, includeFlagged, topic } = req.body;
      const userId = req.session.userId;

      let filters: any = {
        questionTypes: [],
        skills: [],
        difficulty: [],
        prepTests: []
      };

      // Apply difficulty filter if specified
      if (difficulty && difficulty !== 'mixed') {
        const difficultyMap = { easy: [1, 2], hard: [4, 5] };
        filters.difficulty = difficultyMap[difficulty as keyof typeof difficultyMap] || [];
      }

      // For topic-specific drills
      if (type === 'topic' && topic) {
        filters.questionTypes = [topic];
      }

      // Get questions based on type
      let questions;
      if (type === 'spaced-repetition') {
        // For spaced repetition, we'd typically get missed questions
        // For now, just get a random set
        questions = await storage.getLRQuestions(filters, 1000);
        questions = questions.slice(0, questionCount || 12);
      } else {
        // Smart practice or topic drill
        questions = await storage.getLRQuestions(filters, 1000);
        // Shuffle and take requested count
        questions = questions.sort(() => Math.random() - 0.5).slice(0, questionCount || 5);
      }

      // Create practice set
      const practiceSet = await storage.createPracticeSet({
        name: `${type === 'smart' ? 'Smart Practice' : type === 'topic' ? `${topic} Focus` : 'Spaced Repetition'} - ${new Date().toLocaleDateString()}`,
        type: 'lr',
        questionIds: questions.map(q => q.id),
        userId
      });

      res.json(practiceSet);
    } catch (error) {
      console.error('Error creating smart drill:', error);
      res.status(500).json({ message: 'Failed to create practice drill' });
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
      });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Admin blog routes (authenticated)
  app.get("/api/admin/blog/posts", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
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

  app.get("/api/admin/blog/posts/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
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

  app.post("/api/admin/blog/posts", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const validated = blogPostInputSchema.parse(req.body);
      const postData = {
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

  app.put("/api/admin/blog/posts/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
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

  app.delete("/api/admin/blog/posts/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      await storage.deleteBlogPost(parseInt(req.params.id));
      res.json({ message: "Post deleted" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Image upload for blog
  app.post("/api/admin/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }
      const url = `/uploads/${req.file.filename}`;
      res.json({ url });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Practice set routes
  app.get("/api/practice/sets", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const sets = await storage.getPracticeSets(req.session.userId);
      res.json(sets);
    } catch (error) {
      console.error("Error fetching practice sets:", error);
      res.status(500).json({ message: "Failed to fetch practice sets" });
    }
  });

  app.post("/api/practice/sets", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { name, type, questionIds } = req.body;
      
      if (!name || !type || !Array.isArray(questionIds) || questionIds.length === 0) {
        return res.status(400).json({ message: "Name, type, and questionIds are required" });
      }
      
      const set = await storage.createPracticeSet({
        name,
        type,
        questionIds,
        userId: req.session.userId
      });
      
      res.status(201).json(set);
    } catch (error) {
      console.error("Error creating practice set:", error);
      res.status(500).json({ message: "Failed to create practice set" });
    }
  });

  app.get("/api/practice/set/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { id } = req.params;
      const set = await storage.getPracticeSet(id, req.session.userId);
      
      if (!set) {
        return res.status(404).json({ message: "Practice set not found" });
      }
      
      res.json(set);
    } catch (error) {
      console.error("Error fetching practice set:", error);
      res.status(500).json({ message: "Failed to fetch practice set" });
    }
  });

  // Practice question routes with full question data
  app.get("/api/lsat/questions", async (req, res) => {
    try {
      const { type, filters, search, page = '1' } = req.query;
      
      const questions = await storage.getQuestionsWithDetails({
        type: type as 'lr' | 'rc',
        filters: filters ? JSON.parse(filters as string) : {},
        search: search as string,
        page: parseInt(page as string)
      });
      
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Practice activity tracking
  app.post("/api/practice/activity", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const validatedData = insertPracticeActivitySchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      
      const activity = await storage.logPracticeActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error logging practice activity:", error);
      res.status(500).json({ message: "Failed to log practice activity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
