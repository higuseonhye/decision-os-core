"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  company_name: z.string().min(2),
  contact_name: z.string().min(2),
  deal_type: z.enum(["customer", "partner", "vendor", "pilot"]),
  expected_revenue: z.number().min(0),
  strategic_value: z.number().min(1).max(10),
  complexity: z.number().min(1).max(10),
  logo_value: z.number().min(1).max(10),
  payment_risk: z.number().min(1).max(10),
  notes: z.string().optional(),
});

type DealFormValues = z.infer<typeof schema>;

export function NewDealForm() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<DealFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      deal_type: "customer",
      strategic_value: 5,
      complexity: 5,
      logo_value: 5,
      payment_risk: 5,
    },
  });
  const dealType = useWatch({ control: form.control, name: "deal_type" });

  const onSubmit = async (values: DealFormValues) => {
    setError(null);
    setSubmitting(true);
    const response = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? "Failed to submit deal");
      return;
    }

    router.push(`/deals/${payload.decisionId}`);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Deal Submission</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input {...form.register("company_name")} />
          </div>
          <div className="space-y-2">
            <Label>Contact Name</Label>
            <Input {...form.register("contact_name")} />
          </div>
          <div className="space-y-2">
            <Label>Deal Type</Label>
            <Select value={dealType} onValueChange={(v) => form.setValue("deal_type", v as DealFormValues["deal_type"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="pilot">Pilot</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Expected Revenue ($)</Label>
            <Input type="number" {...form.register("expected_revenue", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Estimated Strategic Value (1-10)</Label>
            <Input type="number" {...form.register("strategic_value", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Delivery Complexity (1-10)</Label>
            <Input type="number" {...form.register("complexity", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Reference Logo Value (1-10)</Label>
            <Input type="number" {...form.register("logo_value", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Payment Risk (1-10)</Label>
            <Input type="number" {...form.register("payment_risk", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Notes</Label>
            <Textarea rows={4} {...form.register("notes")} />
          </div>
          {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
          <div className="md:col-span-2">
            <Button disabled={submitting}>{submitting ? "Submitting..." : "Submit Deal"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
