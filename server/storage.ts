import { 
  users, type User, type InsertUser, 
  subscribers, type Subscriber, type InsertSubscriber, 
  consultations, type Consultation, type InsertConsultation,
  sessions, type Session, type InsertSession,
  problemLog, type ProblemLog, type InsertProblemLog,
  practiceActivities, type PracticeActivity, type InsertPracticeActivity,
  timeAddOns, type TimeAddOn, type InsertTimeAddOn,
  lsatQuestions, type LsatQuestion
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, inArray } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  validatePassword(user: User, password: string): Promise<boolean>;
  
  // Subscription and consultation (legacy)
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  
  // Session management
  getUserSessions(userId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  
  // Problem log
  getUserProblemLog(userId: number): Promise<ProblemLog[]>;
  createProblemLogEntry(entry: InsertProblemLog): Promise<ProblemLog>;
  updateProblemLogEntry(id: number, updates: Partial<ProblemLog>): Promise<ProblemLog>;
  deleteProblemLogEntry(id: number): Promise<void>;
  
  // Practice activities
  getUserPracticeActivities(userId: number): Promise<PracticeActivity[]>;
  createPracticeActivity(activity: InsertPracticeActivity): Promise<PracticeActivity>;
  
  // Time add-ons
  getUserTimeAddOns(userId: number): Promise<TimeAddOn[]>;
  createTimeAddOn(addon: InsertTimeAddOn): Promise<TimeAddOn>;
  
  // LSAT Questions
  getLSATQuestionsByTest(prepTest: number): Promise<LsatQuestion[]>;
  getLSATQuestionsBySection(prepTest: number, sectionNumber: number): Promise<LsatQuestion[]>;
  getLSATQuestionsByType(sectionType: string, limit?: number): Promise<LsatQuestion[]>;
  getRandomLSATQuestions(count: number, sectionType?: string, difficulty?: number): Promise<LsatQuestion[]>;
  
  // Browse methods with filters
  browseLRQuestions(filters: {
    questionTypes?: string[];
    skills?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit?: number): Promise<LsatQuestion[]>;
  
  browseRCPassages(filters: {
    passageCategories?: string[];
    questionCategories?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit?: number): Promise<LsatQuestion[]>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updated_at: new Date() } as any)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    // In production, you'd use proper password hashing (bcrypt, etc.)
    // For demo purposes, we're doing simple string comparison
    return user.password === password;
  }

  // Legacy subscription and consultation
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
      .where(eq(sessions.user_id, userId))
      .orderBy(desc(sessions.date));
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(insertSession)
      .returning();
    
    // Update user's session count using SQL increment
    await db
      .update(users)
      .set({ sessions_held: sql`${users.sessions_held} + 1` })
      .where(eq(users.id, insertSession.user_id));
    
    return session;
  }

  // Problem log
  async getUserProblemLog(userId: number): Promise<ProblemLog[]> {
    return await db
      .select()
      .from(problemLog)
      .where(eq(problemLog.user_id, userId))
      .orderBy(desc(problemLog.updated_at));
  }

  async createProblemLogEntry(entry: InsertProblemLog): Promise<ProblemLog> {
    const [problemEntry] = await db
      .insert(problemLog)
      .values(entry)
      .returning();
    return problemEntry;
  }

  async updateProblemLogEntry(id: number, updates: Partial<ProblemLog>): Promise<ProblemLog> {
    const [updated] = await db
      .update(problemLog)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(problemLog.id, id))
      .returning();
    return updated;
  }

  async deleteProblemLogEntry(id: number): Promise<void> {
    await db
      .delete(problemLog)
      .where(eq(problemLog.id, id));
  }

  // Practice activities
  async getUserPracticeActivities(userId: number): Promise<PracticeActivity[]> {
    return await db
      .select()
      .from(practiceActivities)
      .where(eq(practiceActivities.user_id, userId))
      .orderBy(desc(practiceActivities.completed_at));
  }

  async createPracticeActivity(activity: InsertPracticeActivity): Promise<PracticeActivity> {
    const [practiceActivity] = await db
      .insert(practiceActivities)
      .values(activity)
      .returning();
    return practiceActivity;
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

  // LSAT Questions
  async getLSATQuestionsByTest(prepTest: number): Promise<LsatQuestion[]> {
    return await db
      .select()
      .from(lsatQuestions)
      .where(eq(lsatQuestions.prep_test_number, prepTest))
      .orderBy(lsatQuestions.section_number, lsatQuestions.question_number_in_section);
  }

  async getLSATQuestionsBySection(prepTest: number, sectionNumber: number): Promise<LsatQuestion[]> {
    return await db
      .select()
      .from(lsatQuestions)
      .where(
        and(
          eq(lsatQuestions.prep_test_number, prepTest),
          eq(lsatQuestions.section_number, sectionNumber)
        )
      )
      .orderBy(lsatQuestions.question_number_in_section);
  }

  async getLSATQuestionsByType(sectionType: string, limit: number = 50): Promise<LsatQuestion[]> {
    return await db
      .select()
      .from(lsatQuestions)
      .where(eq(lsatQuestions.section_type, sectionType))
      .limit(limit);
  }

  async getRandomLSATQuestions(count: number, sectionType?: string, difficulty?: number): Promise<LsatQuestion[]> {
    if (sectionType && difficulty) {
      return await db
        .select()
        .from(lsatQuestions)
        .where(
          and(
            eq(lsatQuestions.section_type, sectionType),
            eq(lsatQuestions.question_difficulty, difficulty)
          )
        )
        .orderBy(sql`RANDOM()`)
        .limit(count);
    } else if (sectionType) {
      return await db
        .select()
        .from(lsatQuestions)
        .where(eq(lsatQuestions.section_type, sectionType))
        .orderBy(sql`RANDOM()`)
        .limit(count);
    } else if (difficulty) {
      return await db
        .select()
        .from(lsatQuestions)
        .where(eq(lsatQuestions.question_difficulty, difficulty))
        .orderBy(sql`RANDOM()`)
        .limit(count);
    }
    
    return await db
      .select()
      .from(lsatQuestions)
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  async browseLRQuestions(filters: {
    questionTypes?: string[];
    skills?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit: number = 50): Promise<LsatQuestion[]> {
    try {
      let query = db.select().from(lsatQuestions)
        .where(eq(lsatQuestions.section_type, 'Logical Reasoning'));
      
      const conditions = [eq(lsatQuestions.section_type, 'Logical Reasoning')];
      
      if (filters.questionTypes && filters.questionTypes.length > 0) {
        conditions.push(inArray(lsatQuestions.lr_question_type, filters.questionTypes));
      }
      
      if (filters.skills && filters.skills.length > 0) {
        conditions.push(inArray(lsatQuestions.lr_skills, filters.skills));
      }
      
      if (filters.difficulty && filters.difficulty.length > 0) {
        conditions.push(inArray(lsatQuestions.question_difficulty, filters.difficulty));
      }
      
      if (filters.prepTests && filters.prepTests.length > 0) {
        conditions.push(inArray(lsatQuestions.prep_test_number, filters.prepTests));
      }
      
      const questions = await db
        .select()
        .from(lsatQuestions)
        .where(and(...conditions))
        .orderBy(lsatQuestions.prep_test_number, lsatQuestions.section_number, lsatQuestions.question_number_in_section)
        .limit(limit);
      
      return questions;
    } catch (error) {
      console.error("Error browsing LR questions:", error);
      throw error;
    }
  }

  async browseRCPassages(filters: {
    passageCategories?: string[];
    questionCategories?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit: number = 50): Promise<LsatQuestion[]> {
    try {
      const conditions = [eq(lsatQuestions.section_type, 'Reading Comprehension')];
      
      if (filters.passageCategories && filters.passageCategories.length > 0) {
        conditions.push(inArray(lsatQuestions.rc_passage_categories, filters.passageCategories));
      }
      
      if (filters.questionCategories && filters.questionCategories.length > 0) {
        conditions.push(inArray(lsatQuestions.rc_question_categories, filters.questionCategories));
      }
      
      if (filters.difficulty && filters.difficulty.length > 0) {
        conditions.push(inArray(lsatQuestions.rc_passage_difficulty, filters.difficulty));
      }
      
      if (filters.prepTests && filters.prepTests.length > 0) {
        conditions.push(inArray(lsatQuestions.prep_test_number, filters.prepTests));
      }
      
      // Group by passage and order questions within each passage
      const questions = await db
        .select()
        .from(lsatQuestions)
        .where(and(...conditions))
        .orderBy(
          lsatQuestions.prep_test_number, 
          lsatQuestions.section_number, 
          lsatQuestions.rc_passage_number_in_section,
          lsatQuestions.rc_question_number_in_passage
        )
        .limit(limit);
      
      return questions;
    } catch (error) {
      console.error("Error browsing RC passages:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
