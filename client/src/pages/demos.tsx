"use client";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

type CategoryKey = "Open" | "Teen" | "Cover" | "Sync";

const CATEGORY_FEES: Record<CategoryKey, number> = {
  Open: 20,
  Teen: 15,
  Cover: 20,
  Sync: 30,
};

const MAX_BYTES = 50 * 1024 * 1024;
const ALLOWED_MIME = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/aac"];

export default function CompetitionEntryPage() {
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [dob, setDob] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const { toast } = useToast();

  const feeBreakdown = useMemo(() => {
    const list = selectedCategories.map((c) => ({
      name: c,
      amount: CATEGORY_FEES[c] || 0,
    }));
    const subtotal = list.reduce((s, it) => s + it.amount, 0);
    return { list, subtotal, total: subtotal };
  }, [selectedCategories]);

  const addCategory = (val: CategoryKey) =>
    setSelectedCategories((prev) => (prev.includes(val) ? prev : [...prev, val]));
  const removeCategory = (val: CategoryKey) =>
    setSelectedCategories((prev) => prev.filter((x) => x !== val));

  const validateSyncRule = () => {
    if (selectedCategories.includes("Sync") && selectedCategories.length < 2) {
      toast({ title: "Rule Error", description: "Sync requires at least one other category." });
      return false;
    }
    return true;
  };

  const validateTeenRule = () => {
    if (selectedCategories.includes("Teen")) {
      if (!dob) {
        toast({ title: "Teen Category", description: "DOB is required for Teen category." });
        return false;
      }
      if (!consentFile) {
        toast({
          title: "Teen Category",
          description: "Parental consent upload is required for Teen category.",
        });
        return false;
      }
    }
    return true;
  };

  const validateAudio = (file: File | null) => {
    if (!file) {
      toast({ title: "Missing File", description: "Please upload an audio file." });
      return false;
    }
    if (file.size > MAX_BYTES) {
      toast({ title: "File Too Large", description: "Audio must be 50MB or less." });
      return false;
    }
    const okType = ALLOWED_MIME.includes(file.type);
    const okExt = file.name.toLowerCase().endsWith(".mp3") || file.name.toLowerCase().endsWith(".m4a");
    if (!okType && !okExt) {
      toast({ title: "Invalid Format", description: "Only MP3 or M4A files are accepted." });
      return false;
    }
    return true;
  };

  const startPayment = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/competition/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: feeBreakdown.total, currency: "usd" }),
      });
      if (!res.ok) throw new Error("Payment init failed");
      const data = await res.json();
      setPaymentClientSecret(data.clientSecret);
      toast({ title: "Payment Ready", description: "Proceed with payment to continue." });
    } catch {
      toast({ title: "Payment Error", description: "Could not initialize payment." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName || !email || !songTitle) {
      toast({ title: "Missing Fields", description: "Artist name, email, and song title are required." });
      return;
    }
    if (!validateSyncRule() || !validateTeenRule() || !validateAudio(audioFile)) return;
    if (!acceptedRules) {
      toast({ title: "Rules", description: "You must accept the competition rules." });
      return;
    }
    if (!paid) {
      toast({ title: "Payment Required", description: "Please complete payment before submission." });
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
      toast({ title: "Submitted", description: "Your entry has been received!" });
      setArtistName("");
      setEmail("");
      setSongTitle("");
      setStreamUrl("");
      setLyrics("");
      setDob("");
      setAudioFile(null);
      setConsentFile(null);
      setSelectedCategories([]);
      setAcceptedRules(false);
      setPaid(false);
      setPaymentClientSecret(null);
    } catch {
      toast({ title: "Error", description: "Submission failed, try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      {/* Submission Guidelines */}
      <details open className="mb-8">
        <summary className="cursor-pointer text-xl font-semibold text-yellow-400 mb-2">
          Submission Guidelines
        </summary>
        <Card className="bg-secondary rounded-xl p-6 md:p-8">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>File formats: MP3 or M4A only (50MB maximum)</li>
            <li>Each category is a separate entry and fee</li>
            <li>Sync requires at least one other category</li>
            <li>Teen category requires DOB and parental consent</li>
            <li>No modifications after submission, late submissions rejected</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            For help, email{" "}
            <a
              href="mailto:support@youbblerecords.com"
              className="text-yellow-400 underline hover:text-yellow-300"
            >
              support@youbblerecords.com
            </a>
          </p>
        </Card>
      </details>

      <Card className="bg-card rounded-2xl shadow-lg p-10 md:p-12">
        <CardHeader>
          <CardTitle className="font-heading text-4xl text-center mb-10">
            Music Competition Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Artist Name *" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
              <Input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Song Title *" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} />
              <Input placeholder="Streaming URL (optional)" value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} />
            </div>
            <Textarea placeholder="Lyrics (optional)" value={lyrics} onChange={(e) => setLyrics(e.target.value)} />

            {/* Category Selection */}
            <div>
              <label className="font-medium">Categories</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(["Open", "Teen", "Cover", "Sync"] as CategoryKey[]).map((key) => {
                  const selected = selectedCategories.includes(key);
                  return (
                    <Button
                      key={key}
                      type="button"
                      variant={selected ? "default" : "secondary"}
                      onClick={() => (selected ? removeCategory(key) : addCategory(key))}
                    >
                      {key} ${CATEGORY_FEES[key]}
                    </Button>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Sync requires one additional category. Each category incurs a separate fee.
              </p>
            </div>

            {selectedCategories.includes("Teen") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setConsentFile(e.target.files?.[0] || null)} />
              </div>
            )}

            {/* Upload Section */}
            <div>
              <label className="block text-lg font-semibold mb-2">Upload Your Track *</label>
              <div className="border-2 border-dashed border-yellow-400 rounded-xl p-10 text-center bg-secondary/50 hover:bg-secondary transition">
                <div className="flex flex-col items-center space-y-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  <p className="font-medium text-lg">Drag & drop your file here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                  <label className="inline-block cursor-pointer">
                    <span className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg hover:bg-yellow-300 transition">
                      Choose File
                    </span>
                    <input type="file" accept=".mp3,.m4a,audio/mpeg,audio/mp4,audio/aac" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                  <p className="text-xs text-muted-foreground">MP3 or M4A only, up to 50MB</p>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="flex items-center gap-2">
              <Checkbox id="agree" checked={acceptedRules} onCheckedChange={(v) => setAcceptedRules(!!v)} />
              <label htmlFor="agree">I accept the rules and terms</label>
            </div>

            {/* Fees */}
            <div className="border rounded p-4 space-y-2">
              <div className="font-medium">Fees</div>
              {feeBreakdown.list.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>${item.amount}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${feeBreakdown.total}</span>
              </div>

              {!paymentClientSecret && (
                <Button type="button" onClick={startPayment} className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-300">
                  Initialize Payment
                </Button>
              )}
              {paymentClientSecret && !paid && (
                <Button type="button" onClick={() => { setPaid(true); toast({ title: "Payment Recorded", description: "You can now submit your entry." }); }}>
                  Confirm Payment (Demo)
                </Button>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-yellow-400 text-black font-bold px-8 py-4 mt-4 rounded-lg hover:bg-yellow-300 transition-all"
              >
                {submitting ? "Submitting..." : "Submit Entry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
