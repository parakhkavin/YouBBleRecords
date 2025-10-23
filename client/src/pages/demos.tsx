import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type CategoryKey = "Open" | "Teen" | "Cover" | "Sync";

const CATEGORY_FEES: Record<CategoryKey, number> = {
  Open: 20,
  Teen: 15,
  Cover: 20,
  Sync: 30, // Sync requires at least one other category per BRD
};

const MAX_BYTES = 50 * 1024 * 1024; // 50MB, per BRD
const ALLOWED_MIME = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/aac"]; // mp3, m4a variants

export default function CompetitionEntryPage() {
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isCover, setIsCover] = useState(false);
  const [coverDetails, setCoverDetails] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [dob, setDob] = useState<string>("");
  const [consentFile, setConsentFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const { toast } = useToast();

  const feeBreakdown = useMemo(() => {
    const list = selectedCategories.map(c => ({ name: c, amount: CATEGORY_FEES[c] || 0 }));
    const subtotal = list.reduce((s, it) => s + it.amount, 0);
    return { list, subtotal, total: subtotal }; // taxes or discounts can be added later
  }, [selectedCategories]);

  const addCategory = (val: CategoryKey) => {
    setSelectedCategories(prev => prev.includes(val) ? prev : [...prev, val]);
  };
  const removeCategory = (val: CategoryKey) => {
    setSelectedCategories(prev => prev.filter(x => x !== val));
  };

  const validateSyncRule = () => {
    if (selectedCategories.includes("Sync") && selectedCategories.length < 2) {
      toast({ title: "Category rule", description: "Sync requires at least one other category selected." });
      return false;
    }
    return true;
  };

  const validateTeenRule = () => {
    if (selectedCategories.includes("Teen")) {
      if (!dob) {
        toast({ title: "Teen category", description: "DOB is required for Teen category." });
        return false;
      }
      if (!consentFile) {
        toast({ title: "Teen category", description: "Parental consent upload is required for Teen category." });
        return false;
      }
    }
    return true;
  };

  const validateAudio = (file: File | null) => {
    if (!file) {
      toast({ title: "Missing file", description: "Please upload an audio file." });
      return false;
    }
    if (file.size > MAX_BYTES) {
      toast({ title: "File too large", description: "Audio must be 50MB or less." });
      return false;
    }
    // rely on type if present, also allow by extension
    const okType = ALLOWED_MIME.includes(file.type);
    const name = file.name.toLowerCase();
    const okExt = name.endsWith(".mp3") || name.endsWith(".m4a");
    if (!okType && !okExt) {
      toast({ title: "Invalid format", description: "Only MP3 or M4A files are accepted." });
      return false;
    }
    return true;
  };

  const startPayment = async () => {
    // call backend to create a payment intent for the total
    try {
      const res = await fetch("http://localhost:3001/api/competition/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: feeBreakdown.total, currency: "usd" }),
      });
      if (!res.ok) throw new Error("Payment init failed");
      const data = await res.json();
      setPaymentClientSecret(data.clientSecret);
      toast({ title: "Payment ready", description: "Proceed with payment to continue." });
    } catch {
      toast({ title: "Payment error", description: "Could not initialize payment." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName || !email || !songTitle) {
      toast({ title: "Missing fields", description: "Artist name, email, and song title are required." });
      return;
    }
    if (!validateSyncRule() || !validateTeenRule() || !validateAudio(audioFile)) return;
    if (!acceptedRules) {
      toast({ title: "Rules", description: "You must accept the competition rules and terms." });
      return;
    }
    if (!paid) {
      toast({ title: "Payment required", description: "Please complete payment before submission." });
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("artistName", artistName);
      form.append("email", email);
      form.append("songTitle", songTitle);
      form.append("streamUrl", streamUrl);
      form.append("lyrics", lyrics);
      form.append("isCover", String(isCover));
      form.append("coverDetails", coverDetails);
      form.append("categories", JSON.stringify(selectedCategories));
      form.append("dob", dob);
      if (consentFile) form.append("consentFile", consentFile);
      if (audioFile) form.append("file", audioFile);
      form.append("paymentClientSecret", paymentClientSecret || "");

      const res = await fetch("http://localhost:3001/api/competition/submit", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Submit failed");
      toast({ title: "Submitted", description: "Your entry has been received, you will get a confirmation email." });
      // reset
      setArtistName(""); setEmail(""); setSongTitle(""); setStreamUrl(""); setLyrics("");
      setIsCover(false); setCoverDetails("");
      setSelectedCategories([]); setAudioFile(null);
      setDob(""); setConsentFile(null); setAcceptedRules(false);
      setPaymentClientSecret(null); setPaid(false);
    } catch {
      toast({ title: "Error", description: "Submission failed, try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <Card className="bg-card rounded-2xl shadow-lg p-10 md:p-12">
        <CardHeader><CardTitle className="font-heading text-4xl md:text-5xl text-center mb-10">Music Competition Entry</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Artist Name" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Song Title" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} />
            <Input placeholder="Streaming URL, optional" value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} />
            <Textarea placeholder="Lyrics, optional" value={lyrics} onChange={(e) => setLyrics(e.target.value)} />

            <div className="space-y-4">
              <label className="font-medium">Categories, multiple selection</label>
              <div className="flex flex-wrap gap-2">
                {(["Open","Teen","Cover","Sync"] as CategoryKey[]).map(key => {
                  const selected = selectedCategories.includes(key);
                  return (
                    <Button key={key} type="button" variant={selected ? "default" : "secondary"} onClick={() => selected ? removeCategory(key) : addCategory(key)}>
                      {key} ${CATEGORY_FEES[key]}
                    </Button>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">
                Sync requires at least one other category selected. Each category is a separate fee.
              </p>
            </div>

            {selectedCategories.includes("Teen") && (
              <div className="space-y-4">
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setConsentFile(e.target.files?.[0] || null)} />
              </div>
            )}

            <div className="space-y-4">
            <label className="block text-sm font-medium text-muted-foreground">
              Upload File
            </label>

            <div className="flex items-center gap-3">
              {/* Yellow upload button */}
              <label
                htmlFor="audio-upload"
                className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-yellow-500/40 hover:scale-105 transition-all"
              >
                Choose File
              </label>

              {/* File name text */}
              <span className="text-sm text-muted-foreground truncate w-48">
                {audioFile ? audioFile.name : "No file chosen"}
              </span>
            </div>

            {/* Hidden input that still captures the file */}
            <input
              id="audio-upload"
              type="file"
              accept=".mp3,.m4a,audio/mpeg,audio/mp4,audio/aac"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            <hr className="my-8 border-border/40" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload your audio file (MP3 or M4A only, max 50MB)
            </p>
          </div>


            <div className="flex items-center gap-2">
              <Checkbox id="agree" checked={acceptedRules} onCheckedChange={(v) => setAcceptedRules(!!v)} />
              <label htmlFor="agree">I accept the rules and terms</label>
            </div>

            <div className="border rounded p-3 space-y-2">
              <div className="font-medium">Fees</div>
              {feeBreakdown.list.map(item => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span>{item.name}</span><span>${item.amount}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold">
                <span>Total</span><span>${feeBreakdown.total}</span>
              </div>
              {!paymentClientSecret && (
                <Button type="button" onClick={startPayment} className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-yellow-500/40 hover:scale-105 transition-all">Initialize Payment</Button>
              )}
              {paymentClientSecret && !paid && (
                <Button
                  type="button"
                  onClick={() => { setPaid(true); toast({ title: "Payment recorded", description: "Proceed to submit your entry." }); }}
                >
                  Confirm Payment, demo
                </Button>
              )}
            </div>
            
            <div className="flex justify-center">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-yellow-400 text-black font-bold px-8 py-4 mt-4 rounded-lg shadow-md hover:shadow-yellow-500/40 hover:scale-105 transition-all"
            >
              {submitting ? "Submitting..." : "Submit Entry"}
            </Button>
          </div>

          </form>
        </CardContent>
      </Card>

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
    </div>
  );
}
