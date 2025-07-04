import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSubscriberSchema, 
  insertConsultationSchema,
  insertSessionSchema,
  insertProblemLogSchema,
  insertPracticeActivitySchema,
  insertTimeAddOnSchema
} from "@shared/schema";
import { getAllPosts, getPostBySlug } from "./blog";

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

  // Blog routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await getPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
