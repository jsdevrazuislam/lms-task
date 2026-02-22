"use client";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import { AuthLayoutInner } from "@/app/(auth)/AuthLayoutInner";
import { AuthSidePanel } from "@/app/(auth)/AuthSidePanel";
import { useAuth } from "@/features/auth/hooks/useAuth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : "Invalid or missing verification token.",
  );
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!token) return;

    if (hasStarted.current) return;
    hasStarted.current = true;

    const verify = async () => {
      try {
        const result = await verifyEmail(token);
        setStatus("success");
        setMessage(result.message);
      } catch (err: unknown) {
        const errorMessage =
          (
            err as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          )?.response?.data?.message ||
          (err as Error).message ||
          "Verification failed.";
        setStatus("error");
        setMessage(errorMessage);
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="text-center bg-card p-10 rounded-2xl border border-border shadow-soft animate-scale-in">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Verifying your email</h2>
          <p className="text-muted-foreground">
            Please wait while we confirm your account...
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Email Verified!</h2>
          <p className="text-muted-foreground mb-8">{message}</p>
          <Link
            href="/login"
            className="w-full py-3 px-6 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg shadow-primary/20"
            style={{ background: "var(--gradient-primary)" }}
          >
            Go to Login <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Verification Failed</h2>
          <p className="text-muted-foreground mb-8">{message}</p>
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline text-sm"
          >
            Back to sign in
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayoutInner
      sidePanel={
        <AuthSidePanel
          title="Security First"
          subtitle="We verify every account to ensure a safe and high-quality learning community."
          icon={<CheckCircle2 className="w-10 h-10 text-white" />}
        />
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthLayoutInner>
  );
}
