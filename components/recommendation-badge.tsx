import { Badge } from "@/components/ui/badge";
import { Recommendation } from "@/types/deal";

const styleByRecommendation: Record<Recommendation, string> = {
  APPROVE: "bg-emerald-500/15 text-emerald-700",
  REJECT: "bg-red-500/15 text-red-700",
  RENEGOTIATE: "bg-amber-500/15 text-amber-700",
  REVIEW_MANUALLY: "bg-slate-500/15 text-slate-700",
};

export function RecommendationBadge({ recommendation }: { recommendation: Recommendation }) {
  return <Badge className={styleByRecommendation[recommendation]}>{recommendation.replace("_", " ")}</Badge>;
}
