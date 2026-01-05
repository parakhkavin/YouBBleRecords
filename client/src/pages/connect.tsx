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

type ContactFormValues = InsertCollaborationRequest & {
  phone?: string;
  state?: string;
  country?: string;
};

export default function ConnectPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(insertCollaborationRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      collaborationType: "",
      message: "",
      phone: "",
      state: "",
      country: "",
    },
  });

  const collaborationMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/collaborations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your message has been sent! We'll be in touch soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/collaborations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
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
            Connect <span className="text-accent">With Us</span>
          </h1>
          
          <Card className="bg-secondary rounded-xl p-8 md:p-12">
            <CardContent className="p-0">
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Whether you are a creative, a brand, an event organizer, an investor, 
                or need technical support, this is the best way to reach Youbble Records.
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
                            data-testid="input-connect-name"
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
                            data-testid="input-connect-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="(813) YBBL-REC"
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="input-connect-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">State</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="input-connect-state"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Country</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="input-connect-country"
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
                        <FormLabel className="text-sm font-semibold">Why are you reaching out to us? *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger
                              className="bg-input border-border focus:ring-accent focus:border-accent"
                              data-testid="select-connect-reason"
                            >
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Creatives">
                              Creatives - I need help with collaboration (Artist, Songwriter, Producer, Film, Dance, & Arts professional)
                            </SelectItem>
                            <SelectItem value="Brands Ads and Sponsorship">
                              Brands Ads & Sponsorship - I'm interested in Sponsoring Projects
                            </SelectItem>
                            <SelectItem value="Event Management">
                              Event Management - I need help with an Event
                            </SelectItem>
                            <SelectItem value="Investors">
                              Investors - I'm interested in funding projects
                            </SelectItem>
                            <SelectItem value="Technical Support">
                              Technical Support - Website and App Support
                            </SelectItem>
                            <SelectItem value="Legal Claims and Copyright">
                              Legal Claims & Copyrights Issues
                            </SelectItem>
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
                            placeholder="Tell us about your inquiry..."
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="textarea-connect-message"
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
                    data-testid="button-submit-connect"
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
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