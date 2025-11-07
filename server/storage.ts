// Reference: javascript_database blueprint
import {
  users, appliances, diagnoses, technicians, bookings, reviews,
  type User, type InsertUser,
  type Appliance, type InsertAppliance,
  type Diagnosis, type InsertDiagnosis,
  type Technician, type InsertTechnician,
  type Booking, type InsertBooking,
  type Review, type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Appliances
  getAppliance(id: string): Promise<Appliance | undefined>;
  getUserAppliances(userId: string): Promise<Appliance[]>;
  createAppliance(appliance: InsertAppliance): Promise<Appliance>;
  updateAppliance(id: string, appliance: Partial<InsertAppliance>): Promise<Appliance>;
  deleteAppliance(id: string): Promise<void>;

  // Diagnoses
  getDiagnosis(id: string): Promise<Diagnosis | undefined>;
  getUserDiagnoses(userId: string): Promise<Diagnosis[]>;
  createDiagnosis(diagnosis: InsertDiagnosis): Promise<Diagnosis>;
  updateDiagnosis(id: string, diagnosis: Partial<InsertDiagnosis>): Promise<Diagnosis>;

  // Technicians
  getTechnician(id: string): Promise<Technician | undefined>;
  searchTechnicians(params: { city?: string; state?: string; specialty?: string }): Promise<Technician[]>;
  getAllTechnicians(): Promise<Technician[]>;
  createTechnician(technician: InsertTechnician): Promise<Technician>;

  // Bookings
  getBooking(id: string): Promise<Booking | undefined>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getTechnicianBookings(technicianId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking>;

  // Reviews
  getReview(id: string): Promise<Review | undefined>;
  getTechnicianReviews(technicianId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Appliances
  async getAppliance(id: string): Promise<Appliance | undefined> {
    const [appliance] = await db.select().from(appliances).where(eq(appliances.id, id));
    return appliance || undefined;
  }

  async getUserAppliances(userId: string): Promise<Appliance[]> {
    return await db.select().from(appliances).where(eq(appliances.userId, userId)).orderBy(desc(appliances.createdAt));
  }

  async createAppliance(insertAppliance: InsertAppliance): Promise<Appliance> {
    const [appliance] = await db
      .insert(appliances)
      .values(insertAppliance)
      .returning();
    return appliance;
  }

  async updateAppliance(id: string, updateData: Partial<InsertAppliance>): Promise<Appliance> {
    const [appliance] = await db
      .update(appliances)
      .set(updateData)
      .where(eq(appliances.id, id))
      .returning();
    return appliance;
  }

  async deleteAppliance(id: string): Promise<void> {
    await db.delete(appliances).where(eq(appliances.id, id));
  }

  // Diagnoses
  async getDiagnosis(id: string): Promise<Diagnosis | undefined> {
    const [diagnosis] = await db.select().from(diagnoses).where(eq(diagnoses.id, id));
    return diagnosis || undefined;
  }

  async getUserDiagnoses(userId: string): Promise<Diagnosis[]> {
    return await db.select().from(diagnoses).where(eq(diagnoses.userId, userId)).orderBy(desc(diagnoses.createdAt));
  }

  async createDiagnosis(insertDiagnosis: InsertDiagnosis): Promise<Diagnosis> {
    const [diagnosis] = await db
      .insert(diagnoses)
      .values(insertDiagnosis)
      .returning();
    return diagnosis;
  }

  async updateDiagnosis(id: string, updateData: Partial<InsertDiagnosis>): Promise<Diagnosis> {
    const [diagnosis] = await db
      .update(diagnoses)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(diagnoses.id, id))
      .returning();
    return diagnosis;
  }

  // Technicians
  async getTechnician(id: string): Promise<Technician | undefined> {
    const [technician] = await db.select().from(technicians).where(eq(technicians.id, id));
    return technician || undefined;
  }

  async searchTechnicians(params: { city?: string; state?: string; specialty?: string }): Promise<Technician[]> {
    let query = db.select().from(technicians);

    const conditions = [];
    if (params.city) {
      conditions.push(eq(technicians.city, params.city));
    }
    if (params.state) {
      conditions.push(eq(technicians.state, params.state));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;

    // Filter by specialty if provided (array contains check)
    if (params.specialty) {
      return results.filter(tech => 
        tech.specialties.some(s => 
          s.toLowerCase().includes(params.specialty!.toLowerCase())
        )
      );
    }

    return results;
  }

  async getAllTechnicians(): Promise<Technician[]> {
    return await db.select().from(technicians).orderBy(desc(technicians.rating));
  }

  async createTechnician(insertTechnician: InsertTechnician): Promise<Technician> {
    const [technician] = await db
      .insert(technicians)
      .values(insertTechnician)
      .returning();
    return technician;
  }

  // Bookings
  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
  }

  async getTechnicianBookings(technicianId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.technicianId, technicianId)).orderBy(desc(bookings.scheduledDate));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async updateBooking(id: string, updateData: Partial<InsertBooking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Reviews
  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async getTechnicianReviews(technicianId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.technicianId, technicianId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();

    // Update technician's average rating
    const techReviews = await this.getTechnicianReviews(insertReview.technicianId);
    const avgRating = techReviews.reduce((sum, r) => sum + r.rating, 0) / techReviews.length;
    
    await db
      .update(technicians)
      .set({
        rating: avgRating.toFixed(2),
        totalReviews: techReviews.length,
      })
      .where(eq(technicians.id, insertReview.technicianId));

    return review;
  }
}

export const storage = new DatabaseStorage();
