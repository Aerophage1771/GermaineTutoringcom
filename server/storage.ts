import { 
  profiles, type User, type InsertUser, 
  subscribers, type Subscriber, type InsertSubscriber, 
  consultations, type Consultation, type InsertConsultation,
  sessions, type Session, type InsertSession,
  timeAddOns, type TimeAddOn, type InsertTimeAddOn,
  blogPosts, type BlogPost as BlogPostType, type InsertBlogPost,
  blogComments, type BlogComment, type InsertBlogComment
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, lte } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User management (via profiles table)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  validatePassword(user: User, password: string): Promise<boolean>;
  
  // Subscription and consultation
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  
  // Session management
  getUserSessions(userId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  
  // Time add-ons
  getUserTimeAddOns(userId: number): Promise<TimeAddOn[]>;
  createTimeAddOn(addon: InsertTimeAddOn): Promise<TimeAddOn>;

  // Blog posts
  getBlogPosts(includedrafts?: boolean): Promise<BlogPostType[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPostType | undefined>;
  getBlogPostById(id: number): Promise<BlogPostType | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPostType>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPostType>;
  deleteBlogPost(id: number): Promise<void>;
  getScheduledPostsDue(): Promise<BlogPostType[]>;
  publishScheduledPost(id: number): Promise<BlogPostType>;

  getCommentsByPostSlug(slug: string): Promise<BlogComment[]>;
  createComment(comment: InsertBlogComment): Promise<BlogComment>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;
  updateUserPassword(id: number, hashedPassword: string): Promise<User>;
  getAllSessions(): Promise<Session[]>;
  getSessionsByUserId(userId: number): Promise<Session[]>;
  updateSession(id: number, updates: Partial<Session>): Promise<Session>;
  deleteSession(id: number): Promise<void>;
  seedAdminUser(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User management (via profiles table)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(profiles).where(eq(profiles.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(profiles).where(eq(profiles.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(profiles).where(eq(profiles.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(profiles)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, id))
      .returning();
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (user.password.startsWith('$2')) {
      return bcrypt.compare(password, user.password);
    }
    return user.password === password;
  }

  // Subscription and consultation
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db
      .insert(subscribers)
      .values(insertSubscriber)
      .returning();
    return subscriber;
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const [consultation] = await db
      .insert(consultations)
      .values(insertConsultation)
      .returning();
    return consultation;
  }

  // Session management
  async getUserSessions(userId: number): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.user_id, userId.toString()))
      .orderBy(desc(sessions.date));
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(insertSession)
      .returning();
    
    // Update user's session count using SQL increment
    await db
      .update(profiles)
      .set({ sessions_held: sql`${profiles.sessions_held} + 1` })
      .where(eq(profiles.id, Number(insertSession.user_id)));
    
    return session;
  }

  // Time add-ons
  async getUserTimeAddOns(userId: number): Promise<TimeAddOn[]> {
    return await db
      .select()
      .from(timeAddOns)
      .where(eq(timeAddOns.user_id, userId))
      .orderBy(desc(timeAddOns.purchased_at));
  }

  async createTimeAddOn(addon: InsertTimeAddOn): Promise<TimeAddOn> {
    const [timeAddon] = await db
      .insert(timeAddOns)
      .values(addon)
      .returning();
    return timeAddon;
  }

  // Blog posts
  async getBlogPosts(includeDrafts: boolean = false): Promise<BlogPostType[]> {
    if (includeDrafts) {
      return db.select().from(blogPosts).orderBy(desc(blogPosts.created_at));
    }
    return db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.published_at));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPostType | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getBlogPostById(id: number): Promise<BlogPostType | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPostType> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPostType> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getScheduledPostsDue(): Promise<BlogPostType[]> {
    return db.select().from(blogPosts).where(
      and(
        eq(blogPosts.status, "scheduled"),
        lte(blogPosts.scheduled_at, new Date())
      )
    );
  }

  async publishScheduledPost(id: number): Promise<BlogPostType> {
    const [updated] = await db
      .update(blogPosts)
      .set({
        status: "published",
        published_at: new Date(),
        scheduled_at: null,
        updated_at: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async getCommentsByPostSlug(slug: string): Promise<BlogComment[]> {
    return await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.post_slug, slug))
      .orderBy(desc(blogComments.created_at));
  }

  async createComment(comment: InsertBlogComment): Promise<BlogComment> {
    const [created] = await db
      .insert(blogComments)
      .values(comment)
      .returning();
    return created;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(profiles).orderBy(desc(profiles.created_at));
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(profiles).where(eq(profiles.id, id));
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<User> {
    const [user] = await db
      .update(profiles)
      .set({ password: hashedPassword })
      .where(eq(profiles.id, id))
      .returning();
    return user;
  }

  async getAllSessions(): Promise<Session[]> {
    return db.select().from(sessions).orderBy(desc(sessions.date));
  }

  async getSessionsByUserId(userId: number): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.user_id, userId.toString())).orderBy(desc(sessions.date));
  }

  async updateSession(id: number, updates: Partial<Session>): Promise<Session> {
    const [session] = await db
      .update(sessions)
      .set(updates)
      .where(eq(sessions.id, id))
      .returning();
    return session;
  }

  async deleteSession(id: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
  }

  async seedAdminUser(): Promise<void> {
    const existing = await this.getUserByEmail("aerophage1771-admin");
    if (!existing) {
      const hashedPassword = await bcrypt.hash("MezoAlpineTwizz2084", 10);
      await db.insert(profiles).values({
        username: "aerophage1771-admin",
        email: "aerophage1771-admin",
        password: hashedPassword,
        role: "admin",
        sessions_held: 0,
        time_remaining: "0.0",
        bonus_test_review_time: "0.0",
      });
      console.log("Admin user seeded successfully");
    }
  }
}

export const storage = new DatabaseStorage();
