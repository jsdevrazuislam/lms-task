import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";
import { AuthLayoutInner } from "@/app/(auth)/AuthLayoutInner";
import { AuthSidePanel } from "@/app/(auth)/AuthSidePanel";
import { VerifyEmailContent } from "./VerifyEmailContent";

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
