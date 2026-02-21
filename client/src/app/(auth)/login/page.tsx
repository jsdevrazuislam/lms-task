import { Metadata } from "next";
import Link from "next/link";
import { AuthLayoutInner } from "@/app/(auth)/AuthLayoutInner";
import { AuthSidePanel } from "@/app/(auth)/AuthSidePanel";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Access your LearnFlow account and continue your learning journey.",
};

export default function LoginPage() {
  return (
    <AuthLayoutInner
      sidePanel={
        <AuthSidePanel
          title={
            <>
              Unlock your team&apos;s{" "}
              <span className="gradient-text">full potential</span>
            </>
          }
          subtitle="The enterprise LMS trusted by 10,000+ companies. Deliver impactful learning at scale."
        />
      }
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Welcome back
        </h2>
        <p className="text-muted-foreground">
          Sign in to your account to continue learning
        </p>
      </div>

      <LoginForm />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground bg-background px-4">
          OR CONTINUE WITH
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline"
        >
          Create one free
        </Link>
      </p>
    </AuthLayoutInner>
  );
}
