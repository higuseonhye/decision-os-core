import { describe, expect, it } from "vitest";
import { evaluateDeal } from "@/lib/decision-engine";

describe("evaluateDeal", () => {
  it("returns APPROVE for high deal and low risk", () => {
    const result = evaluateDeal({
      company_name: "A",
      contact_name: "B",
      deal_type: "customer",
      expected_revenue: 250000,
      strategic_value: 9,
      complexity: 2,
      logo_value: 8,
      payment_risk: 2,
      notes: null,
    });

    expect(result.recommendation).toBe("APPROVE");
    expect(result.dealScore).toBeGreaterThanOrEqual(220);
    expect(result.riskScore).toBeLessThan(95);
  });

  it("returns RENEGOTIATE for high deal and high risk", () => {
    const result = evaluateDeal({
      company_name: "A",
      contact_name: "B",
      deal_type: "partner",
      expected_revenue: 260000,
      strategic_value: 8,
      complexity: 8,
      logo_value: 7,
      payment_risk: 8,
      notes: null,
    });

    expect(result.recommendation).toBe("RENEGOTIATE");
  });

  it("returns REJECT for low deal and high risk", () => {
    const result = evaluateDeal({
      company_name: "A",
      contact_name: "B",
      deal_type: "pilot",
      expected_revenue: 10000,
      strategic_value: 2,
      complexity: 8,
      logo_value: 1,
      payment_risk: 8,
      notes: null,
    });

    expect(result.recommendation).toBe("REJECT");
  });

  it("returns REVIEW_MANUALLY for mixed case", () => {
    const result = evaluateDeal({
      company_name: "A",
      contact_name: "B",
      deal_type: "vendor",
      expected_revenue: 50000,
      strategic_value: 5,
      complexity: 5,
      logo_value: 4,
      payment_risk: 5,
      notes: null,
    });

    expect(result.recommendation).toBe("REVIEW_MANUALLY");
  });
});
