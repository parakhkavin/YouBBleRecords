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
        title: "Electric Storm",
        artist: "NEXXA",
        coverImage: "/src/assets/release1.png",
        releaseDate: "March 2024",
        genres: ["Electronic", "Bass"],
        spotifyUrl: "#",
        appleUrl: "#",
        youtubeUrl: "#",
        featured: true,
      },
      {
        id: "2", 
        title: "Underground Vibes",
        artist: "DarkTunes",
        coverImage: "/src/assets/release2.png",
        releaseDate: "February 2024",
        genres: ["Hip-Hop", "Underground"],
        spotifyUrl: "#",
        appleUrl: "#",
        youtubeUrl: "#",
        featured: true,
      },
      {
        id: "3",
        title: "Cosmic Beats",
        artist: "ZEPHYR",
        coverImage: "/src/assets/release1.png",
        releaseDate: "January 2024",
        genres: ["Ambient", "Electronic"],
        spotifyUrl: "#",
        appleUrl: "#",
        youtubeUrl: "#",
        featured: true,
      },
    ];

    this.merchItems = [
      {
        id: "1",
        name: "YouBBle Record Tee",
        price: "$29.99",
        image: "/src/assets/merch-tshirt.png",
        category: "apparel",
      },
      {
        id: "2",
        name: "Vinyl Glow Hoodie", 
        price: "$49.99",
        image: "/src/assets/merch-hoodie.png",
        category: "apparel",
      },
      {
        id: "3",
        name: "Limited Edition Vinyl",
        price: "$39.99",
        image: "/src/assets/release1.png",
        category: "music",
      },
      {
        id: "4",
        name: "Artist Collection Cap",
        price: "$24.99",
        image: "/src/assets/youbble-logo.png",
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
      genres: demo.genres || null,
      location: demo.location || null,
      phone: demo.phone || null,
      socialLinks: demo.socialLinks || null,
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
