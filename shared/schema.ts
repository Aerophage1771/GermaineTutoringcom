import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for student authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Subscribers table for email sign-ups
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  name: true,
  email: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Consultations table for booking requests
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  current_score: text("current_score"),
  goal_score: text("goal_score").notNull(),
  test_date: text("test_date"),
  created_at: timestamp("created_at").defaultNow(),
  contacted: boolean("contacted").default(false),
});

export const insertConsultationSchema = createInsertSchema(consultations)
  .pick({
    name: true,
    email: true,
    phone: true,
    current_score: true,
    goal_score: true,
    test_date: true,
  })
  .transform((data) => ({
    ...data,
    // Ensure these fields are properly typed
    current_score: data.current_score || undefined,
    test_date: data.test_date || undefined,
  }));

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
