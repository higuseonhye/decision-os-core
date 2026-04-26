import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendationBadge } from "@/components/recommendation-badge";
import { OutcomeForm } from "@/components/outcome-form";
import { createClient } from "@/lib/supabase/server";

export default async function DealDecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: decision } = await supabase
    .from("decisions")
    .select("deal_id,deal_score,risk_score,recommendation,reasoning_json")
    .eq("deal_id", id)
    .single();

  if (!decision) notFound();

  const [{ data: deal }, { data: outcome }] = await Promise.all([
    supabase.from("deals").select("*").eq("id", id).single(),
    supabase.from("outcomes").select("status").eq("deal_id", id).single(),
  ]);

  if (!deal) notFound();

  const riskFlags = [
    deal.payment_risk >= 7 ? "High payment risk detected." : null,
    deal.complexity >= 7 ? "High delivery complexity." : null,
    decision.risk_score >= 95 ? "Total risk score is above threshold." : null,
  ].filter(Boolean);

  const nextAction =
    decision.recommendation === "APPROVE"
      ? "Move to contract and onboarding."
      : decision.recommendation === "RENEGOTIATE"
        ? "Renegotiate pricing, timeline, and payment terms."
        : decision.recommendation === "REJECT"
          ? "Close the opportunity with clear rationale."
          : "Escalate for founder review.";

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-8 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Decision Result: {deal.company_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <RecommendationBadge recommendation={decision.recommendation} />
            <p className="text-sm text-muted-foreground">Final recommendation</p>
          </div>
          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
            <p>
              <span className="text-sm text-muted-foreground">Deal Score</span>
              <br />
              <span className="text-2xl font-semibold">{decision.deal_score}</span>
            </p>
            <p>
              <span className="text-sm text-muted-foreground">Risk Score</span>
              <br />
              <span className="text-2xl font-semibold">{decision.risk_score}</span>
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Reasoning</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {(decision.reasoning_json as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Revenue upside</h3>
            <p className="mt-1 text-sm text-muted-foreground">${deal.expected_revenue.toLocaleString()} projected</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Risk flags</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {riskFlags.length > 0 ? riskFlags.map((flag) => <li key={flag}>{flag}</li>) : <li>No major risk flags.</li>}
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Suggested next action</h3>
            <p className="mt-1 text-sm text-muted-foreground">{nextAction}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Loop</CardTitle>
        </CardHeader>
        <CardContent>
          <OutcomeForm dealId={id} initialStatus={outcome?.status ?? "pending"} />
        </CardContent>
      </Card>
    </div>
  );
}
