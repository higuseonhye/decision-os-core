"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OutcomeStatus } from "@/types/deal";

export function OutcomeForm({ dealId, initialStatus }: { dealId: string; initialStatus?: OutcomeStatus }) {
  const [status, setStatus] = useState<OutcomeStatus>(initialStatus ?? "pending");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch(`/api/outcomes/${dealId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });

    setSaving(false);
    if (!response.ok) {
      setMessage("Could not save outcome.");
      return;
    }
    setMessage("Outcome saved.");
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div className="space-y-2">
        <Label>Outcome</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as OutcomeStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="bad_fit">Bad Fit</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Outcome Notes</Label>
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button disabled={saving}>{saving ? "Saving..." : "Save Outcome"}</Button>
    </form>
  );
}
