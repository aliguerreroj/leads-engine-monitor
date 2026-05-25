import { PrismaClient, CampaignStatus } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const campaigns = [
  {
    name: "Summer Lead Gen — LATAM",
    status: CampaignStatus.ACTIVE,
    budget: 5000,
    spend: 3200.5,
    leads: 142,
  },
  {
    name: "Q2 Retargeting — US Market",
    status: CampaignStatus.ACTIVE,
    budget: 12000,
    spend: 11800.75,
    leads: 534,
  },
  {
    name: "Brand Awareness — EU",
    status: CampaignStatus.PAUSED,
    budget: 8000,
    spend: 4100.0,
    leads: 89,
  },
  {
    name: "Product Launch — SMB",
    status: CampaignStatus.COMPLETED,
    budget: 3000,
    spend: 3000.0,
    leads: 210,
  },
  {
    name: "Cold Outreach — SaaS Founders",
    status: CampaignStatus.DRAFT,
    budget: 2500,
    spend: 0,
    leads: 0,
  },
  {
    name: "Webinar Funnel — Q3",
    status: CampaignStatus.ACTIVE,
    budget: 6000,
    spend: 1750.25,
    leads: 67,
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.campaign.deleteMany();

  for (const campaign of campaigns) {
    await prisma.campaign.create({ data: campaign });
  }

  console.log(`Seeded ${campaigns.length} campaigns successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });