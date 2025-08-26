import { 
  type User, 
  type InsertUser, 
  type DemoSubmission, 
  type InsertDemoSubmission,
  type CollaborationRequest,
  type InsertCollaborationRequest,
  type Release,
  type MerchItem,
  type PodcastEpisode
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createDemoSubmission(demo: InsertDemoSubmission): Promise<DemoSubmission>;
  createCollaborationRequest(request: InsertCollaborationRequest): Promise<CollaborationRequest>;
  getReleases(): Promise<Release[]>;
  getFeaturedReleases(): Promise<Release[]>;
  getMerchItems(): Promise<MerchItem[]>;
  getPodcastEpisodes(): Promise<PodcastEpisode[]>;
  getLatestPodcastEpisode(): Promise<PodcastEpisode | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private demoSubmissions: Map<string, DemoSubmission>;
  private collaborationRequests: Map<string, CollaborationRequest>;
  private releases: Release[];
  private merchItems: MerchItem[];
  private podcastEpisodes: PodcastEpisode[];

  constructor() {
    this.users = new Map();
    this.demoSubmissions = new Map();
    this.collaborationRequests = new Map();
    
    // Initialize with some sample data
    this.releases = [
      {
        id: "1",
        title: "Midnight Frequencies",
        artist: "NEON PULSE",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        releaseDate: "March 2024",
        genres: ["Electronic", "Ambient"],
        spotifyUrl: "#",
        appleUrl: "#",
        youtubeUrl: "#",
        featured: true,
      },
      {
        id: "2",
        title: "Electric Dreams",
        artist: "SYNTH WAVES",
        coverImage: "https://pixabay.com/get/g70a81b4e62bbc5ee0fd1c04bd2dad27b44652ebdd212f4d66d8ab185d87dcb307784c269ca2490cda9d041a4e724fbd15e905b4b5be7888165401c8c6fb2cfaf_1280.jpg",
        releaseDate: "February 2024",
        genres: ["Synthwave", "Electronic"],
        spotifyUrl: "#",
        appleUrl: "#",
        youtubeUrl: "#",
        featured: true,
      },
      {
        id: "3",
        title: "Urban Echoes",
        artist: "METRO SOUND",
        coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        releaseDate: "January 2024",
        genres: ["Hip-Hop", "Urban"],
        spotifyUrl: "#",
        appleUrl: "#",
        youtubeUrl: "#",
        featured: true,
      },
    ];

    this.merchItems = [
      {
        id: "1",
        name: "YouBBle Tee",
        price: "$29.99",
        image: "tshirt",
        category: "apparel",
      },
      {
        id: "2",
        name: "Signature Cap",
        price: "$24.99",
        image: "cap",
        category: "apparel",
      },
      {
        id: "3",
        name: "Vinyl Collection",
        price: "$39.99",
        image: "vinyl",
        category: "music",
      },
      {
        id: "4",
        name: "Studio Mug",
        price: "$19.99",
        image: "mug",
        category: "accessories",
      },
    ];

    this.podcastEpisodes = [
      {
        id: "1",
        title: "The Future of Underground Music",
        guest: "DJ NEXUS",
        duration: "45:32",
        coverImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        publishDate: "March 22, 2024",
        description: "Exploring the evolution of underground music and its impact on mainstream culture.",
      },
      {
        id: "2",
        title: "Building Your Brand in 2024",
        guest: "Sarah Chen, Music Marketer",
        duration: "38:42",
        coverImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        publishDate: "March 15, 2024",
        description: "Essential strategies for building a strong music brand in the digital age.",
      },
      {
        id: "3",
        title: "The Art of Collaboration",
        guest: "Producer Mike Torres",
        duration: "42:15",
        coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        publishDate: "March 8, 2024",
        description: "How to create meaningful collaborations in the music industry.",
      },
    ];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDemoSubmission(demo: InsertDemoSubmission): Promise<DemoSubmission> {
    const id = randomUUID();
    const submission: DemoSubmission = { 
      ...demo, 
      id, 
      submittedAt: new Date() 
    };
    this.demoSubmissions.set(id, submission);
    return submission;
  }

  async createCollaborationRequest(request: InsertCollaborationRequest): Promise<CollaborationRequest> {
    const id = randomUUID();
    const collaboration: CollaborationRequest = { 
      ...request, 
      id, 
      submittedAt: new Date() 
    };
    this.collaborationRequests.set(id, collaboration);
    return collaboration;
  }

  async getReleases(): Promise<Release[]> {
    return this.releases;
  }

  async getFeaturedReleases(): Promise<Release[]> {
    return this.releases.filter(release => release.featured);
  }

  async getMerchItems(): Promise<MerchItem[]> {
    return this.merchItems;
  }

  async getPodcastEpisodes(): Promise<PodcastEpisode[]> {
    return this.podcastEpisodes;
  }

  async getLatestPodcastEpisode(): Promise<PodcastEpisode | undefined> {
    return this.podcastEpisodes[0];
  }
}

export const storage = new MemStorage();
