import { type User, type InsertUser, type Trail, type InsertTrail, type Activity, type InsertActivity, type TrailEvent, type InsertTrailEvent, type Review, type InsertReview, type TrailAlert, type InsertTrailAlert } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Trails
  getTrail(id: string): Promise<Trail | undefined>;
  getAllTrails(): Promise<Trail[]>;
  getTrailsNearby(lat: number, lng: number, radius: number): Promise<Trail[]>;
  searchTrails(query: string): Promise<Trail[]>;
  createTrail(trail: InsertTrail): Promise<Trail>;
  updateTrailRating(id: string, rating: number, reviewCount: number): Promise<void>;

  // Activities
  getActivity(id: string): Promise<Activity | undefined>;
  getUserActivities(userId: string): Promise<Activity[]>;
  getActiveActivity(userId: string): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined>;

  // Trail Events
  getTrailEvent(id: string): Promise<TrailEvent | undefined>;
  getTrailEvents(trailId: string): Promise<TrailEvent[]>;
  getRecentTrailEvents(limit: number): Promise<TrailEvent[]>;
  createTrailEvent(event: InsertTrailEvent): Promise<TrailEvent>;

  // Reviews
  getReview(id: string): Promise<Review | undefined>;
  getTrailReviews(trailId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Trail Alerts
  getTrailAlert(id: string): Promise<TrailAlert | undefined>;
  getActiveTrailAlerts(): Promise<TrailAlert[]>;
  getTrailAlerts(trailId: string): Promise<TrailAlert[]>;
  createTrailAlert(alert: InsertTrailAlert): Promise<TrailAlert>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private trails: Map<string, Trail> = new Map();
  private activities: Map<string, Activity> = new Map();
  private trailEvents: Map<string, TrailEvent> = new Map();
  private reviews: Map<string, Review> = new Map();
  private trailAlerts: Map<string, TrailAlert> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Sample trails
    const sampleTrails: Trail[] = [
      {
        id: "trail1",
        name: "Eagle Peak Summit",
        description: "A challenging hike with stunning panoramic views at the summit.",
        distance: 5.2,
        elevationGain: 1847,
        difficulty: "Moderate",
        latitude: 40.7829,
        longitude: -73.9654,
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.7,
        reviewCount: 124,
        createdAt: new Date(),
      },
      {
        id: "trail2",
        name: "Whispering Pines Loop",
        description: "A peaceful forest loop perfect for beginners and families.",
        distance: 3.1,
        elevationGain: 542,
        difficulty: "Easy",
        latitude: 40.7689,
        longitude: -73.9441,
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.3,
        reviewCount: 89,
        createdAt: new Date(),
      },
      {
        id: "trail3",
        name: "Rocky Ridge Trail",
        description: "Technical rocky terrain with rewarding mountain views.",
        distance: 7.8,
        elevationGain: 2340,
        difficulty: "Hard",
        latitude: 40.7504,
        longitude: -73.9857,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.5,
        reviewCount: 67,
        createdAt: new Date(),
      },
    ];

    sampleTrails.forEach(trail => this.trails.set(trail.id, trail));

    // Sample trail alerts
    const sampleAlerts: TrailAlert[] = [
      {
        id: "alert1",
        trailId: "trail1",
        type: "weather",
        title: "Snow Conditions - Eagle Peak Trail",
        message: "Microspikes recommended. Trail icy above 8,000ft.",
        severity: "warning",
        isActive: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
      {
        id: "alert2",
        trailId: "trail2",
        type: "hazard",
        title: "Wildlife Alert - Cascade Loop",
        message: "Black bear spotted near mile marker 3. Use caution.",
        severity: "danger",
        isActive: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      },
    ];

    sampleAlerts.forEach(alert => this.trailAlerts.set(alert.id, alert));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      avatar: null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Trails
  async getTrail(id: string): Promise<Trail | undefined> {
    return this.trails.get(id);
  }

  async getAllTrails(): Promise<Trail[]> {
    return Array.from(this.trails.values());
  }

  async getTrailsNearby(lat: number, lng: number, radius: number): Promise<Trail[]> {
    // Simple distance calculation (not accurate for production)
    return Array.from(this.trails.values()).filter(trail => {
      const distance = Math.sqrt(
        Math.pow(trail.latitude - lat, 2) + Math.pow(trail.longitude - lng, 2)
      );
      return distance <= radius;
    });
  }

  async searchTrails(query: string): Promise<Trail[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.trails.values()).filter(trail =>
      trail.name.toLowerCase().includes(lowercaseQuery) ||
      trail.description?.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createTrail(insertTrail: InsertTrail): Promise<Trail> {
    const id = randomUUID();
    const trail: Trail = {
      ...insertTrail,
      id,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
    };
    this.trails.set(id, trail);
    return trail;
  }

  async updateTrailRating(id: string, rating: number, reviewCount: number): Promise<void> {
    const trail = this.trails.get(id);
    if (trail) {
      trail.rating = rating;
      trail.reviewCount = reviewCount;
      this.trails.set(id, trail);
    }
  }

  // Activities
  async getActivity(id: string): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getUserActivities(userId: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity => activity.userId === userId);
  }

  async getActiveActivity(userId: string): Promise<Activity | undefined> {
    return Array.from(this.activities.values()).find(
      activity => activity.userId === userId && activity.isActive
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (activity) {
      const updatedActivity = { ...activity, ...updates };
      this.activities.set(id, updatedActivity);
      return updatedActivity;
    }
    return undefined;
  }

  // Trail Events
  async getTrailEvent(id: string): Promise<TrailEvent | undefined> {
    return this.trailEvents.get(id);
  }

  async getTrailEvents(trailId: string): Promise<TrailEvent[]> {
    return Array.from(this.trailEvents.values()).filter(event => event.trailId === trailId);
  }

  async getRecentTrailEvents(limit: number): Promise<TrailEvent[]> {
    return Array.from(this.trailEvents.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createTrailEvent(insertEvent: InsertTrailEvent): Promise<TrailEvent> {
    const id = randomUUID();
    const event: TrailEvent = {
      ...insertEvent,
      id,
      createdAt: new Date(),
    };
    this.trailEvents.set(id, event);
    return event;
  }

  // Reviews
  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getTrailReviews(trailId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.trailId === trailId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  // Trail Alerts
  async getTrailAlert(id: string): Promise<TrailAlert | undefined> {
    return this.trailAlerts.get(id);
  }

  async getActiveTrailAlerts(): Promise<TrailAlert[]> {
    const now = new Date();
    return Array.from(this.trailAlerts.values()).filter(
      alert => alert.isActive && (!alert.expiresAt || alert.expiresAt > now)
    );
  }

  async getTrailAlerts(trailId: string): Promise<TrailAlert[]> {
    return Array.from(this.trailAlerts.values()).filter(alert => alert.trailId === trailId);
  }

  async createTrailAlert(insertAlert: InsertTrailAlert): Promise<TrailAlert> {
    const id = randomUUID();
    const alert: TrailAlert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
    };
    this.trailAlerts.set(id, alert);
    return alert;
  }
}

export const storage = new MemStorage();
