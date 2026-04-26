import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateDeal } from "@/lib/decision-engine";
import { createClient } from "@/lib/supabase/server";

const dealSchema = z.object({
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

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = dealSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).single();
  if (!org) return NextResponse.json({ error: "No organization found" }, { status: 400 });

  const dealInput = {
    ...parsed.data,
    notes: parsed.data.notes ?? null,
  };
  const evaluated = evaluateDeal(dealInput);

  const { data: deal, error: dealError } = await supabase
    .from("deals")
    .insert({ ...dealInput, org_id: org.id })
    .select("id")
    .single();
  if (dealError || !deal) return NextResponse.json({ error: dealError?.message ?? "Could not save deal" }, { status: 500 });

  const { error: decisionError } = await supabase.from("decisions").insert({
    deal_id: deal.id,
    org_id: org.id,
    deal_score: evaluated.dealScore,
    risk_score: evaluated.riskScore,
    recommendation: evaluated.recommendation,
    reasoning_json: evaluated.reasoning,
  });
  if (decisionError) return NextResponse.json({ error: decisionError.message }, { status: 500 });

  await supabase.from("outcomes").insert({
    deal_id: deal.id,
    status: "pending",
  });

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `New deal submitted: ${dealInput.company_name} -> ${evaluated.recommendation} (deal score ${evaluated.dealScore}, risk ${evaluated.riskScore})`,
      }),
    }).catch(() => undefined);
  }

  return NextResponse.json({ decisionId: deal.id });
}
