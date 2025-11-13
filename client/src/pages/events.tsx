import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EventsPage() {
  return (
    <div className="pt-20">
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-8 text-center">
            <span className="text-accent">Events</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-card">
              <CardContent className="p-6">
                <h2 className="font-heading font-bold text-2xl mb-4">Upcoming Events</h2>
                <p className="text-muted-foreground text-sm">
                  Stay tuned for upcoming YouBBle Records events, showcases, and listening sessions.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-6">
                <h2 className="font-heading font-bold text-2xl mb-4">Past Events</h2>
                <p className="text-muted-foreground text-sm">
                  A catalog of past performances, workshops, and experiences will be listed here.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-secondary rounded-xl p-8 md:p-10">
            <CardContent className="p-0">
              <h2 className="font-heading font-bold text-3xl mb-4 text-center">Join Guestlist</h2>
              <p className="text-muted-foreground text-center mb-6">
                Get notified of our events and releases in the future.
              </p>
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
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
