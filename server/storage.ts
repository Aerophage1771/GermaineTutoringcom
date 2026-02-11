import { 
  users, type User, type InsertUser, 
  subscribers, type Subscriber, type InsertSubscriber, 
  consultations, type Consultation, type InsertConsultation,
  sessions, type Session, type InsertSession,
  problemLog, type ProblemLog, type InsertProblemLog,
  practiceActivities, type PracticeActivity, type InsertPracticeActivity,
  timeAddOns, type TimeAddOn, type InsertTimeAddOn,
  lsatQuestions, type LsatQuestion,
  lrQuestions, type LrQuestion,
  rcQuestions, type RcQuestion,
  practiceSets, type PracticeSet, type InsertPracticeSet,
  questionDetails, type QuestionDetails, type InsertQuestionDetails,
  blogPosts, type BlogPost as BlogPostType, type InsertBlogPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, inArray, like, or } from "drizzle-orm";

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
  
  // LSAT Questions (legacy - will be deprecated)
  getLSATQuestionsByTest(prepTest: number): Promise<LsatQuestion[]>;
  getLSATQuestionsBySection(prepTest: number, sectionNumber: number): Promise<LsatQuestion[]>;
  getLSATQuestionsByType(sectionType: string, limit?: number): Promise<LsatQuestion[]>;
  getRandomLSATQuestions(count: number, sectionType?: string, difficulty?: number): Promise<LsatQuestion[]>;
  
  // New separated tables
  getLRQuestions(filters: {
    questionTypes?: string[];
    skills?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit?: number): Promise<LrQuestion[]>;
  
  getRCQuestions(filters: {
    passageCategories?: string[];
    questionCategories?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit?: number): Promise<RcQuestion[]>;
  
  // Browse methods with filters (legacy)
  browseLRQuestions(filters: {
    questionTypes?: string[];
    skills?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit?: number): Promise<LsatQuestion[]>;
  
  // Practice sets
  getPracticeSets(userId: number): Promise<PracticeSet[]>;
  createPracticeSet(data: { name: string; type: 'lr' | 'rc'; questionIds: number[]; userId: number }): Promise<PracticeSet>;
  getPracticeSet(id: string, userId: number): Promise<any | null>;
  
  // Question details for practice
  getQuestionsWithDetails(params: {
    type: 'lr' | 'rc';
    filters: any;
    search?: string;
    page: number;
  }): Promise<any[]>;
  getQuestionDetails(questionId: string): Promise<QuestionDetails | null>;
  createQuestionDetails(details: InsertQuestionDetails): Promise<QuestionDetails>;
  
  // Practice activity logging
  logPracticeActivity(activity: InsertPracticeActivity): Promise<PracticeActivity>;
  
  browseRCPassages(filters: {
    passageCategories?: string[];
    questionCategories?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit?: number): Promise<LsatQuestion[]>;

  // Blog posts
  getBlogPosts(includedrafts?: boolean): Promise<BlogPostType[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPostType | undefined>;
  getBlogPostById(id: number): Promise<BlogPostType | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPostType>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPostType>;
  deleteBlogPost(id: number): Promise<void>;
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
  }, limit: number = 10000): Promise<LsatQuestion[]> {
    try {
      const conditions = [eq(lsatQuestions.section_type, 'Logical Reasoning')];
      
      // Handle semicolon-delimited question types
      if (filters.questionTypes && filters.questionTypes.length > 0) {
        const typeConditions = filters.questionTypes.map(type => 
          or(
            eq(lsatQuestions.lr_question_type, type),
            like(lsatQuestions.lr_question_type, `${type};%`),
            like(lsatQuestions.lr_question_type, `%;${type};%`),
            like(lsatQuestions.lr_question_type, `%;${type}`)
          )
        );
        conditions.push(or(...typeConditions));
      }
      
      // Handle semicolon-delimited skills
      if (filters.skills && filters.skills.length > 0) {
        const skillConditions = filters.skills.map(skill => 
          or(
            eq(lsatQuestions.lr_skills, skill),
            like(lsatQuestions.lr_skills, `${skill};%`),
            like(lsatQuestions.lr_skills, `%;${skill};%`),
            like(lsatQuestions.lr_skills, `%;${skill}`)
          )
        );
        conditions.push(or(...skillConditions));
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
  }, limit: number = 10000): Promise<LsatQuestion[]> {
    try {
      const conditions = [eq(lsatQuestions.section_type, 'Reading Comprehension')];
      
      // Handle semicolon-delimited passage categories
      if (filters.passageCategories && filters.passageCategories.length > 0) {
        const passageConditions = filters.passageCategories.map(category => 
          or(
            eq(lsatQuestions.rc_passage_categories, category),
            like(lsatQuestions.rc_passage_categories, `${category};%`),
            like(lsatQuestions.rc_passage_categories, `%;${category};%`),
            like(lsatQuestions.rc_passage_categories, `%;${category}`)
          )
        );
        conditions.push(or(...passageConditions));
      }
      
      // Handle semicolon-delimited question categories
      if (filters.questionCategories && filters.questionCategories.length > 0) {
        const questionConditions = filters.questionCategories.map(category => 
          or(
            eq(lsatQuestions.rc_question_categories, category),
            like(lsatQuestions.rc_question_categories, `${category};%`),
            like(lsatQuestions.rc_question_categories, `%;${category};%`),
            like(lsatQuestions.rc_question_categories, `%;${category}`)
          )
        );
        conditions.push(or(...questionConditions));
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

  // New optimized LR Questions method
  async getLRQuestions(filters: {
    questionTypes?: string[];
    skills?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit: number = 10000): Promise<LrQuestion[]> {
    try {
      const conditions = [];
      
      // Handle semicolon-delimited question types
      if (filters.questionTypes && filters.questionTypes.length > 0) {
        const typeConditions = filters.questionTypes.map(type => 
          or(
            eq(lrQuestions.question_type, type),
            like(lrQuestions.question_type, `${type};%`),
            like(lrQuestions.question_type, `%;${type};%`),
            like(lrQuestions.question_type, `%;${type}`)
          )
        );
        conditions.push(or(...typeConditions));
      }
      
      // Handle semicolon-delimited skills
      if (filters.skills && filters.skills.length > 0) {
        const skillConditions = filters.skills.map(skill => 
          or(
            eq(lrQuestions.skills, skill),
            like(lrQuestions.skills, `${skill};%`),
            like(lrQuestions.skills, `%;${skill};%`),
            like(lrQuestions.skills, `%;${skill}`)
          )
        );
        conditions.push(or(...skillConditions));
      }
      
      if (filters.difficulty && filters.difficulty.length > 0) {
        conditions.push(inArray(lrQuestions.question_difficulty, filters.difficulty));
      }
      
      if (filters.prepTests && filters.prepTests.length > 0) {
        conditions.push(inArray(lrQuestions.prep_test_number, filters.prepTests));
      }
      
      const questions = await db
        .select()
        .from(lrQuestions)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(lrQuestions.prep_test_number, lrQuestions.section_number, lrQuestions.question_number_in_section)
        .limit(limit);
      
      return questions;
    } catch (error) {
      console.error("Error fetching LR questions:", error);
      throw error;
    }
  }

  // New optimized RC Questions method
  async getRCQuestions(filters: {
    passageCategories?: string[];
    questionCategories?: string[];
    difficulty?: number[];
    prepTests?: number[];
  }, limit: number = 10000): Promise<RcQuestion[]> {
    try {
      const conditions = [];
      
      // Handle semicolon-delimited passage categories
      if (filters.passageCategories && filters.passageCategories.length > 0) {
        const passageConditions = filters.passageCategories.map(category => 
          or(
            eq(rcQuestions.passage_categories, category),
            like(rcQuestions.passage_categories, `${category};%`),
            like(rcQuestions.passage_categories, `%;${category};%`),
            like(rcQuestions.passage_categories, `%;${category}`)
          )
        );
        conditions.push(or(...passageConditions));
      }
      
      // Handle semicolon-delimited question categories
      if (filters.questionCategories && filters.questionCategories.length > 0) {
        const questionConditions = filters.questionCategories.map(category => 
          or(
            eq(rcQuestions.question_categories, category),
            like(rcQuestions.question_categories, `${category};%`),
            like(rcQuestions.question_categories, `%;${category};%`),
            like(rcQuestions.question_categories, `%;${category}`)
          )
        );
        conditions.push(or(...questionConditions));
      }
      
      if (filters.difficulty && filters.difficulty.length > 0) {
        conditions.push(inArray(rcQuestions.passage_difficulty, filters.difficulty));
      }
      
      if (filters.prepTests && filters.prepTests.length > 0) {
        conditions.push(inArray(rcQuestions.prep_test_number, filters.prepTests));
      }
      
      // Build the base query
      let query = db
        .select()
        .from(rcQuestions)
        .orderBy(
          rcQuestions.prep_test_number, 
          rcQuestions.section_number, 
          rcQuestions.passage_number_in_section,
          rcQuestions.question_number_in_passage
        );
      
      // Apply conditions if any
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const questions = await query.limit(limit);
      
      return questions;
    } catch (error) {
      console.error("Error fetching RC questions:", error);
      throw error;
    }
  }

  // Practice sets implementation
  async getPracticeSets(userId: number): Promise<PracticeSet[]> {
    try {
      const sets = await db
        .select()
        .from(practiceSets)
        .where(eq(practiceSets.user_id, userId))
        .orderBy(desc(practiceSets.created_at));
      return sets;
    } catch (error) {
      console.error("Error fetching practice sets:", error);
      throw error;
    }
  }

  async createPracticeSet(data: { name: string; type: 'lr' | 'rc'; questionIds: number[]; userId: number }): Promise<PracticeSet> {
    try {
      const id = `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const [set] = await db
        .insert(practiceSets)
        .values({
          id,
          user_id: data.userId,
          name: data.name,
          type: data.type,
          question_ids: JSON.stringify(data.questionIds)
        })
        .returning();
      return set;
    } catch (error) {
      console.error("Error creating practice set:", error);
      throw error;
    }
  }

  async getPracticeSet(id: string, userId: number): Promise<any | null> {
    try {
      const [set] = await db
        .select()
        .from(practiceSets)
        .where(and(eq(practiceSets.id, id), eq(practiceSets.user_id, userId)));
      
      if (!set) return null;
      
      const questionIds = JSON.parse(set.question_ids);
      
      // Get question details based on type
      let questions = [];
      if (set.type === 'lr') {
        questions = await db
          .select()
          .from(lrQuestions)
          .where(inArray(lrQuestions.id, questionIds))
          .orderBy(lrQuestions.prep_test_number, lrQuestions.section_number, lrQuestions.question_number_in_section);
      } else {
        questions = await db
          .select()
          .from(rcQuestions)
          .where(inArray(rcQuestions.id, questionIds))
          .orderBy(rcQuestions.prep_test_number, rcQuestions.section_number, rcQuestions.passage_number_in_section, rcQuestions.question_number_in_passage);
      }
      
      // For now, we'll create mock question details since we don't have actual question text in our database
      const questionsWithDetails = questions.map(q => ({
        id: q.id,
        prep_test_number: q.prep_test_number,
        section_number: q.section_number,
        question_number_in_section: q.question_number_in_section,
        question_id: q.question_id,
        question_difficulty: q.question_difficulty || 
          ('passage_difficulty' in q ? q.passage_difficulty : null) || 3,
        question_text: `This is a sample question text for ${q.question_id}. In practice, this would contain the actual LSAT question content.`,
        answer_choices: {
          A: "Sample answer choice A",
          B: "Sample answer choice B", 
          C: "Sample answer choice C",
          D: "Sample answer choice D",
          E: "Sample answer choice E"
        },
        correct_answer: "C",
        explanation: `This is a sample explanation for ${q.question_id}. The correct answer is C because...`,
        question_type: 'question_type' in q ? q.question_type : 
          ('question_categories' in q ? q.question_categories : null),
        skills: 'skills' in q ? q.skills : 
          ('passage_categories' in q ? q.passage_categories : null),
        passage_text: set.type === 'rc' ? `This is a sample passage text for ${('passage_id' in q) ? q.passage_id : 'unknown'}. In practice, this would contain the actual Reading Comprehension passage.` : undefined,
        passage_id: set.type === 'rc' && 'passage_id' in q ? q.passage_id : undefined,
        question_number_in_passage: set.type === 'rc' && 'question_number_in_passage' in q ? q.question_number_in_passage : undefined
      }));
      
      return {
        ...set,
        questions: questionsWithDetails
      };
    } catch (error) {
      console.error("Error fetching practice set:", error);
      throw error;
    }
  }

  // Question details for practice
  async getQuestionsWithDetails(params: {
    type: 'lr' | 'rc';
    filters: any;
    search?: string;
    page: number;
  }): Promise<any[]> {
    try {
      const limit = 25;
      const offset = (params.page - 1) * limit;
      
      let questions = [];
      if (params.type === 'lr') {
        questions = await this.getLRQuestions(params.filters, 1000);
      } else {
        questions = await this.getRCQuestions(params.filters, 1000);
      }
      
      // Apply search filter if provided
      if (params.search && params.search.trim()) {
        const searchTerm = params.search.toLowerCase();
        questions = questions.filter(q => {
          const questionType = 'question_type' in q ? q.question_type : 
            ('question_categories' in q ? q.question_categories : null);
          const skills = 'skills' in q ? q.skills : 
            ('passage_categories' in q ? q.passage_categories : null);
          
          return q.question_id.toLowerCase().includes(searchTerm) ||
            (questionType && questionType.toLowerCase().includes(searchTerm)) ||
            (skills && skills.toLowerCase().includes(searchTerm));
        });
      }
      
      // Apply pagination
      return questions.slice(offset, offset + limit);
    } catch (error) {
      console.error("Error fetching questions with details:", error);
      throw error;
    }
  }

  async getQuestionDetails(questionId: string): Promise<QuestionDetails | null> {
    try {
      const [details] = await db
        .select()
        .from(questionDetails)
        .where(eq(questionDetails.question_id, questionId));
      return details || null;
    } catch (error) {
      console.error("Error fetching question details:", error);
      throw error;
    }
  }

  async createQuestionDetails(details: InsertQuestionDetails): Promise<QuestionDetails> {
    try {
      const [created] = await db
        .insert(questionDetails)
        .values(details)
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating question details:", error);
      throw error;
    }
  }

  // Practice activity logging
  async logPracticeActivity(activity: InsertPracticeActivity): Promise<PracticeActivity> {
    try {
      const [created] = await db
        .insert(practiceActivities)
        .values(activity)
        .returning();
      return created;
    } catch (error) {
      console.error("Error logging practice activity:", error);
      throw error;
    }
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
}

export const storage = new DatabaseStorage();
