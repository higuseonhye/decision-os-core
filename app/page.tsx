import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="space-y-6">
        <p className="text-sm text-muted-foreground">Open-source infrastructure for AI-native decisions</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight">
          Companies used to run on software. Next-generation companies run on decision systems.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Deal Gate helps founders structure inbound deal decisions with repeatable logic, instant recommendations, and outcome tracking.
        </p>
        <div className="flex gap-3">
          <Link href="/auth/sign-up" className={cn(buttonVariants({ size: "lg" }))}>
            Start Free <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <Link href="/auth/sign-in" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            View Product
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Problem", "Inbound opportunities are judged inconsistently and too late."],
          ["Why Now", "AI-native teams need a shared operating layer for decisions."],
          ["Decision Flow", "Submit request, review instantly, and close the loop with outcomes."],
        ].map(([title, description]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Product snapshot</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="flex h-56 items-center justify-center rounded-lg border border-dashed bg-card text-sm text-muted-foreground"
            >
              Screenshot placeholder {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <ul className="grid gap-3 text-sm">
          {["Deterministic scoring engine", "Deal recommendation with risk flags", "Feedback loop for future learning"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
