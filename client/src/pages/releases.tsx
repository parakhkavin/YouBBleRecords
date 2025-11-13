import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Release } from "@shared/schema";

export default function ReleasesPage() {
  const { data: releases, isLoading } = useQuery<Release[]>({
    queryKey: ["/api/releases"],
  });

  return (
    <div className="pt-20">
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-12 text-center">
            Our <span className="text-accent">Releases</span>
          </h1>
           
           {/* Resident Artists */}
           <div className="mb-12">
             <h2 className="font-heading font-bold text-3xl mb-4 text-center">Resident Artists</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="bg-card hover-glow">
                 <CardContent className="p-6 text-center">
                   <h3 className="font-heading text-xl mb-2">Naiya Skye</h3>
                   <p className="text-muted-foreground text-sm">Resident artist at YouBBle Records.</p>
                 </CardContent>
               </Card>
               <Card className="bg-card hover-glow">
                 <CardContent className="p-6 text-center">
                   <h3 className="font-heading text-xl mb-2">Smriti Shrestha</h3>
                   <p className="text-muted-foreground text-sm">Resident artist at YouBBle Records.</p>
                 </CardContent>
               </Card>
               <Card className="bg-card hover-glow">
                 <CardContent className="p-6 text-center">
                   <h3 className="font-heading text-xl mb-2">Tero Bau</h3>
                   <p className="text-muted-foreground text-sm">Resident artist at YouBBle Records.</p>
                 </CardContent>
               </Card>
             </div>
           </div>
 
           {/* Curated Playlists */}
           <div className="mb-12">
             <h2 className="font-heading font-bold text-3xl mb-4 text-center">Curated Playlists</h2>
             <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
               Submit your track for review and be considered for our curated playlists. Terms and conditions apply.
             </p>
             <div className="flex justify-center gap-4">
               <Button
                 onClick={() => window.open("#", "_blank")}
                 className="bg-accent text-accent-foreground font-heading font-bold hover-glow"
               >
                 Listen to Playlists
               </Button>
               <Button
                 variant="outline"
                 onClick={() => window.open("/demos", "_self")}
                 className="border-accent text-accent font-heading font-bold hover-glow"
               >
                 Submit Your Track
               </Button>
             </div>
           </div>
 
           {/* Hear It First */}
           <div className="mb-12">
             <h2 className="font-heading font-bold text-3xl mb-4 text-center">Hear It First</h2>
             <p className="text-muted-foreground text-center mb-4">
               Get notified of our events and releases in the future.
             </p>
             {/* Placeholder email capture for now */}
             <div className="flex flex-col sm:flex-row gap-3 justify-center">
               <Input
                 type="email"
                 placeholder="Enter your email"
                 className="max-w-xs bg-input border-border"
               />
               <Button className="bg-accent text-accent-foreground font-heading font-bold hover-glow">
                 Join Guestlist
               </Button>
             </div>
           </div>
 
           {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-card hover-glow">
                  <div className="w-full h-64 bg-muted rounded-t-lg animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-muted/60 rounded mb-2 animate-pulse" />
                    <div className="h-3 bg-muted/40 rounded mb-4 animate-pulse" />
                    <div className="flex space-x-4 mb-4">
                      <div className="h-10 w-20 bg-muted rounded animate-pulse" />
                      <div className="flex space-x-2">
                        <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                        <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                        <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                      <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : releases && releases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {releases.map((release) => (
                <Card key={release.id} className="bg-card overflow-hidden hover-glow group" data-testid={`card-release-${release.id}`}>
                  <img 
                    src={release.coverImage} 
                    alt={`${release.title} artwork`} 
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-2">{release.title}</h3>
                    <p className="text-muted-foreground mb-2">{release.artist}</p>
                    <p className="text-sm text-muted-foreground mb-4">Released: {release.releaseDate}</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <Button 
                        size="sm"
                        className="bg-accent text-accent-foreground font-semibold flex items-center"
                        data-testid={`button-preview-${release.id}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <div className="flex space-x-2">
                        <a 
                          href={release.spotifyUrl ?? undefined}
                          className="text-accent hover:text-accent/80 text-xl"
                          data-testid={`link-spotify-${release.id}`}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        <a 
                          href={release.appleUrl ?? undefined}
                          className="text-accent hover:text-accent/80 text-xl"
                          data-testid={`link-apple-${release.id}`}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        <a 
                          href={release.youtubeUrl ?? undefined}
                          className="text-accent hover:text-accent/80 text-xl"
                          data-testid={`link-youtube-${release.id}`}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {release.genres?.map((genre) => (
                        <Badge key={genre} variant="secondary" className="bg-secondary text-secondary-foreground">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-muted-foreground mb-4">No releases available yet</h3>
              <p className="text-muted-foreground">Check back soon for new music releases!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
