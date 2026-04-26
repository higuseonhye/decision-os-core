import { createClient } from "@supabase/supabase-js";
import { evaluateDeal } from "@/lib/decision-engine";
import { DealInput } from "@/types/deal";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const demoOwnerId = process.env.DEMO_USER_ID;
const demoOrgName = process.env.DEMO_ORG_NAME ?? "Decision OS Demo Org";

if (!supabaseUrl || !serviceRoleKey || !demoOwnerId) {
  console.error(
    "Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEMO_USER_ID",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const demoDeals: DealInput[] = [
  {
    company_name: "Nova Payments",
    contact_name: "Ari Kim",
    deal_type: "customer",
    expected_revenue: 120000,
    strategic_value: 8,
    complexity: 4,
    logo_value: 7,
    payment_risk: 3,
    notes: "Fast-growth fintech logo with strong reference value.",
  },
  {
    company_name: "Polar Dynamics",
    contact_name: "Min Cho",
    deal_type: "partner",
    expected_revenue: 95000,
    strategic_value: 7,
    complexity: 8,
    logo_value: 6,
    payment_risk: 8,
    notes: "High upside but contract and delivery risk both high.",
  },
  {
    company_name: "LocalBox Retail",
    contact_name: "Hana Lee",
    deal_type: "pilot",
    expected_revenue: 14000,
    strategic_value: 3,
    complexity: 7,
    logo_value: 2,
    payment_risk: 8,
    notes: "Budget-constrained pilot, likely poor fit.",
  },
];

async function run() {
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .upsert(
      {
        owner_id: demoOwnerId,
        name: demoOrgName,
      },
      { onConflict: "owner_id" },
    )
    .select("id")
    .single();

  if (orgError || !org) throw orgError ?? new Error("Could not create org");

  for (const dealInput of demoDeals) {
    const decision = evaluateDeal(dealInput);
    const { data: deal, error: dealError } = await supabase
      .from("deals")
      .insert({ ...dealInput, org_id: org.id })
      .select("id")
      .single();
    if (dealError || !deal) throw dealError ?? new Error("Could not create demo deal");

    const { error: decisionError } = await supabase.from("decisions").insert({
      org_id: org.id,
      deal_id: deal.id,
      deal_score: decision.dealScore,
      risk_score: decision.riskScore,
      recommendation: decision.recommendation,
      reasoning_json: decision.reasoning,
    });
    if (decisionError) throw decisionError;

    const { error: outcomeError } = await supabase.from("outcomes").insert({
      deal_id: deal.id,
      status: "pending",
      notes: "Seeded demo outcome.",
    });
    if (outcomeError) throw outcomeError;
  }

  console.log(`Seeded ${demoDeals.length} deals for org ${org.id}`);
}

run().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
