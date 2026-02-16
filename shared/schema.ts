import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Profiles table for student/admin authentication with time tracking
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
  sessions_held: integer("sessions_held").default(0).notNull(),
  time_remaining: decimal("time_remaining", { precision: 4, scale: 1 }).default("0.0").notNull(),
  bonus_test_review_time: decimal("bonus_test_review_time", { precision: 4, scale: 1 }).default("0.0").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(profiles).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof profiles.$inferSelect;

// Sessions table for tracking tutoring sessions
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => profiles.id).notNull(),
  date: timestamp("date").notNull(),
  summary: text("summary").notNull(),
  duration: decimal("duration", { precision: 3, scale: 1 }).notNull(), // in hours
  video_link: text("video_link"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  user_id: true,
  date: true,
  summary: true,
  duration: true,
  video_link: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

// Time add-ons purchased by students
export const timeAddOns = pgTable("time_addons", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => profiles.id).notNull(),
  hours_added: decimal("hours_added", { precision: 4, scale: 1 }).notNull(),
  addon_type: varchar("addon_type", { length: 50 }).notNull(), // 'regular', 'bonus_test_review'
  price_paid: decimal("price_paid", { precision: 8, scale: 2 }),
  purchased_at: timestamp("purchased_at").defaultNow(),
});

export const insertTimeAddOnSchema = createInsertSchema(timeAddOns).pick({
  user_id: true,
  hours_added: true,
  addon_type: true,
  price_paid: true,
});

export type InsertTimeAddOn = z.infer<typeof insertTimeAddOnSchema>;
export type TimeAddOn = typeof timeAddOns.$inferSelect;

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  sessions: many(sessions),
  timeAddOns: many(timeAddOns),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(profiles, {
    fields: [sessions.user_id],
    references: [profiles.id],
  }),
}));

export const timeAddOnsRelations = relations(timeAddOns, ({ one }) => ({
  user: one(profiles, {
    fields: [timeAddOns.user_id],
    references: [profiles.id],
  }),
}));

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

// Blog posts table for CMS
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  featured_image: text("featured_image"),
  meta_description: text("meta_description"),
  tags: text("tags").notNull().default("[]"),
  author: text("author").notNull().default("Germaine Washington"),
  status: text("status").notNull().default("draft"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  published_at: timestamp("published_at"),
  scheduled_at: timestamp("scheduled_at"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  post_slug: text("post_slug").notNull(),
  author_name: text("author_name").notNull(),
  comment: text("comment").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  created_at: true,
});

export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;
export type BlogComment = typeof blogComments.$inferSelect;
