import { DealInput, DecisionResult, Recommendation } from "@/types/deal";

const HIGH_DEAL_THRESHOLD = 220;
const HIGH_RISK_THRESHOLD = 95;

function getRecommendation(dealScore: number, riskScore: number): Recommendation {
  if (dealScore >= HIGH_DEAL_THRESHOLD && riskScore < HIGH_RISK_THRESHOLD) {
    return "APPROVE";
  }

  if (dealScore >= HIGH_DEAL_THRESHOLD && riskScore >= HIGH_RISK_THRESHOLD) {
    return "RENEGOTIATE";
  }

  if (dealScore < HIGH_DEAL_THRESHOLD && riskScore >= HIGH_RISK_THRESHOLD) {
    return "REJECT";
  }

  return "REVIEW_MANUALLY";
}

export function evaluateDeal(input: DealInput): DecisionResult {
  const dealScore =
    Math.round(input.expected_revenue / 1000) +
    input.strategic_value * 8 +
    input.logo_value * 5;

  const riskScore = input.complexity * 7 + input.payment_risk * 9;
  const recommendation = getRecommendation(dealScore, riskScore);

  const reasoning: string[] = [
    `Expected revenue contributes ${Math.round(input.expected_revenue / 1000)} points.`,
    `Strategic value contributes ${input.strategic_value * 8} points.`,
    `Reference logo value contributes ${input.logo_value * 5} points.`,
    `Complexity contributes ${input.complexity * 7} risk points.`,
    `Payment risk contributes ${input.payment_risk * 9} risk points.`,
  ];

  const riskFlags: string[] = [];
  if (input.payment_risk >= 7) riskFlags.push("High payment reliability risk.");
  if (input.complexity >= 7) riskFlags.push("High delivery complexity.");
  if (input.expected_revenue < 10000) riskFlags.push("Low revenue upside.");

  const nextActionByRecommendation: Record<Recommendation, string> = {
    APPROVE: "Send approval and move to contracting this week.",
    REJECT: "Politely decline and document reasons for future pattern learning.",
    RENEGOTIATE: "Renegotiate payment terms, scope, and milestone structure.",
    REVIEW_MANUALLY: "Escalate to founder review with weighted assumptions.",
  };

  return {
    dealScore,
    riskScore,
    recommendation,
    reasoning,
    revenueUpside: `$${input.expected_revenue.toLocaleString()} projected revenue`,
    riskFlags: riskFlags.length > 0 ? riskFlags : ["No critical risk flags detected."],
    nextAction: nextActionByRecommendation[recommendation],
  };
}
