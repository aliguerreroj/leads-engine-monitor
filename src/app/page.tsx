import { CampaignsResponse, Campaign, CampaignStatus } from "@/types/campaign";

const STATUS_STYLES: Record<CampaignStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  DRAFT: "bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function UtilizationBar({ value }: { value: number }) {
  const capped = Math.min(value, 100);
  const color =
    value >= 90 ? "bg-red-500" : value >= 60 ? "bg-yellow-400" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 rounded-full bg-gray-200">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${capped}%` }}
        />
      </div>
      <span className="text-sm text-gray-600">{value}%</span>
    </div>
  );
}

async function getCampaigns(): Promise<CampaignsResponse> {
  const res = await fetch("http://localhost:3000/api/campaigns", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export default async function Home() {
  const { data: campaigns, total } = await getCampaigns();

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Campaign Performance Monitor
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            LeadsEngine · {total} campaigns tracked
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Active Campaigns", value: activeCampaigns },
            { label: "Total Budget", value: `$${totalBudget.toLocaleString()}` },
            { label: "Total Spend", value: `$${totalSpend.toLocaleString()}` },
            { label: "Total Leads", value: totalLeads.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {["Campaign", "Status", "Budget", "Spend", "Utilization", "Leads", "Cost / Lead"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c: Campaign) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {c.name}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ${c.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ${c.spend.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <UtilizationBar value={c.budgetUtilization} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.leads.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.costPerLead !== null ? `$${c.costPerLead}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
