"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form";
import { FormInput } from "@/components/shared/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";

export function RegisterForm() {
  const [showPass, setShowPass] = useState(false);
  const { register: registerUser, isRegistering, error } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "Student / Learner",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role === "Instructor / Educator" ? "INSTRUCTOR" : "STUDENT",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive-muted text-destructive text-sm font-medium border border-destructive/20 animate-fade-in">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First name"
            placeholder="John"
            icon={<User className="w-4 h-4" />}
            {...form.register("firstName")}
            error={form.formState.errors.firstName}
          />
          <FormInput
            label="Last name"
            placeholder="Doe"
            {...form.register("lastName")}
            error={form.formState.errors.lastName}
          />
        </div>

        <FormInput
          label="Work email"
          type="email"
          placeholder="you@company.com"
          icon={<Mail className="w-4 h-4" />}
          {...form.register("email")}
          error={form.formState.errors.email}
        />

        <FormInput
          label="Password"
          type={showPass ? "text" : "password"}
          placeholder="Min. 8 characters"
          icon={<Lock className="w-4 h-4" />}
          {...form.register("password")}
          error={form.formState.errors.password}
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

        <FormField
          control={form.control}
          name="role"
          render={({
            field,
          }: {
            field: ControllerRenderProps<RegisterFormData, "role">;
          }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full h-12! rounded-lg bg-card border-border focus:ring-primary/30 text-foreground">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-border shadow-elevated">
                  <SelectItem value="Student / Learner">
                    Student / Learner
                  </SelectItem>
                  <SelectItem value="Instructor / Educator">
                    Instructor / Educator
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({
            field,
          }: {
            field: ControllerRenderProps<RegisterFormData, "terms">;
          }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-1">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal text-muted-foreground cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isRegistering}
          className="w-full cursor-pointer py-3 px-6 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--gradient-primary)" }}
        >
          {isRegistering ? "Creating account..." : "Create free account"}
          {!isRegistering && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </Form>
  );
}
