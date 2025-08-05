import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTrailSchema, insertActivitySchema, insertTrailEventSchema, insertReviewSchema, insertTrailAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Trails routes
  app.get("/api/trails", async (req, res) => {
    try {
      const { lat, lng, radius, search } = req.query;
      
      let trails;
      if (lat && lng && radius) {
        trails = await storage.getTrailsNearby(
          parseFloat(lat as string),
          parseFloat(lng as string),
          parseFloat(radius as string)
        );
      } else if (search) {
        trails = await storage.searchTrails(search as string);
      } else {
        trails = await storage.getAllTrails();
      }
      
      res.json(trails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trails" });
    }
  });

  app.get("/api/trails/:id", async (req, res) => {
    try {
      const trail = await storage.getTrail(req.params.id);
      if (!trail) {
        return res.status(404).json({ message: "Trail not found" });
      }
      res.json(trail);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trail" });
    }
  });

  app.post("/api/trails", async (req, res) => {
    try {
      const trailData = insertTrailSchema.parse(req.body);
      const trail = await storage.createTrail(trailData);
      res.status(201).json(trail);
    } catch (error) {
      res.status(400).json({ message: "Invalid trail data" });
    }
  });

  // Activities routes
  app.get("/api/activities/active", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const activity = await storage.getActiveActivity(userId);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active activity" });
    }
  });

  app.get("/api/activities/user/:userId", async (req, res) => {
    try {
      const activities = await storage.getUserActivities(req.params.userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  app.patch("/api/activities/:id", async (req, res) => {
    try {
      const updates = req.body;
      const activity = await storage.updateActivity(req.params.id, updates);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to update activity" });
    }
  });

  // Trail Events routes
  app.get("/api/trail-events/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const events = await storage.getRecentTrailEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trail events" });
    }
  });

  app.get("/api/trail-events/trail/:trailId", async (req, res) => {
    try {
      const events = await storage.getTrailEvents(req.params.trailId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trail events" });
    }
  });

  app.post("/api/trail-events", async (req, res) => {
    try {
      const eventData = insertTrailEventSchema.parse(req.body);
      const event = await storage.createTrailEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  // Reviews routes
  app.get("/api/reviews/trail/:trailId", async (req, res) => {
    try {
      const reviews = await storage.getTrailReviews(req.params.trailId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      
      // Update trail rating
      const trailReviews = await storage.getTrailReviews(reviewData.trailId);
      const avgRating = trailReviews.reduce((sum, r) => sum + r.rating, 0) / trailReviews.length;
      await storage.updateTrailRating(reviewData.trailId, avgRating, trailReviews.length);
      
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  // Trail Alerts routes
  app.get("/api/trail-alerts/active", async (req, res) => {
    try {
      const alerts = await storage.getActiveTrailAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trail alerts" });
    }
  });

  app.get("/api/trail-alerts/trail/:trailId", async (req, res) => {
    try {
      const alerts = await storage.getTrailAlerts(req.params.trailId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trail alerts" });
    }
  });

  app.post("/api/trail-alerts", async (req, res) => {
    try {
      const alertData = insertTrailAlertSchema.parse(req.body);
      const alert = await storage.createTrailAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
