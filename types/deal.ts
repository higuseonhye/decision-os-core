export type DealType = "customer" | "partner" | "vendor" | "pilot";

export type Recommendation =
  | "APPROVE"
  | "REJECT"
  | "RENEGOTIATE"
  | "REVIEW_MANUALLY";

export type OutcomeStatus = "won" | "lost" | "bad_fit" | "delayed" | "pending";

export interface DealInput {
  company_name: string;
  contact_name: string;
  deal_type: DealType;
  expected_revenue: number;
  strategic_value: number;
  complexity: number;
  logo_value: number;
  payment_risk: number;
  notes: string | null;
}

export interface DecisionResult {
  dealScore: number;
  riskScore: number;
  recommendation: Recommendation;
  reasoning: string[];
  revenueUpside: string;
  riskFlags: string[];
  nextAction: string;
}
