import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Appliances table - stores user's registered devices
export const appliances = pgTable("appliances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Kitchen Refrigerator"
  type: text("type").notNull(), // e.g., "refrigerator", "washing_machine", "dishwasher"
  brand: text("brand"),
  model: text("model"),
  serialNumber: text("serial_number"),
  purchaseDate: timestamp("purchase_date"),
  warrantyExpiry: timestamp("warranty_expiry"),
  manualUrl: text("manual_url"),
  imageUrl: text("image_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Diagnoses table - stores AI diagnostic sessions
export const diagnoses = pgTable("diagnoses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  applianceId: varchar("appliance_id").references(() => appliances.id, { onDelete: "set null" }),
  issue: text("issue").notNull(), // User's description of the problem
  messages: jsonb("messages").notNull().default(sql`'[]'::jsonb`), // Chat history
  diagnosis: text("diagnosis"), // AI's diagnosis
  solution: text("solution"), // Recommended solution
  imageUrl: text("image_url"), // Uploaded image for visual diagnosis
  imageAnalysis: text("image_analysis"), // AI's image analysis result
  status: text("status").notNull().default("open"), // open, resolved, escalated
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Technicians table
export const technicians = pgTable("technicians", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  specialties: text("specialties").array().notNull().default(sql`ARRAY[]::text[]`), // e.g., ["HVAC", "Refrigeration"]
  serviceRadius: integer("service_radius").notNull().default(25), // miles
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bookings table - technician service bookings
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  technicianId: varchar("technician_id").notNull().references(() => technicians.id, { onDelete: "cascade" }),
  applianceId: varchar("appliance_id").references(() => appliances.id, { onDelete: "set null" }),
  diagnosisId: varchar("diagnosis_id").references(() => diagnoses.id, { onDelete: "set null" }),
  scheduledDate: timestamp("scheduled_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  serviceType: text("service_type").notNull(), // repair, maintenance, installation
  problemDescription: text("problem_description").notNull(),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  paymentStatus: text("payment_status").notNull().default("unpaid"), // unpaid, paid, refunded
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reviews table - user reviews for technicians
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  technicianId: varchar("technician_id").notNull().references(() => technicians.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  appliances: many(appliances),
  diagnoses: many(diagnoses),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const appliancesRelations = relations(appliances, ({ one, many }) => ({
  user: one(users, {
    fields: [appliances.userId],
    references: [users.id],
  }),
  diagnoses: many(diagnoses),
  bookings: many(bookings),
}));

export const diagnosesRelations = relations(diagnoses, ({ one, many }) => ({
  user: one(users, {
    fields: [diagnoses.userId],
    references: [users.id],
  }),
  appliance: one(appliances, {
    fields: [diagnoses.applianceId],
    references: [appliances.id],
  }),
  bookings: many(bookings),
}));

export const techniciansRelations = relations(technicians, ({ many }) => ({
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  technician: one(technicians, {
    fields: [bookings.technicianId],
    references: [technicians.id],
  }),
  appliance: one(appliances, {
    fields: [bookings.applianceId],
    references: [appliances.id],
  }),
  diagnosis: one(diagnoses, {
    fields: [bookings.diagnosisId],
    references: [diagnoses.id],
  }),
  review: one(reviews, {
    fields: [bookings.id],
    references: [reviews.bookingId],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  technician: one(technicians, {
    fields: [reviews.technicianId],
    references: [technicians.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertApplianceSchema = createInsertSchema(appliances).omit({
  id: true,
  createdAt: true,
});

export const insertDiagnosisSchema = createInsertSchema(diagnoses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTechnicianSchema = createInsertSchema(technicians).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Appliance = typeof appliances.$inferSelect;
export type InsertAppliance = z.infer<typeof insertApplianceSchema>;

export type Diagnosis = typeof diagnoses.$inferSelect;
export type InsertDiagnosis = z.infer<typeof insertDiagnosisSchema>;

export type Technician = typeof technicians.$inferSelect;
export type InsertTechnician = z.infer<typeof insertTechnicianSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
