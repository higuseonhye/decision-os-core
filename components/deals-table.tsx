import Link from "next/link";
import { RecommendationBadge } from "@/components/recommendation-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OutcomeStatus, Recommendation } from "@/types/deal";

interface DealTableItem {
  deal_id: string;
  created_at: string;
  company_name: string;
  deal_score: number;
  recommendation: Recommendation;
  outcome: OutcomeStatus | null;
}

export function DealsTable({ deals }: { deals: DealTableItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Recommendation</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Outcome</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deals.map((deal) => (
          <TableRow key={deal.deal_id}>
            <TableCell>{new Date(deal.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <Link href={`/deals/${deal.deal_id}`} className="font-medium hover:underline">
                {deal.company_name}
              </Link>
            </TableCell>
            <TableCell>{deal.deal_score}</TableCell>
            <TableCell>
              <RecommendationBadge recommendation={deal.recommendation} />
            </TableCell>
            <TableCell>Open</TableCell>
            <TableCell>{deal.outcome ?? "pending"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
