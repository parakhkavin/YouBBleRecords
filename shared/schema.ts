import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const demoSubmissions = pgTable("demo_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  artistName: text("artist_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  genres: text("genres"),
  socialLinks: text("social_links"),
  bio: text("bio").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const collaborationRequests = pgTable("collaboration_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  collaborationType: text("collaboration_type").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const releases = pgTable("releases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  coverImage: text("cover_image").notNull(),
  releaseDate: text("release_date").notNull(),
  genres: text("genres").array(),
  spotifyUrl: text("spotify_url"),
  appleUrl: text("apple_url"),
  youtubeUrl: text("youtube_url"),
  featured: boolean("featured").default(false),
});

export const merchItems = pgTable("merch_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
});

export const podcastEpisodes = pgTable("podcast_episodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  guest: text("guest"),
  duration: text("duration").notNull(),
  coverImage: text("cover_image").notNull(),
  publishDate: text("publish_date").notNull(),
  description: text("description"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDemoSubmissionSchema = createInsertSchema(demoSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertCollaborationRequestSchema = createInsertSchema(collaborationRequests).omit({
  id: true,
  submittedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DemoSubmission = typeof demoSubmissions.$inferSelect;
export type InsertDemoSubmission = z.infer<typeof insertDemoSubmissionSchema>;
export type CollaborationRequest = typeof collaborationRequests.$inferSelect;
export type InsertCollaborationRequest = z.infer<typeof insertCollaborationRequestSchema>;
export type Release = typeof releases.$inferSelect;
export type MerchItem = typeof merchItems.$inferSelect;
export type PodcastEpisode = typeof podcastEpisodes.$inferSelect;

// Competition schema, BRD compliance
export type CompetitionCategory = "Open" | "Teen" | "Cover" | "Sync";
export type EntryStatus = "pending" | "qualified" | "disqualified";

export interface CompetitionEntryDTO {
  id?: number;
  artistName: string;
  email: string;
  songTitle: string;
  streamUrl?: string;
  lyrics?: string;
  isCover: boolean;
  coverDetails?: string;
  categories: CompetitionCategory[];
  dob?: string; // ISO date
  parentalConsentUrl?: string;
  audioUrl: string;
  paymentId?: string;
  status: EntryStatus;
  createdAt?: string;
}

export interface JudgeScoreDTO {
  id?: number;
  entryId: number;
  judgeId: string; // email or uuid
  criteria: { name: string; score: number }[];
  total: number;
  createdAt?: string;
}

