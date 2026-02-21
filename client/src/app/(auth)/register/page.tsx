import { Metadata } from "next";
import Link from "next/link";
import { AuthLayoutInner } from "@/app/(auth)/AuthLayoutInner";
import { AuthSidePanel } from "@/app/(auth)/AuthSidePanel";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join LearnFlow today and start your learning journey with AI-powered courses.",
};

export default function RegisterPage() {
  return (
    <AuthLayoutInner
      sidePanel={
        <AuthSidePanel
          title="Start your learning journey today"
          subtitle="Join 50,000+ learners and grow your skills with world-class courses."
          features={[
            "14-day free trial, no credit card required",
            "Access 8,000+ expert-led courses",
            "Team analytics & progress tracking",
            "Certificate of completion",
          ]}
        />
      }
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Create your account</h2>
        <p className="text-muted-foreground">
          Get started for free — no credit card needed
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayoutInner>
  );
}
