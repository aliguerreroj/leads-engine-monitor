import { GET } from "../route";

jest.mock("@/lib/db", () => ({
  prisma: {
    campaign: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: "clx001",
          name: "Test Campaign A",
          status: "ACTIVE",
          budget: 5000,
          spend: 2500,
          leads: 100,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-10"),
        },
        {
          id: "clx002",
          name: "Test Campaign B",
          status: "DRAFT",
          budget: 3000,
          spend: 0,
          leads: 0,
          createdAt: new Date("2024-01-05"),
          updatedAt: new Date("2024-01-05"),
        },
      ]),
    },
  },
}));

describe("GET /api/campaigns", () => {
  it("returns 200 with enriched campaign data", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.total).toBe(2);
    expect(body.data).toHaveLength(2);
  });

  it("computes budgetUtilization correctly", async () => {
    const response = await GET();
    const body = await response.json();
    const campaignA = body.data.find((c: { name: string }) => c.name === "Test Campaign A");

    expect(campaignA.budgetUtilization).toBe(50);
  });

  it("returns null costPerLead when leads is 0", async () => {
    const response = await GET();
    const body = await response.json();
    const campaignB = body.data.find((c: { name: string }) => c.name === "Test Campaign B");

    expect(campaignB.costPerLead).toBeNull();
  });

  it("computes costPerLead correctly when leads exist", async () => {
    const response = await GET();
    const body = await response.json();
    const campaignA = body.data.find((c: { name: string }) => c.name === "Test Campaign A");

    expect(campaignA.costPerLead).toBe(25);
  });
});