import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Competition Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><label>Open fee</label><Input defaultValue="20" /></div>
            <div><label>Teen fee</label><Input defaultValue="15" /></div>
            <div><label>Cover fee</label><Input defaultValue="20" /></div>
            <div><label>Sync fee</label><Input defaultValue="30" /></div>
            <div><label>Submission deadline, ISO</label><Input placeholder="2025-12-31T23:59:59Z" /></div>
          </div>
          <Button>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Entries</CardTitle></CardHeader>
        <CardContent>
          <Button>Export CSV</Button>
        </CardContent>
      </Card>
    </div>
  );
}
