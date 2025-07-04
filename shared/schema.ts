import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for student authentication with time tracking
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  sessions_held: integer("sessions_held").default(0).notNull(),
  time_remaining: decimal("time_remaining", { precision: 4, scale: 1 }).default("0.0").notNull(),
  bonus_test_review_time: decimal("bonus_test_review_time", { precision: 4, scale: 1 }).default("0.0").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Sessions table for tracking tutoring sessions
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
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

// Problem log entries
export const problemLog = pgTable("problem_log", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  prep_test: varchar("prep_test", { length: 50 }).notNull(),
  section: varchar("section", { length: 50 }).notNull(),
  question: varchar("question", { length: 50 }).notNull(),
  correct_reasoning: text("correct_reasoning"),
  student_flaw: text("student_flaw"),
  rule_for_future: text("rule_for_future"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertProblemLogSchema = createInsertSchema(problemLog).pick({
  user_id: true,
  prep_test: true,
  section: true,
  question: true,
  correct_reasoning: true,
  student_flaw: true,
  rule_for_future: true,
});

export type InsertProblemLog = z.infer<typeof insertProblemLogSchema>;
export type ProblemLog = typeof problemLog.$inferSelect;

// Practice activities and test results
export const practiceActivities = pgTable("practice_activities", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  activity_type: varchar("activity_type", { length: 50 }).notNull(), // 'full_test', 'question_set', 'lr_practice', 'rc_practice'
  test_name: varchar("test_name", { length: 100 }),
  section_type: varchar("section_type", { length: 50 }), // 'LR', 'RC', 'LG'
  questions_attempted: integer("questions_attempted").notNull(),
  questions_correct: integer("questions_correct").notNull(),
  time_spent: integer("time_spent").notNull(), // in minutes
  score_percentage: decimal("score_percentage", { precision: 5, scale: 2 }),
  answers_data: text("answers_data"), // JSON string of detailed answers
  filters_used: text("filters_used"), // JSON string of filters applied
  completed_at: timestamp("completed_at").defaultNow(),
});

export const insertPracticeActivitySchema = createInsertSchema(practiceActivities).pick({
  user_id: true,
  activity_type: true,
  test_name: true,
  section_type: true,
  questions_attempted: true,
  questions_correct: true,
  time_spent: true,
  score_percentage: true,
  answers_data: true,
  filters_used: true,
});

export type InsertPracticeActivity = z.infer<typeof insertPracticeActivitySchema>;
export type PracticeActivity = typeof practiceActivities.$inferSelect;

// Time add-ons purchased by students
export const timeAddOns = pgTable("time_addons", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
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
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  problemLog: many(problemLog),
  practiceActivities: many(practiceActivities),
  timeAddOns: many(timeAddOns),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.user_id],
    references: [users.id],
  }),
}));

export const problemLogRelations = relations(problemLog, ({ one }) => ({
  user: one(users, {
    fields: [problemLog.user_id],
    references: [users.id],
  }),
}));

export const practiceActivitiesRelations = relations(practiceActivities, ({ one }) => ({
  user: one(users, {
    fields: [practiceActivities.user_id],
    references: [users.id],
  }),
}));

export const timeAddOnsRelations = relations(timeAddOns, ({ one }) => ({
  user: one(users, {
    fields: [timeAddOns.user_id],
    references: [users.id],
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
