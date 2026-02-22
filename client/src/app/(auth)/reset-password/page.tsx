import { Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthLayoutInner } from "@/app/(auth)/AuthLayoutInner";
import { AuthSidePanel } from "@/app/(auth)/AuthSidePanel";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Create a new secure password for your LearnFlow account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayoutInner
      sidePanel={
        <AuthSidePanel
          title="Secure your account"
          subtitle="Choose a strong password to protect your learning progress and personal data."
          icon={<Lock className="w-10 h-10 text-white" />}
        />
      }
    >
      <Suspense
        fallback={
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>
    </AuthLayoutInner>
  );
}
