import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <AuthForm mode="sign-in" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link href="/auth/sign-up" className="font-medium text-foreground">
          Sign up
        </Link>
      </p>
    </div>
  );
}
