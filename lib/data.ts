import { createClient } from "@/lib/supabase/server";
import { OutcomeStatus, Recommendation } from "@/types/deal";

export interface DealRow {
  id: string;
  org_id: string;
  company_name: string;
  contact_name: string;
  deal_type: string;
  expected_revenue: number;
  strategic_value: number;
  complexity: number;
  logo_value: number;
  payment_risk: number;
  notes: string | null;
  created_at: string;
}

export interface DecisionRow {
  id: string;
  deal_id: string;
  deal_score: number;
  risk_score: number;
  recommendation: Recommendation;
  reasoning_json: string[];
  created_at: string;
}

export interface OutcomeRow {
  id: string;
  deal_id: string;
  status: OutcomeStatus;
  notes: string | null;
  updated_at: string;
}

export async function getCurrentUserAndOrg() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, organizationId: null };

  const { data: membership } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  return { user, organizationId: membership?.id ?? null };
}
