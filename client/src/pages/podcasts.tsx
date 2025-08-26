import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2, Share } from "lucide-react";
import { useState } from "react";
import type { PodcastEpisode } from "@shared/schema";

export default function PodcastsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("15:20");

  const { data: latestEpisode, isLoading: latestLoading } = useQuery<PodcastEpisode>({
    queryKey: ["/api/podcasts/latest"],
  });

  const { data: episodes, isLoading: episodesLoading } = useQuery<PodcastEpisode[]>({
    queryKey: ["/api/podcasts"],
  });

  const upcomingShows = [
    {
      title: "Live from the Studio",
      date: "March 22, 2024 at 7:00 PM",
      description: "Join us for a live recording session with special guests and audience Q&A.",
      type: "LIVE",
    },
    {
      title: "Industry Roundtable",
      date: "March 29, 2024 at 6:00 PM",
      description: "Panel discussion with label executives, artists, and industry professionals.",
      type: "UPCOMING",
    },
  ];

  const subscriptionPlatforms = [
    { name: "Spotify", icon: "🎵" },
    { name: "Apple Podcasts", icon: "🍎" },
    { name: "Google Podcasts", icon: "🔍" },
    { name: "RSS Feed", icon: "📡" },
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="pt-20">
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-8 text-center">
            YouBBle <span className="text-accent">Podcasts</span>
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Dive deep into the music industry with our weekly shows featuring artist interviews, industry insights, and behind-the-scenes content.
          </p>

          {/* Featured Podcast Player */}
          <Card className="bg-card rounded-xl p-8 mb-16 max-w-4xl mx-auto">
            <CardContent className="p-0">
              <h2 className="font-heading font-bold text-2xl mb-6 text-center">Latest Episode</h2>
              
              {latestLoading ? (
                <Card className="bg-secondary rounded-lg p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-20 h-20 bg-muted rounded-lg animate-pulse" />
                      <div className="flex-1">
                        <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                        <div className="h-4 bg-muted/60 rounded mb-1 animate-pulse" />
                        <div className="h-3 bg-muted/40 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                        <div className="flex-1 h-2 bg-muted rounded-full animate-pulse" />
                        <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : latestEpisode ? (
                <Card className="bg-secondary rounded-lg p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-4 mb-6">
                      <img 
                        src={latestEpisode.coverImage} 
                        alt="Podcast episode cover" 
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{latestEpisode.title}</h3>
                        <p className="text-muted-foreground">with Guest: {latestEpisode.guest}</p>
                        <p className="text-sm text-muted-foreground">Duration: {latestEpisode.duration}</p>
                      </div>
                    </div>
                    
                    {/* Mock Audio Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Button 
                          onClick={togglePlay}
                          className="bg-accent text-accent-foreground w-12 h-12 rounded-full flex items-center justify-center hover-glow p-0"
                          data-testid="button-play-pause"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <div className="flex-1 bg-muted rounded-full h-2 relative">
                          <div className="bg-accent h-2 rounded-full w-1/3"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">{currentTime} / {latestEpisode.duration}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                            <SkipForward className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No episodes available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Episode List and Upcoming Shows */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-6">Recent Episodes</h2>
              {episodesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-card p-6 hover-glow">
                      <CardContent className="p-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-muted rounded-lg animate-pulse" />
                          <div className="flex-1">
                            <div className="h-5 bg-muted rounded mb-2 animate-pulse" />
                            <div className="h-4 bg-muted/60 rounded mb-1 animate-pulse" />
                            <div className="h-3 bg-muted/40 rounded animate-pulse" />
                          </div>
                          <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {episodes?.slice(1).map((episode) => (
                    <Card key={episode.id} className="bg-card p-6 hover-glow" data-testid={`card-episode-${episode.id}`}>
                      <CardContent className="p-0">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={episode.coverImage} 
                            alt="Episode cover" 
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{episode.title}</h3>
                            <p className="text-muted-foreground text-sm mb-1">Guest: {episode.guest}</p>
                            <p className="text-xs text-muted-foreground">{episode.publishDate} • {episode.duration}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-accent hover:text-accent/80"
                            data-testid={`button-play-episode-${episode.id}`}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Shows */}
            <div>
              <h2 className="font-heading font-bold text-2xl mb-6">Upcoming Shows</h2>
              <div className="space-y-4">
                {upcomingShows.map((show, index) => (
                  <Card key={index} className="bg-secondary rounded-lg p-6 hover-glow" data-testid={`card-upcoming-show-${index}`}>
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{show.title}</h3>
                          <p className="text-muted-foreground text-sm">{show.date}</p>
                        </div>
                        <Badge 
                          className={
                            show.type === "LIVE" 
                              ? "bg-accent text-accent-foreground" 
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {show.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{show.description}</p>
                      <Button 
                        className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover-glow"
                        data-testid={`button-${show.type === "LIVE" ? "add-to-calendar" : "rsvp"}-${index}`}
                      >
                        {show.type === "LIVE" ? "Add to Calendar" : "RSVP Now"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Subscribe Section */}
          <Card className="bg-secondary rounded-xl p-8 text-center">
            <CardContent className="p-0">
              <h2 className="font-heading font-bold text-3xl mb-4">Never Miss an Episode</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Subscribe to YouBBle Podcasts and get notified when new episodes drop. Available on all major podcast platforms.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {subscriptionPlatforms.map((platform) => (
                  <Button 
                    key={platform.name}
                    className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover-glow flex items-center"
                    data-testid={`button-subscribe-${platform.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <span className="mr-2">{platform.icon}</span>
                    {platform.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
