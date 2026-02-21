import { ChevronLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
}

interface AddCourseHeaderProps {
  steps: Step[];
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export const AddCourseHeader: React.FC<AddCourseHeaderProps> = ({
  steps,
  activeStep,
  setActiveStep,
}) => {
  const router = useRouter();

  return (
    <header className="bg-card border rounded-md relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Instructor Console
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Create New Course
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Transform your expertise into a world-class learning experience.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-full border">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => router.push("/dashboard/instructor")}
            >
              <ChevronLeft className="w-3 h-3 mr-1" />
              Back
            </Button>
            <div className="h-4 w-px bg-border mx-1" />
            <div className="px-3 py-1 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Draft Mode
              </span>
            </div>
          </div>
        </div>

        <div className="pb-4 relative overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[600px] px-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              const isCompleted = activeStep > index;

              return (
                <div key={step.id} className="flex items-center relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) setActiveStep(index);
                    }}
                    disabled={!isCompleted && activeStep !== index}
                    className={`flex flex-col items-center gap-2 group transition-all duration-300 ${!isCompleted && !isActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 transform border shadow-sm ${
                        isActive
                          ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20 ring-4 ring-primary/10 border-primary"
                          : isCompleted
                            ? "bg-primary/5 text-primary border-primary/20"
                            : "bg-background text-muted-foreground border-dashed"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>

                  {index < steps.length - 1 && (
                    <div className="w-24 sm:w-32 lg:w-40 h-[2px] mx-4 bg-muted relative mb-6">
                      <div
                        className={`absolute inset-0 bg-primary transition-all duration-700 ease-in-out shadow-[0_0_8px_rgba(var(--primary),0.5)]`}
                        style={{ width: isCompleted ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
