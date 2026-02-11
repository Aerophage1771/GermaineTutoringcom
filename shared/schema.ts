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

// Practice sets for organized question practice
export const practiceSets = pgTable("practice_sets", {
  id: text("id").primaryKey(), // UUID string
  user_id: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'lr' or 'rc'
  question_ids: text("question_ids").notNull(), // JSON array of question IDs
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertPracticeSetSchema = createInsertSchema(practiceSets).pick({
  id: true,
  user_id: true,
  name: true,
  type: true,
  question_ids: true,
});

export type InsertPracticeSet = z.infer<typeof insertPracticeSetSchema>;
export type PracticeSet = typeof practiceSets.$inferSelect;

// Enhanced question details table for practice mode
export const questionDetails = pgTable("question_details", {
  id: serial("id").primaryKey(),
  question_id: text("question_id").notNull().unique(),
  question_text: text("question_text").notNull(),
  answer_choices: text("answer_choices").notNull(), // JSON object with A,B,C,D,E
  correct_answer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  passage_text: text("passage_text"), // For RC questions
  skills: text("skills"),
  question_type: text("question_type"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertQuestionDetailsSchema = createInsertSchema(questionDetails).pick({
  question_id: true,
  question_text: true,
  answer_choices: true,
  correct_answer: true,
  explanation: true,
  passage_text: true,
  skills: true,
  question_type: true,
});

export type InsertQuestionDetails = z.infer<typeof insertQuestionDetailsSchema>;
export type QuestionDetails = typeof questionDetails.$inferSelect;

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

// LSAT Questions metadata table
export const lsatQuestions = pgTable("lsat_questions", {
  id: serial("id").primaryKey(),
  prep_test_number: integer("prep_test_number").notNull(),
  section_number: integer("section_number").notNull(),
  section_type: text("section_type").notNull(), // "Reading Comprehension" or "Logical Reasoning"
  question_number_in_section: integer("question_number_in_section"),
  question_id: text("question_id").notNull().unique(),
  question_difficulty: integer("question_difficulty"), // 1-5
  question_50_percent_score: decimal("question_50_percent_score", { precision: 6, scale: 2 }),
  lr_question_type: text("lr_question_type"), // For Logical Reasoning questions
  lr_skills: text("lr_skills"), // For Logical Reasoning questions  
  rc_passage_id: text("rc_passage_id"), // For Reading Comprehension questions
  rc_passage_number_in_section: integer("rc_passage_number_in_section"),
  rc_passage_difficulty: integer("rc_passage_difficulty"),
  rc_passage_categories: text("rc_passage_categories"),
  rc_question_categories: text("rc_question_categories"),
  rc_question_number_in_passage: integer("rc_question_number_in_passage"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertLsatQuestionSchema = createInsertSchema(lsatQuestions).pick({
  prep_test_number: true,
  section_number: true,
  section_type: true,
  question_number_in_section: true,
  question_id: true,
  question_difficulty: true,
  question_50_percent_score: true,
  lr_question_type: true,
  lr_skills: true,
  rc_passage_id: true,
  rc_passage_number_in_section: true,
  rc_passage_difficulty: true,
  rc_passage_categories: true,
  rc_question_categories: true,
  rc_question_number_in_passage: true,
});

export type InsertLsatQuestion = z.infer<typeof insertLsatQuestionSchema>;
export type LsatQuestion = typeof lsatQuestions.$inferSelect;

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
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Separate Logical Reasoning Questions Table (optimized)
export const lrQuestions = pgTable("lr_questions", {
  id: serial("id").primaryKey(),
  prep_test_number: integer("prep_test_number").notNull(),
  section_number: integer("section_number").notNull(),
  question_number_in_section: integer("question_number_in_section").notNull(),
  question_id: text("question_id").notNull().unique(),
  question_difficulty: integer("question_difficulty"), // 1-5
  question_50_percent_score: decimal("question_50_percent_score", { precision: 6, scale: 2 }),
  question_type: text("question_type"), // Clean field name
  skills: text("skills"), // Clean field name
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Separate Reading Comprehension Questions Table (optimized)
export const rcQuestions = pgTable("rc_questions", {
  id: serial("id").primaryKey(),
  prep_test_number: integer("prep_test_number").notNull(),
  section_number: integer("section_number").notNull(),
  question_number_in_section: integer("question_number_in_section"),
  question_id: text("question_id").notNull().unique(),
  question_difficulty: integer("question_difficulty"), // 1-5
  question_50_percent_score: decimal("question_50_percent_score", { precision: 6, scale: 2 }),
  passage_id: text("passage_id"), // Clean field name
  passage_number_in_section: integer("passage_number_in_section"),
  passage_difficulty: integer("passage_difficulty"),
  passage_categories: text("passage_categories"), // Clean field name
  question_categories: text("question_categories"), // Clean field name
  question_number_in_passage: integer("question_number_in_passage"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertLrQuestionSchema = createInsertSchema(lrQuestions).pick({
  prep_test_number: true,
  section_number: true,
  question_number_in_section: true,
  question_id: true,
  question_difficulty: true,
  question_50_percent_score: true,
  question_type: true,
  skills: true,
});

export const insertRcQuestionSchema = createInsertSchema(rcQuestions).pick({
  prep_test_number: true,
  section_number: true,
  question_number_in_section: true,
  question_id: true,
  question_difficulty: true,
  question_50_percent_score: true,
  passage_id: true,
  passage_number_in_section: true,
  passage_difficulty: true,
  passage_categories: true,
  question_categories: true,
  question_number_in_passage: true,
});

export type InsertLrQuestion = z.infer<typeof insertLrQuestionSchema>;
export type LrQuestion = typeof lrQuestions.$inferSelect;
export type InsertRcQuestion = z.infer<typeof insertRcQuestionSchema>;
export type RcQuestion = typeof rcQuestions.$inferSelect;

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
