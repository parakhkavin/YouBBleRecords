import fs from "node:fs";
import path from "node:path";
import type { Express } from "express";

/**
 * Simple, durable, file-based storage for development.
 * - Files saved to server/uploads/{subdir}/<timestamp>__<safeName>
 * - Records saved to server/data/entries.json
 *
 * Upgrade path:
 * - Swap these functions to use Drizzle ORM later (keep the same method signatures).
 */

import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, ".");

const DATA_DIR = path.join(ROOT, "data");
const UPLOADS_DIR = path.join(ROOT, "uploads");
const ENTRIES_PATH = path.join(DATA_DIR, "entries.json");

// Ensure folders exist at module load
for (const dir of [DATA_DIR, UPLOADS_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
if (!fs.existsSync(ENTRIES_PATH)) fs.writeFileSync(ENTRIES_PATH, "[]", "utf-8");

// ---------- Types ----------
export type CompetitionEntryStatus = "pending" | "disqualified" | "withdrawn";

export type CompetitionEntry = {
  id: string;                // uuid-ish
  createdAt: string;         // ISO
  artistName: string;
  email: string;
  songTitle: string;
  streamUrl?: string;
  lyrics?: string;
  categories: string[];
  dob?: string;
  audioPath: string;         // relative path under uploads/
  consentPath?: string;      // relative path under uploads/
  paymentClientSecret: string;
  paid: boolean;             // we’ll keep false/true; webhook later
  status: CompetitionEntryStatus;
  locked: boolean;           // "no modification after submission"
};

export type CreateEntryInput = Omit<CompetitionEntry,
  "id" | "createdAt" | "status" | "locked"
> & {};

// ---------- Helpers ----------
function readEntries(): CompetitionEntry[] {
  const raw = fs.readFileSync(ENTRIES_PATH, "utf-8");
  return JSON.parse(raw) as CompetitionEntry[];
}

function writeEntries(rows: CompetitionEntry[]) {
  fs.writeFileSync(ENTRIES_PATH, JSON.stringify(rows, null, 2), "utf-8");
}

function safeName(original: string) {
  // strip path, then sanitize
  const base = original.replace(/[/\\]+/g, "_");
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function nowISO() {
  return new Date().toISOString();
}

function genId() {
  // compact unique id
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2, 8);
}

// ---------- Public API ----------
export async function saveUpload(file: Express.Multer.File, subdir = "audio"): Promise<string> {
  const dir = path.join(UPLOADS_DIR, subdir);
  ensureDir(dir);

  const stamp = Date.now();
  const destName = `${stamp}__${safeName(file.originalname || "upload.bin")}`;
  const destPath = path.join(dir, destName);

  // file.buffer present due to memoryStorage
  fs.writeFileSync(destPath, file.buffer);
  // return relative path for portability
  const rel = path.relative(ROOT, destPath);
  return rel;
}

/**
 * Create a new entry, lock it immediately (no modification allowed).
 * Throws if a conflicting/duplicate entry is detected (same email+songTitle).
 */
export async function createCompetitionEntry(input: CreateEntryInput): Promise<CompetitionEntry> {
  const rows = readEntries();

  // Simple duplicate rule: same email + song title not allowed (business choice)
  const dupe = rows.find(r =>
    r.email.toLowerCase() === input.email.toLowerCase() &&
    r.songTitle.trim().toLowerCase() === input.songTitle.trim().toLowerCase()
  );
  if (dupe) {
    throw Object.assign(new Error("Duplicate entry: this song has already been submitted by this email."), { status: 409 });
  }

  const entry: CompetitionEntry = {
    id: genId(),
    createdAt: nowISO(),
    artistName: input.artistName,
    email: input.email,
    songTitle: input.songTitle,
    streamUrl: input.streamUrl || "",
    lyrics: input.lyrics || "",
    categories: input.categories || [],
    dob: input.dob || "",
    audioPath: input.audioPath,
    consentPath: input.consentPath,
    paymentClientSecret: input.paymentClientSecret,
    paid: !!input.paid,
    status: "pending",
    locked: true, // enforce "no modification after submission"
  };

  rows.push(entry);
  writeEntries(rows);
  return entry;
}

export async function listCompetitionEntries(): Promise<CompetitionEntry[]> {
  return readEntries();
}

export async function getCompetitionEntry(id: string): Promise<CompetitionEntry | undefined> {
  return readEntries().find(r => r.id === id);
}

// Example stubs you already use elsewhere (demos/collaborations/releases/etc.)
export const storage = {
  async createDemoSubmission(data: any) {
    const file = path.join(DATA_DIR, "demos.json");
    if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf-8");
    const arr = JSON.parse(fs.readFileSync(file, "utf-8"));
    arr.push({ id: genId(), createdAt: nowISO(), ...data });
    fs.writeFileSync(file, JSON.stringify(arr, null, 2), "utf-8");
    return arr[arr.length - 1];
  },
  async createCollaborationRequest(data: any) {
    const file = path.join(DATA_DIR, "collaborations.json");
    if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf-8");
    const arr = JSON.parse(fs.readFileSync(file, "utf-8"));
    arr.push({ id: genId(), createdAt: nowISO(), ...data });
    fs.writeFileSync(file, JSON.stringify(arr, null, 2), "utf-8");
    return arr[arr.length - 1];
  },
  async getReleases() {
    const file = path.join(DATA_DIR, "releases.json");
    if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf-8");
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  },
  async getFeaturedReleases() {
    const all = await this.getReleases();
    return all.filter((r: any) => r.featured);
  },
  async getMerchItems() {
    const file = path.join(DATA_DIR, "merch.json");
    if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf-8");
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  },
  async getPodcastEpisodes() {
    const file = path.join(DATA_DIR, "podcasts.json");
    if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf-8");
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  },
  async getLatestPodcastEpisode() {
    const eps = await this.getPodcastEpisodes();
    // naive latest by createdAt
    return eps.sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || ""))[0];
  },
};
