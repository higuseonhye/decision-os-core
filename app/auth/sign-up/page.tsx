import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <AuthForm mode="sign-up" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-medium text-foreground">
          Sign in
        </Link>
      </p>
    </div>
  );
}
