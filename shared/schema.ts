import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trails = pgTable("trails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  distance: real("distance").notNull(), // in miles
  elevationGain: integer("elevation_gain").notNull(), // in feet
  difficulty: text("difficulty").notNull(), // Easy, Moderate, Hard
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  imageUrl: text("image_url"),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  trailId: varchar("trail_id").references(() => trails.id),
  name: text("name").notNull(),
  distance: real("distance").notNull(),
  elevationGain: integer("elevation_gain").notNull(),
  duration: integer("duration").notNull(), // in minutes
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  isActive: boolean("is_active").default(false),
  route: json("route"), // GPS coordinates array
  createdAt: timestamp("created_at").defaultNow(),
});

export const trailEvents = pgTable("trail_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trailId: varchar("trail_id").notNull().references(() => trails.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // wildlife, hazard, weather, photo
  title: text("title").notNull(),
  description: text("description"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  severity: text("severity").default("low"), // low, medium, high
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trailId: varchar("trail_id").notNull().references(() => trails.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  photos: json("photos"), // array of photo URLs
  createdAt: timestamp("created_at").defaultNow(),
});

export const trailAlerts = pgTable("trail_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trailId: varchar("trail_id").notNull().references(() => trails.id),
  type: text("type").notNull(), // weather, closure, hazard
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(), // info, warning, danger
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTrailSchema = createInsertSchema(trails).omit({
  id: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertTrailEventSchema = createInsertSchema(trailEvents).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertTrailAlertSchema = createInsertSchema(trailAlerts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Trail = typeof trails.$inferSelect;
export type InsertTrail = z.infer<typeof insertTrailSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type TrailEvent = typeof trailEvents.$inferSelect;
export type InsertTrailEvent = z.infer<typeof insertTrailEventSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type TrailAlert = typeof trailAlerts.$inferSelect;
export type InsertTrailAlert = z.infer<typeof insertTrailAlertSchema>;
