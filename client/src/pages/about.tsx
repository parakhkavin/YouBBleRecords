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

export default function AboutPage() {
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
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
               <Card className="bg-card p-8">
                 <CardContent className="p-0">
                   <h3 className="font-heading font-bold text-2xl mb-4 text-accent">Our Mission</h3>
                   <p className="text-muted-foreground">
                     To empower creatives by combining industry standard music production, artist development, media training, and live experiences through a sustainable, growth ready business model.
                   </p>
                 </CardContent>
               </Card>
               <Card className="bg-card p-8">
                 <CardContent className="p-0">
                   <h3 className="font-heading font-bold text-2xl mb-4 text-accent">Our Vision</h3>
                   <p className="text-muted-foreground">
                     To become a leading creative incubator that bridges international diaspora talent with equitable industry opportunities, ensuring underrepresented voices are heard, developed, and sustained in the global music economy.
                   </p>
                 </CardContent>
               </Card>
               <Card className="bg-card p-8">
                 <CardContent className="p-0">
                   <h3 className="font-heading font-bold text-2xl mb-4 text-accent">Our Values</h3>
                   <ul className="text-muted-foreground space-y-2">
                     <li>Equity and fair opportunity for creatives</li>
                     <li>Community centered collaboration</li>
                     <li>Sustainability in the music ecosystem</li>
                     <li>Respect for culture and identity</li>
                   </ul>
                 </CardContent>
               </Card>
             </div>
          </div>

          {/* Competition Rules Section */}
            <Card className="bg-secondary rounded-xl p-8 md:p-12 mt-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Competition Rules</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>MP3 or M4A only, 50MB maximum</li>
                <li>Each category is a separate entry and fee</li>
                <li>Sync requires at least one other category</li>
                <li>Teen category requires DOB and parental consent</li>
                <li>No modifications after submission, late submissions rejected</li>
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                Support,{" "}
                <a
                  href="mailto:support@youbblerecords.com"
                  className="text-yellow-400 underline hover:text-yellow-300"
                >
                  support@youbblerecords.com
                </a>
              </p>
            </Card>
            {/* Collaborate Section */}
            <Card className="bg-secondary rounded-xl p-8 md:p-12">

            <CardContent className="p-0">
              <h2 className="font-heading font-bold text-3xl mb-6 text-center">Contact Us</h2>
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Whether you are a creative, a brand, an event organizer, an investor, or a partner, this is the best way to reach YouBBle Records.
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
                     name="phone"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="text-sm font-semibold">Phone Number</FormLabel>
                         <FormControl>
                           <Input
                             {...field}
                             className="bg-input border-border focus:ring-accent focus:border-accent"
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
                         <FormLabel className="text-sm font-semibold">Why are you reaching out to us?</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                             <SelectTrigger
                               className="bg-input border-border focus:ring-accent focus:border-accent"
                               data-testid="select-contact-reason"
                             >
                               <SelectValue placeholder="Select a reason" />
                             </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                             <SelectItem value="Creatives">Creatives - I need help with collaboration (Artist, Songwriter, Producer, Film, Dance, and Arts professional)</SelectItem>
                             <SelectItem value="Brands Ads and Sponsorship">Brands Ads and Sponsorship - I am interested in sponsoring projects</SelectItem>
                             <SelectItem value="Event Management">Event Management - I need help with an event</SelectItem>
                             <SelectItem value="Investors">Investors - I am interested in funding projects</SelectItem>
                             <SelectItem value="Technical Support">Technical Support - Website and App support</SelectItem>
                             <SelectItem value="Legal Claims and Copyright">Legal Claims and Copyright issues</SelectItem>
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
