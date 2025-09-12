import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import ScrollingBanner from "@/components/scrolling-banner";
import Carousel from "@/components/carousel";
import { Play, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Release, MerchItem } from "@shared/schema";

export default function HomePage() {
  const [, setLocation] = useLocation();

  const { data: featuredReleases, isLoading: releasesLoading } = useQuery<Release[]>({
    queryKey: ["/api/releases/featured"],
  });

  const { data: merchItems, isLoading: merchLoading } = useQuery<MerchItem[]>({
    queryKey: ["/api/merch"],
  });

  const programsData = [
    {
      icon: "🎤",
      title: "Artist Development",
      description: "Comprehensive support for emerging artists to develop their sound and brand.",
    },
    {
      icon: "❤️",
      title: "Social Impact",
      description: "Music-driven initiatives for positive community change and social awareness.",
    },
    {
      icon: "👥",
      title: "Collaboration Hub",
      description: "Connect artists, producers, and industry professionals for creative partnerships.",
    },
    {
      icon: "🎓",
      title: "Music Education",
      description: "Workshops and resources for music production, business, and creative development.",
    },
  ];

  const getMerchIcon = (category: string, item: MerchItem) => {
    // Use the actual product image instead of emoji
    return (
      <img 
        src={item.image} 
        alt={item.name}
        className="w-full h-full object-cover rounded-lg"
      />
    );
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="font-heading font-black text-6xl md:text-8xl mb-6">
            UNLEASH THE BEAT,
            <span className="text-accent block">JOIN THE MOVEMENT</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Where underground meets mainstream. Where artists become legends. Where music creates impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/releases")}
              className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-heading font-bold hover-glow"
              data-testid="button-explore-releases"
            >
              EXPLORE RELEASES
            </Button>
            <Button 
              onClick={() => setLocation("/demos")}
              variant="outline"
              className="border-2 border-accent text-accent px-8 py-4 rounded-lg font-heading font-bold hover:bg-accent hover:text-accent-foreground transition-all"
              data-testid="button-submit-demo"
            >
              SUBMIT YOUR DEMO
            </Button>
          </div>
        </div>
      </section>

      {/* Programs Banner */}
      <section className="py-16 bg-card border-t border-border overflow-hidden">
        <div className="container mx-auto px-4 mb-8">
          <h2 className="font-heading font-bold text-3xl text-center">Our Programs</h2>
        </div>
        <ScrollingBanner items={programsData} />
      </section>

      {/* Latest Releases */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-bold text-3xl">Latest Releases</h2>
            <Button 
              onClick={() => setLocation("/releases")}
              variant="link"
              className="text-accent hover:text-accent/80 font-semibold"
              data-testid="link-view-all-releases"
            >
              View All →
            </Button>
          </div>
          
          {releasesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card hover-glow">
                  <div className="w-full h-64 bg-muted rounded-t-lg animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-muted/60 rounded mb-4 animate-pulse" />
                    <div className="flex space-x-4">
                      <div className="h-10 w-20 bg-muted rounded animate-pulse" />
                      <div className="flex space-x-2">
                        <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                        <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredReleases?.map((release) => (
                <Card key={release.id} className="bg-card hover-glow group" data-testid={`card-release-${release.id}`}>
                  <img 
                    src={release.coverImage} 
                    alt={`${release.title} cover`} 
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-2">{release.title}</h3>
                    <p className="text-muted-foreground mb-4">Artist: {release.artist}</p>
                    <div className="flex items-center space-x-4">
                      <Button 
                        size="sm"
                        className="bg-accent text-accent-foreground font-semibold"
                        data-testid={`button-preview-${release.id}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <div className="flex space-x-2">
                        <a href={release.spotifyUrl || "#"} className="text-accent hover:text-accent/80" data-testid={`link-spotify-${release.id}`}>
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        <a href={release.appleUrl || "#"} className="text-accent hover:text-accent/80" data-testid={`link-apple-${release.id}`}>
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Merchandise Highlight */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-bold text-3xl">Exclusive Merch</h2>
            <Button 
              variant="link"
              className="text-accent hover:text-accent/80 font-semibold"
              data-testid="link-shop-all-merch"
            >
              Shop All →
            </Button>
          </div>
          
          {merchLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-secondary p-6 hover-glow">
                  <div className="w-full h-32 bg-muted rounded-lg mb-4 animate-pulse" />
                  <div className="h-5 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-muted/60 rounded animate-pulse" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {merchItems?.map((item) => (
                <Card key={item.id} className="bg-secondary p-6 hover-glow" data-testid={`card-merch-${item.id}`}>
                  <div className="w-full h-32 rounded-lg mb-4 overflow-hidden">
                    {getMerchIcon(item.category, item)}
                  </div>
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <p className="text-accent font-bold">{item.price}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
