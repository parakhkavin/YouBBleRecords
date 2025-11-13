import {
  storage,
  saveUpload,
  createCompetitionEntry,
  listCompetitionEntries,
  getCompetitionEntry,
} from "./storage";

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { insertDemoSubmissionSchema, insertCollaborationRequestSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

import { createPaymentIntent } from "./payments.ts";



/* ------------------------------------------------------------------
   SETTINGS: competition submission deadline and file constraints
-------------------------------------------------------------------*/
const SETTINGS = {
  deadlineISO: "2025-12-31T23:59:59Z", // last allowed submission
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB cap per BRD
});

/* ------------------------------------------------------------------
   ROUTE REGISTRATION
-------------------------------------------------------------------*/
export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/competition/payment-intent", createPaymentIntent);

  /* ---------------------- DEMO SUBMISSION ---------------------- */
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
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  });

  /* ---------------------- COLLABORATION REQUEST ---------------------- */
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
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  });

  /* ---------------------- RELEASES ---------------------- */
  app.get("/api/releases", async (_req, res) => {
    try {
      const releases = await storage.getReleases();
      res.json(releases);
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch releases" });
    }
  });

  app.get("/api/releases/featured", async (_req, res) => {
    try {
      const releases = await storage.getFeaturedReleases();
      res.json(releases);
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch featured releases" });
    }
  });

  /* ---------------------- MERCH ---------------------- */
  app.get("/api/merch", async (_req, res) => {
    try {
      const items = await storage.getMerchItems();
      res.json(items);
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch merch items" });
    }
  });

  /* ---------------------- PODCASTS ---------------------- */
  app.get("/api/podcasts", async (_req, res) => {
    try {
      const episodes = await storage.getPodcastEpisodes();
      res.json(episodes);
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch podcast episodes" });
    }
  });

  app.get("/api/podcasts/latest", async (_req, res) => {
    try {
      const episode = await storage.getLatestPodcastEpisode();
      if (!episode) {
        return res.status(404).json({ success: false, message: "No episodes found" });
      }
      res.json(episode);
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch latest episode" });
    }
  });

  /* ------------------------------------------------------------------
     MUSIC COMPETITION ENDPOINTS (BRD COMPLIANCE)
  -------------------------------------------------------------------*/

  // Create payment intent (demo stub)
  app.post("/api/competition/payment-intent", async (req, res) => {
    try {
      const { amount, currency } = req.body || {};
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      // TODO: integrate Stripe or PayPal later
      const clientSecret = `demo_${Date.now()}`;
      return res.json({ clientSecret });
    } catch {
      return res.status(500).json({ error: "Payment init failed" });
    }
  });

  // Submit competition entry
  app.post(
    "/api/competition/submit",
    upload.fields([
      { name: "file", maxCount: 1 },
      { name: "consentFile", maxCount: 1 },
    ]),
    async (
      req,
      res
    ) => {
      try {
        // Late submission guard
        const now = new Date();
        const deadline = new Date(SETTINGS.deadlineISO);
        if (now > deadline) {
          return res.status(400).json({ error: "Late submission rejected" });
        }

        const body = req.body as any;
        const file = (req.files as any)?.file?.[0];
        const consent = (req.files as any)?.consentFile?.[0];

        /* ---------------------- Validation ---------------------- */
        const categories: string[] = JSON.parse(body.categories || "[]");
        if (!body.artistName || !body.email || !body.songTitle) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        if (!file) {
          return res.status(400).json({ error: "Audio file required" });
        }

        const okExt =
          file.originalname.toLowerCase().endsWith(".mp3") ||
          file.originalname.toLowerCase().endsWith(".m4a");
        const okMime = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/aac"].includes(
          file.mimetype
        );
        if (!okExt && !okMime) {
          return res.status(400).json({ error: "Invalid format, only MP3 or M4A" });
        }

        // Sync category rule
        if (categories.includes("Sync") && categories.length < 2) {
          return res.status(400).json({ error: "Sync requires another category" });
        }

        // Teen category rule
        if (categories.includes("Teen")) {
          if (!body.dob) return res.status(400).json({ error: "DOB required for Teen category" });
          if (!consent) {
            return res.status(400).json({ error: "Parental consent file required for Teen category" });
          }
        }

        // Payment validation
        if (!body.paymentClientSecret) {
          return res.status(400).json({ error: "Payment proof missing" });
        }

        /* ---------------------- Save uploads ---------------------- */
        const audioPath = await saveUpload(file);
        let consentPath: string | undefined;
        if (consent) consentPath = await saveUpload(consent, "consents");

        // Persist the entry (no-modification lock is enforced in storage)
        const entry = await createCompetitionEntry({
          artistName: body.artistName,
          email: body.email,
          songTitle: body.songTitle,
          streamUrl: body.streamUrl || "",
          lyrics: body.lyrics || "",
          categories,
          dob: body.dob || "",
          audioPath,
          consentPath,
          paymentClientSecret: body.paymentClientSecret,
          paid: !!body.paid, // will be false in current flow; set true via webhook later
        });

        // TODO: send confirmation email

        return res.json({
          ok: true,
          message: "Submission received successfully",
          id: entry.id,
          createdAt: entry.createdAt,
          audioPath,
          consentPath,
        });

      } catch (error) {
        console.error("Competition submission error:", error);
        return res.status(500).json({ error: "Submission failed" });
      }
    }
  );

  /* ---------------------- CREATE SERVER ---------------------- */
    // --- Admin Read APIs (Phase 1) ---
  app.get("/api/competition/entries", async (_req, res) => {
    try {
      const rows = await listCompetitionEntries();
      // Minimal redaction example; you might show everything to admins later.
      return res.json(rows);
    } catch (e) {
      return res.status(500).json({ error: "Failed to list entries" });
    }
  });

  app.get("/api/competition/entry/:id", async (req, res) => {
    try {
      const row = await getCompetitionEntry(req.params.id);
      if (!row) return res.status(404).json({ error: "Not found" });
      return res.json(row);
    } catch (e) {
      return res.status(500).json({ error: "Failed to fetch entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
