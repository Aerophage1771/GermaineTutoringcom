import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, insertConsultationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
