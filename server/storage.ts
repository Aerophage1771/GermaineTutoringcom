import { users, type User, type InsertUser, subscribers, type Subscriber, type InsertSubscriber, consultations, type Consultation, type InsertConsultation } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validatePassword(user: User, password: string): Promise<boolean>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subscribers: Map<number, Subscriber>;
  private consultations: Map<number, Consultation>;
  private currentUserId: number;
  private currentSubscriberId: number;
  private currentConsultationId: number;

  constructor() {
    this.users = new Map();
    this.subscribers = new Map();
    this.consultations = new Map();
    this.currentUserId = 1;
    this.currentSubscriberId = 1;
    this.currentConsultationId = 1;

    // Create a demo student account for testing
    this.createUser({
      username: "student",
      email: "student@demo.com",
      password: "demo123"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    // In production, you'd use proper password hashing (bcrypt, etc.)
    // For demo purposes, we're doing simple string comparison
    return user.password === password;
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentSubscriberId++;
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id,
      created_at: new Date()
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = this.currentConsultationId++;
    const consultation: Consultation = { 
      ...insertConsultation, 
      id,
      created_at: new Date(),
      contacted: false,
      current_score: insertConsultation.current_score || null,
      test_date: insertConsultation.test_date || null
    };
    this.consultations.set(id, consultation);
    return consultation;
  }
}

export const storage = new MemStorage();
