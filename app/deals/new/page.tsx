import { NewDealForm } from "@/components/new-deal-form";

export default function NewDealPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <h1 className="mb-4 text-3xl font-semibold tracking-tight">Submit Inbound Deal</h1>
      <p className="mb-6 text-muted-foreground">
        Capture opportunity context once. Decision OS computes score, risk, and recommendation instantly.
      </p>
      <NewDealForm />
    </div>
  );
}
