import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

async function logout() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/sign-in");
}

export async function SiteNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href={user ? "/dashboard" : "/"} className="font-semibold tracking-tight">
          Decision OS Core
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Dashboard
              </Link>
              <Link href="/deals/new" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                New Deal
              </Link>
              <form action={logout}>
                <Button size="sm" variant="outline" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Sign In
              </Link>
              <Link href="/auth/sign-up" className={cn(buttonVariants({ size: "sm" }))}>
                Start Free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
