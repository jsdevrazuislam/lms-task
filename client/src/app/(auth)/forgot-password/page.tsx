import { Mail, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { AuthLayoutInner } from "@/app/(auth)/AuthLayoutInner";
import { AuthSidePanel } from "@/app/(auth)/AuthSidePanel";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Recover your LearnFlow account access by resetting your password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayoutInner
      sidePanel={
        <AuthSidePanel
          title="Reset your password"
          subtitle="We'll send a secure magic link to your email so you can get back in."
          icon={<Mail className="w-10 h-10 text-white" />}
        />
      }
    >
      <ForgotPasswordForm />

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>
    </AuthLayoutInner>
  );
}
