import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Music } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/releases", label: "Releases" },
    { href: "/projects", label: "Projects" },
    { href: "/demos", label: "Submit Demo" },
    { href: "/services", label: "Services" },
    { href: "/podcasts", label: "Podcasts" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/home" className="flex items-center space-x-3" data-testid="link-home-logo">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">YouBBle</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive(item.href) 
                    ? "text-accent" 
                    : "text-foreground hover:text-accent"
                }`}
                data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6 text-accent" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card border-border">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-semibold transition-colors ${
                        isActive(item.href) 
                          ? "text-accent" 
                          : "text-foreground hover:text-accent"
                      }`}
                      data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
