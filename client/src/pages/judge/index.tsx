import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Entry = { id: number; artistName: string; songTitle: string; audioUrl: string };

export default function JudgePortal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  useEffect(() => {
    // TODO, fetch assigned entries after auth
    setEntries([]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <Card>
        <CardHeader><CardTitle>Judge Login</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Email" />
          <Input placeholder="Access code" />
          <Button>Enter</Button>
        </CardContent>
      </Card>

      {entries.map(e => (
        <Card key={e.id}>
          <CardHeader><CardTitle>{e.artistName} — {e.songTitle}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <audio controls src={e.audioUrl} className="w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input placeholder="Originality, 0-10" />
              <Input placeholder="Production, 0-10" />
              <Input placeholder="Performance, 0-10" />
            </div>
            <Button>Submit Score</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
