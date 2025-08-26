import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDemoSubmissionSchema, insertCollaborationRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Demo submission endpoint
  app.post("/api/demos", async (req, res) => {
    try {
      const validatedData = insertDemoSubmissionSchema.parse(req.body);
      const submission = await storage.createDemoSubmission(validatedData);
      res.status(201).json({ success: true, submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Collaboration request endpoint
  app.post("/api/collaborations", async (req, res) => {
    try {
      const validatedData = insertCollaborationRequestSchema.parse(req.body);
      const request = await storage.createCollaborationRequest(validatedData);
      res.status(201).json({ success: true, request });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get releases
  app.get("/api/releases", async (req, res) => {
    try {
      const releases = await storage.getReleases();
      res.json(releases);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch releases" 
      });
    }
  });

  // Get featured releases
  app.get("/api/releases/featured", async (req, res) => {
    try {
      const releases = await storage.getFeaturedReleases();
      res.json(releases);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch featured releases" 
      });
    }
  });

  // Get merch items
  app.get("/api/merch", async (req, res) => {
    try {
      const items = await storage.getMerchItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch merch items" 
      });
    }
  });

  // Get podcast episodes
  app.get("/api/podcasts", async (req, res) => {
    try {
      const episodes = await storage.getPodcastEpisodes();
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch podcast episodes" 
      });
    }
  });

  // Get latest podcast episode
  app.get("/api/podcasts/latest", async (req, res) => {
    try {
      const episode = await storage.getLatestPodcastEpisode();
      if (!episode) {
        res.status(404).json({ 
          success: false, 
          message: "No episodes found" 
        });
        return;
      }
      res.json(episode);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch latest episode" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
