import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check, Download } from "lucide-react";
import playlistIcon from "../assets/project-playlist.png";
import storeIcon from "../assets/project-store.png";

export default function ProjectsPage() {
  const [, setLocation] = useLocation();

  const projectsData = [
    {
      icon: <img src={playlistIcon} alt="Playlist" className="w-8 h-8" />,
      title: "Curated Playlists",
      description: "Monthly curated playlists featuring our artists and underground gems we're passionate about.",
      buttonText: "Listen Now",
      action: () => window.open("#", "_blank"),
    },
    {
      icon: <img src={storeIcon} alt="Store" className="w-8 h-8" />,
      title: "Merch Store", 
      description: "Exclusive artist merchandise and YouBBle Records branded items designed by our creative community.",
      buttonText: "Shop Now",
      action: () => setLocation("/merch"),
    },
    {
      icon: <img src={storeIcon} alt="Contact" className="w-8 h-8" />,
      title: "Direct Contact",
      description: "Get in touch for collaborations, booking inquiries, or partnership opportunities.",
      buttonText: "Contact Us",
      action: () => setLocation("/about"),
    },
    {
      icon: <img src={playlistIcon} alt="Pricing" className="w-8 h-8" />,
      title: "Service Pricing",
      description: "Transparent pricing for our production, marketing, and artist development services.",
      buttonText: "View Pricing", 
      action: () => setLocation("/services"),
    },
  ];

  const socialImpactFeatures = [
    "Educational music programs for underserved communities",
    "Mental health awareness through music therapy",
    "Environmental sustainability in music production",
    "Social justice advocacy platform",
  ];

  return (
    <div className="pt-20">
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-12 text-center">
            Our <span className="text-accent">Projects</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {projectsData.map((project, index) => (
              <Card key={index} className="bg-card rounded-xl p-8 hover-glow" data-testid={`card-project-${index}`}>
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mb-6 text-accent-foreground">
                    {project.icon}
                  </div>
                  <h3 className="font-heading font-bold text-2xl mb-4">{project.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {project.description}
                  </p>
                  <Button 
                    onClick={project.action}
                    className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover-glow"
                    data-testid={`button-${project.buttonText.toLowerCase().replace(' ', '-')}`}
                  >
                    {project.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Social Impact Kit Section */}
          <Card className="bg-secondary rounded-xl p-8 md:p-12">
            <CardContent className="p-0">
              <h2 className="font-heading font-bold text-3xl mb-6 text-center">Social Impact Kit</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-heading font-bold text-xl mb-4 text-accent">Empowering Communities Through Music</h3>
                  <p className="text-muted-foreground mb-6">
                    Our comprehensive social impact toolkit includes educational resources, community programs, and direct action initiatives that use music as a catalyst for positive change.
                  </p>
                  <div className="space-y-4 mb-6">
                    {socialImpactFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-heading font-bold hover-glow"
                    data-testid="button-download-apk"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download APK
                  </Button>
                </div>
                <div className="text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                    alt="Community music event" 
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
