import { Link } from "wouter";
import { Instagram, Twitter, ExternalLink, Youtube } from "lucide-react";
import logoImage from "../assets/youbble-logo.jpg";

export default function Footer() {
  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/releases", label: "Releases" },
    { href: "/demos", label: "Submit Demo" },
    { href: "/services", label: "Services" },
  ];

  const communityLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/podcasts", label: "Podcasts" },
    { href: "#", label: "Events" },
    { href: "#", label: "Merch Store" },
  ];

  const socialLinks = [
    { href: "#", icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
    { href: "#", icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
    { href: "#", icon: <ExternalLink className="w-5 h-5" />, label: "Spotify" },
    { href: "#", icon: <Youtube className="w-5 h-5" />, label: "YouTube" },
  ];

  return (
    <footer className="bg-secondary border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="YouBBle Records Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-heading font-bold text-xl">YouBBle Records</span>
            </div>
            <p className="text-muted-foreground">
              Bold music for a bold future. Empowering artists and communities through authentic sound and social impact.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-accent transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Community</h3>
            <ul className="space-y-2 text-muted-foreground">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-accent transition-colors"
                    data-testid={`footer-community-link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="text-muted-foreground hover:text-accent transition-colors"
                  data-testid={`social-link-${social.label.toLowerCase()}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              hello@youbblerecords.com<br />
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 YouBBle Records. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
