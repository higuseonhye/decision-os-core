import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { DealsTable } from "@/components/deals-table";
import { MetricCard } from "@/components/metric-card";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: org } = await supabase.from("organizations").select("id").eq("owner_id", user.id).single();
  let activeOrganizationId = org?.id ?? null;
  if (!activeOrganizationId) {
    const { data: createdOrg } = await supabase
      .from("organizations")
      .insert({ owner_id: user.id, name: `${user.email?.split("@")[0] ?? "My"} Organization` })
      .select("id")
      .single();
    if (!createdOrg) redirect("/auth/sign-up");
    activeOrganizationId = createdOrg.id;
  }

  const { data: decisions } = await supabase
    .from("decisions")
    .select("deal_id,deal_score,recommendation,created_at")
    .eq("org_id", activeOrganizationId)
    .order("created_at", { ascending: false });

  const dealIds = decisions?.map((d) => d.deal_id) ?? [];
  const [{ data: deals }, { data: outcomes }] = await Promise.all([
    supabase.from("deals").select("id,company_name,expected_revenue").in("id", dealIds),
    supabase.from("outcomes").select("deal_id,status").in("deal_id", dealIds),
  ]);

  const dealMap = new Map((deals ?? []).map((item) => [item.id, item]));
  const outcomeMap = new Map((outcomes ?? []).map((item) => [item.deal_id, item.status]));

  const rows =
    decisions?.map((item) => ({
      deal_id: item.deal_id as string,
      created_at: item.created_at as string,
      company_name: dealMap.get(item.deal_id)?.company_name ?? "Unknown",
      deal_score: item.deal_score as number,
      recommendation: item.recommendation,
      outcome: outcomeMap.get(item.deal_id) ?? null,
      expected_revenue: dealMap.get(item.deal_id)?.expected_revenue ?? 0,
    })) ?? [];

  const approvedThisMonth = rows.filter((r) => {
    const inMonth = new Date(r.created_at).getMonth() === new Date().getMonth();
    return inMonth && r.recommendation === "APPROVE";
  }).length;

  const avgDecisionTime = "Instant";
  const estimatedRevenueImpact = rows.reduce((acc, r) => acc + Math.max(0, rScore(r.recommendation, r.expected_revenue)), 0);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Decision Dashboard</h1>
        <Link href="/deals/new" className={cn(buttonVariants())}>
          New Deal
        </Link>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Open Decisions" value={`${rows.length}`} />
        <MetricCard title="Approved This Month" value={`${approvedThisMonth}`} />
        <MetricCard title="Avg Decision Time" value={avgDecisionTime} />
        <MetricCard title="Estimated Revenue Impact" value={`$${estimatedRevenueImpact.toLocaleString()}`} />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Decision Log</CardTitle>
        </CardHeader>
        <CardContent>
          <DealsTable deals={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

function rScore(recommendation: string, expectedRevenue: number) {
  if (recommendation === "APPROVE") return expectedRevenue;
  if (recommendation === "RENEGOTIATE") return expectedRevenue * 0.6;
  return 0;
}
