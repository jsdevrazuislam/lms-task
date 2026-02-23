import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface AddCourseFooterProps {
  activeStep: number;
  totalSteps: number;
  prevStep: () => void;
  nextStep: () => void;
  isEditMode?: boolean;
  isSubmitting?: boolean;
}

export const AddCourseFooter: React.FC<AddCourseFooterProps> = ({
  activeStep,
  totalSteps,
  prevStep,
  nextStep,
  isEditMode,
  isSubmitting,
}) => {
  return (
    <div className="flex items-center justify-between py-8 px-6 bg-card rounded-2xl border">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={activeStep === 0 || isSubmitting}
        size="lg"
        className="rounded-xl px-8"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="hidden sm:flex flex-col items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          Step {activeStep + 1} of {totalSteps}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeStep ? "w-6 bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isEditMode && (
          <Button
            type="submit"
            size="lg"
            variant="outline"
            disabled={isSubmitting}
            className="rounded-xl px-8 border-primary text-primary hover:bg-primary/5"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        )}

        {activeStep < totalSteps - 1 ? (
          <Button
            type="button"
            onClick={nextStep}
            size="lg"
            className="rounded-xl px-10 shadow-lg shadow-primary/25"
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="rounded-xl px-10 shadow-lg shadow-primary/25"
          >
            {isSubmitting
              ? isEditMode
                ? "Saving..."
                : "Publishing..."
              : isEditMode
                ? "Save & Exit"
                : "Publish Course"}
          </Button>
        )}
      </div>
    </div>
  );
};
