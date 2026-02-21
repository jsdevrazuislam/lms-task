"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/FormInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";

export function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const { login, isLoggingIn, error } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      remember: false,
    },
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("remember", true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    if (data.remember) {
      localStorage.setItem("rememberedEmail", data.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-destructive-muted text-destructive text-sm font-medium border border-destructive/20 animate-fade-in">
          {error}
        </div>
      )}
      <FormInput
        label="Email address"
        type="email"
        placeholder="you@company.com"
        icon={<Mail className="w-4 h-4" />}
        {...register("email")}
        error={errors.email}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <FormInput
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          {...register("password")}
          error={errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember"
          {...register("remember")}
          className="rounded border-border"
        />
        <label htmlFor="remember" className="text-sm text-muted-foreground">
          Remember me for 30 days
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoggingIn}
        className="w-full py-3 px-6 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 hover:shadow-primary active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--gradient-primary)" }}
      >
        {isLoggingIn ? "Signing in..." : "Sign in to LearnFlow"}
        {!isLoggingIn && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
}
