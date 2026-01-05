import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PaymentForm from "@/components/PaymentForm";
import demo1 from "@/assets/demo1.png";
import demo2 from "@/assets/demo2.png";

const MAX_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = [".mp3", ".wav", ".flac"];
const SUBMISSION_FEE = 29.99;

export default function SubmitDemoPage() {
  // Form state
  const [stageName, setStageName] = useState("");
  const [role, setRole] = useState<string[]>([]);
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [originalCity, setOriginalCity] = useState("");
  const [originalState, setOriginalState] = useState("");
  const [originalCountry, setOriginalCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [spotify, setSpotify] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [otherUrl, setOtherUrl] = useState("");
  const [artistBio, setArtistBio] = useState("");
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const { toast } = useToast();

  const roles = ["Artist", "Producer", "Songwriter", "Performer", "Musician"];

  const toggleRole = (selectedRole: string) => {
    setRole((prev) =>
      prev.includes(selectedRole)
        ? prev.filter((r) => r !== selectedRole)
        : [...prev, selectedRole]
    );
  };

  const validateFiles = () => {
    if (audioFiles.length === 0) {
      toast({ 
        title: "Missing Files", 
        description: "Please upload at least 1 track (max 3)." 
      });
      return false;
    }
    if (audioFiles.length > 3) {
      toast({ 
        title: "Too Many Files", 
        description: "Maximum 3 tracks allowed." 
      });
      return false;
    }
    for (const file of audioFiles) {
      if (file.size > MAX_BYTES) {
        toast({ 
          title: "File Too Large", 
          description: `${file.name} exceeds 50MB limit.` 
        });
        return false;
      }
      const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );
      if (!hasValidExtension) {
        toast({ 
          title: "Invalid Format", 
          description: `${file.name} must be MP3, WAV, or FLAC.` 
        });
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + audioFiles.length > 3) {
      toast({ 
        title: "Too Many Files", 
        description: "Maximum 3 tracks allowed." 
      });
      return;
    }
    setAudioFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAudioFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startPayment = async () => {
    try {
      const res = await fetch("/api/demo/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: SUBMISSION_FEE, currency: "usd" }),
      });
      if (!res.ok) throw new Error("Payment init failed");
      const data = await res.json();
      setPaymentClientSecret(data.clientSecret);
      toast({ 
        title: "Payment Ready", 
        description: "Please complete payment to continue." 
      });
    } catch {
      toast({ 
        title: "Payment Error", 
        description: "Could not initialize payment." 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stageName || !contactFirstName || !contactLastName || !email) {
      toast({ 
        title: "Missing Required Fields", 
        description: "Please fill in all required fields." 
      });
      return;
    }

    if (role.length === 0) {
      toast({ 
        title: "Missing Role", 
        description: "Please select at least one role." 
      });
      return;
    }

    if (!currentCity || !currentState || !currentCountry) {
      toast({ 
        title: "Missing Location", 
        description: "Please provide your current location." 
      });
      return;
    }

    if (!validateFiles()) return;

    if (!acceptedTerms) {
      toast({ 
        title: "Terms Required", 
        description: "You must accept the terms and conditions." 
      });
      return;
    }

    if (!paid) {
      toast({
        title: "Payment Required",
        description: "Please complete payment before submitting your demo.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("stageName", stageName);
      formData.append("role", JSON.stringify(role));
      formData.append("contactFirstName", contactFirstName);
      formData.append("contactLastName", contactLastName);
      formData.append("currentLocation", `${currentCity}, ${currentState}, ${currentCountry}`);
      formData.append("originalLocation", `${originalCity}, ${originalState}, ${originalCountry}`);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("spotify", spotify);
      formData.append("youtube", youtube);
      formData.append("instagram", instagram);
      formData.append("tiktok", tiktok);
      formData.append("otherUrl", otherUrl);
      formData.append("artistBio", artistBio);
      formData.append("paymentClientSecret", paymentClientSecret || "");
      
      audioFiles.forEach((file) => {
        formData.append("tracks", file);
      });

      const res = await fetch("/api/demo/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Submission failed");

      toast({ 
        title: "Success!", 
        description: "Your demo has been submitted. We'll review it within 2-4 weeks." 
      });

      // Reset form
      setStageName("");
      setRole([]);
      setContactFirstName("");
      setContactLastName("");
      setCurrentCity("");
      setCurrentState("");
      setCurrentCountry("");
      setOriginalCity("");
      setOriginalState("");
      setOriginalCountry("");
      setEmail("");
      setPhone("");
      setSpotify("");
      setYoutube("");
      setInstagram("");
      setTiktok("");
      setOtherUrl("");
      setArtistBio("");
      setAudioFiles([]);
      setAcceptedTerms(false);
      setPaid(false);
      setPaymentClientSecret(null);
    } catch {
      toast({ 
        title: "Submission Error", 
        description: "Failed to submit demo. Please try again." 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section with Image */}
      <section className="relative mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Hero Image */}
            <div className="rounded-2xl mb-8 overflow-hidden">
              <img 
                src={demo1} 
                alt="Calling All Creatives - Submit Your Demos" 
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Intro Text */}
            <Card className="bg-card rounded-xl p-8 mb-8">
              <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
                <p>
                  Whether you're obsessed with making music, constantly creating, love to sing but have no
                  songs yet, enjoy collaborating, or simply wish you had a real support team behind you — <strong>this is
                  your moment</strong>.
                </p>
                <p className="font-semibold text-accent">
                  Youbble Records is an independent US-based record label empowering local and
                  diaspora artists through a complete ecosystem of artist development, global distribution,
                  and music publishing.
                </p>
                <p>
                  If you're an emerging creative, a "not-so-sure" bathroom or bedroom performer, a songwriter
                  and composer, or a seasoned artist ready for the next level — and you're looking for a platform
                  to help you produce your music, elevate your craft, distribute globally, and publish your work —
                  you're in the right place.
                </p>
              </div>
            </Card>

            {/* What We're Looking For */}
            <Card className="bg-secondary rounded-xl p-8 mb-8">
              <h2 className="font-heading font-bold text-3xl mb-6 text-accent">
                What We're Looking For
              </h2>
              <p className="text-muted-foreground mb-4">
                We're scouting artists from local and international diaspora communities who bring:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Creativity</li>
                <li>Passion</li>
                <li>Hunger</li>
                <li>Dedication</li>
                <li>A desire to create, grow, and perform</li>
                <li>Real talent but no reliable support system yet</li>
              </ul>
              <p className="mt-6 text-accent font-semibold">
                If that sounds like you, we want to hear from you.
              </p>
            </Card>

            {/* Why Submit Section */}
            <Card className="bg-card rounded-xl p-8 mb-8">
              <h2 className="font-heading font-bold text-3xl mb-6 text-accent">
                Why Submit to Youbble Records?
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  By submitting your demo, you're stepping into a growing network of songwriters, musicians,
                  producers, and other creatives from the local and international diaspora scene. You're
                  connecting with a team built to support you, develop you, and help your music reach listeners
                  worldwide.
                </p>
                <p className="font-semibold">At Youbble Records:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We don't just listen to demos — we invest in people</li>
                  <li>We take the time to understand your story, your sound, and your potential</li>
                  <li>We're committed to giving emerging and overlooked voices a real platform, real opportunities, and real guidance</li>
                </ul>
                <p className="font-semibold mt-6">Submitting your demo means:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You'll be considered for artist development and production, and/or distribution and publishing programs</li>
                  <li>Your music will be considered for our playlists</li>
                  <li>You'll gain access to potential collaborators and producers</li>
                  <li>Your music could be brought to life, distributed globally, and protected through publishing</li>
                  <li>You become an extension of Youbble Records label that champions cultural identity, originality, and global reach</li>
                </ul>
                <p className="mt-6 text-accent font-semibold text-lg">
                  If you're ready to grow, ready to be heard, and ready for a team that believes in your journey — send us your demo.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-secondary rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-4 text-yellow-400">
              Submission Guidelines
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>File formats: MP3, WAV, FLAC (stems accepted)</li>
              <li>Maximum file size: 50MB per track</li>
              <li>Include 1-3 of your best tracks</li>
              <li>Provide brief artist bio and social links</li>
              <li>Response time: 2-4 weeks</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Submission Form */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card rounded-2xl shadow-lg p-8 md:p-12">
            <CardHeader>
              <CardTitle className="font-heading text-4xl text-center mb-8">
                Submit Your Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Stage Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Stage Name *
                  </label>
                  <Input
                    placeholder="Your stage name"
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                    required
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    I am * (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((r) => (
                      <Button
                        key={r}
                        type="button"
                        variant={role.includes(r) ? "default" : "outline"}
                        onClick={() => toggleRole(r)}
                        className={role.includes(r) ? "bg-accent" : ""}
                      >
                        {r}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Contact Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Contact First Name *
                    </label>
                    <Input
                      placeholder="First name"
                      value={contactFirstName}
                      onChange={(e) => setContactFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Contact Last Name *
                    </label>
                    <Input
                      placeholder="Last name"
                      value={contactLastName}
                      onChange={(e) => setContactLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Current Location */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Currently Based In *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="City"
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="State/Province"
                      value={currentState}
                      onChange={(e) => setCurrentState(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Country"
                      value={currentCountry}
                      onChange={(e) => setCurrentCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Original Location */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Originally From
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="City"
                      value={originalCity}
                      onChange={(e) => setOriginalCity(e.target.value)}
                    />
                    <Input
                      placeholder="State/Province"
                      value={originalState}
                      onChange={(e) => setOriginalState(e.target.value)}
                    />
                    <Input
                      placeholder="Country"
                      value={originalCountry}
                      onChange={(e) => setOriginalCountry(e.target.value)}
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Phone Number (optional)
                    </label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Media Links */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Media Links
                  </label>
                  <div className="space-y-3">
                    <Input
                      placeholder="Spotify URL"
                      value={spotify}
                      onChange={(e) => setSpotify(e.target.value)}
                    />
                    <Input
                      placeholder="YouTube URL"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                    />
                    <Input
                      placeholder="Instagram URL"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                    <Input
                      placeholder="TikTok URL"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value)}
                    />
                    <Input
                      placeholder="Other URL"
                      value={otherUrl}
                      onChange={(e) => setOtherUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* Artist Bio */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Brief Artist Bio
                  </label>
                  <Textarea
                    placeholder="Tell us about yourself, your musical journey, influences, and goals..."
                    value={artistBio}
                    onChange={(e) => setArtistBio(e.target.value)}
                    rows={6}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-lg font-semibold mb-3 text-foreground">
                    Upload Your Tracks * (1-3 tracks)
                  </label>
                  
                  <div className="border-2 border-dashed border-accent rounded-xl p-8 text-center bg-secondary/50 hover:bg-secondary transition">
                    <div className="flex flex-col items-center space-y-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
                        />
                      </svg>
                      
                      <p className="font-medium text-lg">
                        Choose your audio files
                      </p>
                      
                      <label className="inline-block cursor-pointer">
                        <span className="bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
                          Browse Files
                        </span>
                        <input
                          type="file"
                          accept=".mp3,.wav,.flac"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      
                      <p className="text-xs text-muted-foreground">
                        MP3, WAV, or FLAC • Max 50MB per file • 1-3 tracks
                      </p>
                    </div>
                  </div>

                  {/* Selected Files */}
                  {audioFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="font-semibold text-sm">Selected Files:</p>
                      {audioFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-secondary p-3 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-green-400">✓</span>
                            <span className="font-medium">{file.name}</span>
                            <span className="text-sm text-muted-foreground">
                              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I agree to the terms and conditions and confirm that I own the rights to the
                    submitted material.
                  </label>
                </div>

                {/* Payment Section */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Submission Fee:</span>
                    <span className="text-2xl font-bold text-accent">
                      ${SUBMISSION_FEE.toFixed(2)} + Tax
                    </span>
                  </div>

                  {!paymentClientSecret && !paid && (
                    <Button
                      type="button"
                      onClick={startPayment}
                      className="w-full bg-accent text-accent-foreground font-semibold py-6 text-lg"
                    >
                      Proceed to Payment
                    </Button>
                  )}

                  {paymentClientSecret && !paid && (
                    <div className="p-4 bg-secondary rounded-lg">
                      <PaymentForm
                        clientSecret={paymentClientSecret}
                        onPaid={() => {
                          setPaid(true);
                          toast({
                            title: "Payment Confirmed",
                            description: "Your payment was successful. You can now submit your demo.",
                          });
                        }}
                      />
                    </div>
                  )}

                  {paid && (
                    <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg text-center">
                      <p className="text-green-400 font-semibold">✓ Payment Confirmed</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You can now submit your demo
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    disabled={submitting || !paid}
                    className="bg-accent text-accent-foreground font-bold px-12 py-6 text-lg rounded-lg shadow-lg hover:shadow-accent/40 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Demo"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-secondary rounded-xl p-8 mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-accent">
              Next Steps:
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>A specialist in our team will be reviewing your content</li>
              <li>Your song will be queued up until our submissions close for final assessments</li>
              <li>You will be notified each step on the status of your submission as we review</li>
              <li>We will select 3 or more artists for the program following year</li>
            </ol>
          </Card>
        </div>
      </section>

      {/* Footer Image */}
      <section className="container mx-auto px-4 mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden">
            <img 
              src={demo2} 
              alt="Supporting Local Creatives From Every Beat of the World" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}