import { useLocation } from "wouter";
import AnimatedLogo from "@/components/animated-logo";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const enterSite = () => {
    setLocation("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-8">
          <AnimatedLogo />
        </div>
        <h1 className="font-heading font-black text-5xl md:text-7xl mb-4 text-foreground">
          You<span className="text-accent">BB</span>le Records
        </h1>
        <p className="text-muted-foreground text-xl mb-8 font-accent">
          Empowering Sound, Celebrating Culture
        </p>
        <Button 
          onClick={enterSite}
          className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-heading font-bold text-lg hover-glow transition-all duration-300"
          data-testid="button-enter-site"
        >
          ENTER THE EXPERIENCE
        </Button>
      </div>
    </div>
  );
}
