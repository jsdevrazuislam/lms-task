"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/FormInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/lib/validations/auth";

function ResetPasswordFormContent() {
  const [showPass, setShowPass] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword, isResetting, error: authError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    try {
      await resetPassword({ token, password: data.password });
      setIsSuccess(true);
    } catch {
      // Error handled by useAuth
    }
  };

  if (!token) {
    return (
      <div className="text-center p-6 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
        <p className="font-semibold">Invalid or missing reset token.</p>
        <Link
          href="/login"
          className="text-sm hover:underline mt-2 inline-block"
        >
          Back to login
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center bg-card p-8 rounded-2xl border border-border shadow-soft animate-scale-in">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Password updated!</h2>
        <p className="text-muted-foreground mb-8">
          Your password has been reset successfully. You can now use your new
          password to sign in.
        </p>
        <Link
          href="/login"
          className="w-full py-3 px-6 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: "var(--gradient-primary)" }}
        >
          Sign in <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Set new password</h2>
      <p className="text-muted-foreground mb-8">
        Please enter at least 8 characters for your new password.
      </p>

      {authError && (
        <div className="p-3 rounded-lg bg-destructive-muted text-destructive text-sm font-medium border border-destructive/20 mb-4 animate-fade-in">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="New Password"
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          {...register("password")}
          error={errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
        />
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          {...register("confirmPassword")}
          error={errors.confirmPassword}
        />
        <button
          type="submit"
          disabled={isResetting}
          className="w-full py-3 px-6 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--gradient-primary)" }}
        >
          {isResetting ? "Resetting..." : "Reset password"}
          {!isResetting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
