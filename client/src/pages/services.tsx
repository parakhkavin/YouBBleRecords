import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Mic, Sliders, Volume2, Megaphone } from "lucide-react";

export default function ServicesPage() {
  const serviceTiers = [
    {
      name: "Starter Kit",
      price: "$299",
      description: "Perfect for emerging artists",
      featured: false,
      features: [
        "2 Track Production",
        "Basic Mixing & Mastering",
        "Cover Art Design",
        "Digital Distribution",
        "Basic Promotion Package",
      ],
    },
    {
      name: "Serious Business Kit",
      price: "$799",
      description: "For dedicated professionals",
      featured: true,
      features: [
        "5 Track Production",
        "Professional Mixing & Mastering",
        "Custom Cover Art & Branding",
        "Wide Distribution Network",
        "Premium Promotion Campaign",
        "Music Video Production",
        "3 Months Label Support",
      ],
    },
    {
      name: "Custom Solutions",
      price: "Custom",
      description: "Tailored to your needs",
      featured: false,
      features: [
        "Full Album Production",
        "Tour Management",
        "Brand Partnership Deals",
        "International Distribution",
        "Dedicated A&R Support",
        "Long-term Career Strategy",
      ],
    },
  ];

  const additionalServices = [
    {
      icon: <Mic className="w-8 h-8" />,
      name: "Studio Sessions",
      description: "Professional recording time",
      price: "$150/hour",
    },
    {
      icon: <Sliders className="w-8 h-8" />,
      name: "Mixing Only",
      description: "Track mixing service",
      price: "$200/track",
    },
    {
      icon: <Volume2 className="w-8 h-8" />,
      name: "Mastering Only",
      description: "Final polish service",
      price: "$100/track",
    },
    {
      icon: <Megaphone className="w-8 h-8" />,
      name: "Promotion Campaign",
      description: "Marketing push",
      price: "$500+",
    },
  ];

  const handleServiceSelect = (serviceName: string) => {
    // In a real app, this would redirect to a payment gateway
    alert(`Redirecting to payment gateway for ${serviceName}...`);
  };

  return (
    <div className="pt-20">
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-8 text-center">
            Our <span className="text-accent">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Professional music services designed to elevate your artistry and accelerate your career.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {serviceTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`bg-card rounded-xl p-8 hover-glow relative ${
                  tier.featured ? 'border-2 border-accent' : 'border-2 border-border'
                }`}
                data-testid={`card-service-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground px-4 py-2 text-sm font-bold">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <h3 className="font-heading font-bold text-2xl mb-2">{tier.name}</h3>
                    <div className="text-4xl font-black text-accent mb-4">{tier.price}</div>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleServiceSelect(tier.name)}
                    className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-heading font-bold hover-glow"
                    data-testid={`button-select-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {tier.name === "Custom Solutions" ? "Contact Us" : 
                     tier.name === "Starter Kit" ? "Get Started" : "Level Up"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Services */}
          <div className="mt-16">
            <h2 className="font-heading font-bold text-3xl text-center mb-8">Additional Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map((service, index) => (
                <Card 
                  key={index} 
                  className="bg-secondary rounded-lg p-6 text-center hover-glow"
                  data-testid={`card-additional-service-${index}`}
                >
                  <CardContent className="p-0">
                    <div className="text-accent mb-4 flex justify-center">
                      {service.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                    <p className="text-accent font-bold">{service.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
