"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/FormInput";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    console.log("Resetting password for:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSent(true);
  };

  if (isSent) {
    return (
      <div className="text-center bg-card p-8 rounded-2xl border border-border shadow-soft animate-scale-in">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Check your email</h2>
        <p className="text-muted-foreground mb-8">
          We&apos;ve sent password reset instructions to your email address.
        </p>
        <button
          onClick={() => setIsSent(false)}
          className="text-primary font-semibold hover:underline text-sm"
        >
          Didn&apos;t receive the email? Click to retry
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Forgot password?</h2>
      <p className="text-muted-foreground mb-8">
        No worries, we&apos;ll send you reset instructions.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email address"
          type="email"
          placeholder="you@company.com"
          icon={<Mail className="w-4 h-4" />}
          {...register("email")}
          error={errors.email}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--gradient-primary)" }}
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </>
  );
}
