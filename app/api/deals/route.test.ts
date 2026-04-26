import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/deals/route";

const createClientMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => createClientMock(),
}));

function mockSupabaseClient({
  user = { id: "user-1" },
  org = { id: "org-1" },
  deal = { id: "deal-1" },
}: {
  user?: { id: string } | null;
  org?: { id: string } | null;
  deal?: { id: string } | null;
}) {
  const single = vi.fn().mockResolvedValue({ data: null, error: null });
  const select = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single }) });

  const from = vi.fn((table: string) => {
    if (table === "organizations") {
      return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: org, error: null }) }) }) };
    }
    if (table === "deals") {
      return {
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: deal, error: null }),
          }),
        }),
      };
    }
    if (table === "decisions" || table === "outcomes") {
      return { insert: vi.fn().mockResolvedValue({ error: null }) };
    }
    return { select, single };
  });

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    from,
  };
}

describe("POST /api/deals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is unauthenticated", async () => {
    createClientMock.mockResolvedValue(mockSupabaseClient({ user: null }));
    const req = new Request("http://localhost/api/deals", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when payload is invalid", async () => {
    createClientMock.mockResolvedValue(mockSupabaseClient({}));
    const req = new Request("http://localhost/api/deals", {
      method: "POST",
      body: JSON.stringify({ company_name: "x" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates decision successfully for valid payload", async () => {
    createClientMock.mockResolvedValue(mockSupabaseClient({}));
    const req = new Request("http://localhost/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: "Nova",
        contact_name: "Ari",
        deal_type: "customer",
        expected_revenue: 100000,
        strategic_value: 8,
        complexity: 4,
        logo_value: 6,
        payment_risk: 4,
        notes: "Test",
      }),
    });

    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.decisionId).toBe("deal-1");
  });
});
