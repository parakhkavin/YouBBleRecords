import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCollaborationRequestSchema, type InsertCollaborationRequest } from "@shared/schema";

export default function AboutPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertCollaborationRequest>({
    resolver: zodResolver(insertCollaborationRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      collaborationType: "",
      message: "",
    },
  });

  const collaborationMutation = useMutation({
    mutationFn: async (data: InsertCollaborationRequest) => {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/collaborations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Collaboration request sent! We'll be in touch soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/collaborations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send collaboration request. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: InsertCollaborationRequest) => {
    collaborationMutation.mutate(data);
  };

  return (
    <div className="pt-20">
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-8 text-center">
            Our <span className="text-accent">Story</span>
          </h1>
          
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-xl text-muted-foreground text-center mb-8">
              YouBBle Records was born from a vision to bridge the gap between underground authenticity and mainstream impact.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-card p-8">
                <CardContent className="p-0">
                  <h3 className="font-heading font-bold text-2xl mb-4 text-accent">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To empower artists with bold vision, creating music that not only entertains but transforms communities and drives social change.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card p-8">
                <CardContent className="p-0">
                  <h3 className="font-heading font-bold text-2xl mb-4 text-accent">Our Values</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Authentic artistic expression</li>
                    <li>• Community-driven impact</li>
                    <li>• Innovation in music business</li>
                    <li>• Supporting emerging talent</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Collaborate Section */}
          <Card className="bg-secondary rounded-xl p-8 md:p-12">
            <CardContent className="p-0">
              <h2 className="font-heading font-bold text-3xl mb-6 text-center">Collaborate With Us</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Whether you're an artist, producer, or industry professional, we're always looking for creative partnerships that push boundaries.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Name *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="input-collaboration-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Email *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            {...field} 
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="input-collaboration-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collaborationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Collaboration Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger 
                              className="bg-input border-border focus:ring-accent focus:border-accent"
                              data-testid="select-collaboration-type"
                            >
                              <SelectValue placeholder="Select collaboration type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Artist Partnership">Artist Partnership</SelectItem>
                            <SelectItem value="Production Collaboration">Production Collaboration</SelectItem>
                            <SelectItem value="Business Partnership">Business Partnership</SelectItem>
                            <SelectItem value="Social Impact Project">Social Impact Project</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Message *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Tell us about your project or collaboration idea..."
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="textarea-collaboration-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-heading font-bold hover-glow transition-all"
                    data-testid="button-submit-collaboration"
                  >
                    {isSubmitting ? "Sending..." : "Send Collaboration Request"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
