import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertDemoSubmissionSchema, type InsertDemoSubmission } from "@shared/schema";
import { CloudUpload } from "lucide-react";

export default function DemosPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<InsertDemoSubmission>({
    resolver: zodResolver(insertDemoSubmissionSchema),
    defaultValues: {
      artistName: "",
      email: "",
      phone: "",
      location: "",
      genres: "",
      socialLinks: "",
      bio: "",
    },
  });

  const demoMutation = useMutation({
    mutationFn: async (data: InsertDemoSubmission) => {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/demos", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Demo submitted successfully!",
        description: "We'll review your submission and get back to you within 2-4 weeks.",
      });
      form.reset();
      setSelectedFiles([]);
      queryClient.invalidateQueries({ queryKey: ["/api/demos"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit demo. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: InsertDemoSubmission) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one track.",
        variant: "destructive",
      });
      return;
    }
    demoMutation.mutate(data);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.includes('audio') || file.name.match(/\.(mp3|wav|flac)$/i);
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Please ensure files are MP3, WAV, or FLAC format and under 50MB each.",
        variant: "destructive",
      });
    }
    
    setSelectedFiles(validFiles);
  };

  const guidelines = [
    "File formats: MP3, WAV, FLAC (stems accepted)",
    "Maximum file size: 50MB per track",
    "Include 2-3 of your best tracks",
    "Provide brief artist bio and social links",
    "Response time: 2-4 weeks",
  ];

  return (
    <div className="pt-20">
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading font-black text-5xl md:text-6xl mb-8 text-center">
            Submit Your <span className="text-accent">Demo</span>
          </h1>
          
          <Card className="bg-card rounded-xl p-8 md:p-12">
            <CardContent className="p-0">
              <div className="mb-8">
                <h2 className="font-heading font-bold text-2xl mb-4">Ready to be heard?</h2>
                <p className="text-muted-foreground mb-6">
                  We're always looking for fresh talent that pushes boundaries. Submit your demo and join the YouBBle Records family.
                </p>
                
                {/* Guidelines */}
                <Card className="bg-secondary rounded-lg p-6 mb-8">
                  <CardContent className="p-0">
                    <h3 className="font-semibold text-lg mb-4 text-accent">Submission Guidelines</h3>
                    <ul className="text-muted-foreground space-y-2">
                      {guidelines.map((guideline, index) => (
                        <li key={index}>• {guideline}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="artistName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Artist/Band Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-input border-border focus:ring-accent focus:border-accent"
                              data-testid="input-artist-name"
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
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Phone</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel"
                              {...field} 
                              className="bg-input border-border focus:ring-accent focus:border-accent"
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Location</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-input border-border focus:ring-accent focus:border-accent"
                              data-testid="input-location"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Genre(s)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g., Electronic, Hip-Hop, R&B"
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="input-genres"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Social Media Links</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={2}
                            placeholder="Instagram, SoundCloud, Spotify, etc."
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="textarea-social-links"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Artist Bio *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Tell us your story, influences, and what makes your music unique..."
                            className="bg-input border-border focus:ring-accent focus:border-accent"
                            data-testid="textarea-bio"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Upload Your Tracks *</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-input hover:border-accent transition-colors">
                      <CloudUpload className="w-16 h-16 text-accent mx-auto mb-4" />
                      <p className="text-lg font-semibold mb-2">Drag & drop your files here</p>
                      <p className="text-muted-foreground mb-4">or click to browse</p>
                      <input 
                        type="file" 
                        multiple 
                        accept=".mp3,.wav,.flac"
                        onChange={handleFileChange}
                        className="hidden" 
                        id="file-upload"
                        data-testid="input-file-upload"
                      />
                      <Button 
                        type="button" 
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold"
                        data-testid="button-choose-files"
                      >
                        Choose Files
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">MP3, WAV, FLAC up to 50MB each</p>
                      
                      {selectedFiles.length > 0 && (
                        <div className="mt-4 text-left">
                          <p className="text-sm font-semibold mb-2">Selected files:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {selectedFiles.map((file, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{file.name}</span>
                                <span>{(file.size / (1024 * 1024)).toFixed(1)}MB</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="terms" 
                      required 
                      className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      data-testid="checkbox-terms"
                    />
                    <label htmlFor="terms" className="text-sm">
                      I agree to the <a href="#" className="text-accent hover:underline">terms and conditions</a> and confirm that I own the rights to the submitted material.
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-accent text-accent-foreground py-4 rounded-lg font-heading font-bold text-lg hover-glow transition-all"
                    data-testid="button-submit-demo"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Demo"}
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
