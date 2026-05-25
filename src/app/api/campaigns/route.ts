import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });

    const enriched = campaigns.map((c) => ({
      ...c,
      budgetUtilization:
        c.budget > 0 ? Math.round((c.spend / c.budget) * 100) : 0,
      costPerLead: c.leads > 0 ? Math.round((c.spend / c.leads) * 100) / 100 : null,
    }));

    return NextResponse.json(
      { data: enriched, total: enriched.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/campaigns]", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}