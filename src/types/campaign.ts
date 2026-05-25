export type CampaignStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "DRAFT";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spend: number;
  leads: number;
  createdAt: string;
  updatedAt: string;
  budgetUtilization: number;
  costPerLead: number | null;
}

export interface CampaignsResponse {
  data: Campaign[];
  total: number;
}