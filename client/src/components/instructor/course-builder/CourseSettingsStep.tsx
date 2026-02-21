import { CheckCircle2, Save, Loader2 } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CourseFormValues } from "@/features/course/types/course-form";

interface CourseSettingsStepProps {
  isSubmitting: boolean;
}

export const CourseSettingsStep: React.FC<CourseSettingsStepProps> = ({
  isSubmitting,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Step 4: Settings & SEO
          </CardTitle>
          <CardDescription>
            Optimize how your course appears in search results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="whatYouLearn">
              What Students Will Learn (One objective per line)
            </Label>
            <Textarea
              id="whatYouLearn"
              placeholder="e.g., Master React Hooks&#10;Build real-world projects&#10;Understand State Management"
              className="h-32"
              {...register("whatYouLearn")}
            />
            {errors.whatYouLearn && (
              <p className="text-xs text-destructive">
                {errors.whatYouLearn.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">
              Course Requirements (One per line)
            </Label>
            <Textarea
              id="requirements"
              placeholder="e.g., Basic JavaScript knowledge&#10;VS Code installed&#10;Passion for learning"
              className="h-32"
              {...register("requirements")}
            />
            {errors.requirements && (
              <p className="text-xs text-destructive">
                {errors.requirements.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Comma separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., react, tailwind, coding, beginner"
              {...register("tags")}
            />
            {errors.tags && (
              <p className="text-xs text-destructive">{errors.tags.message}</p>
            )}
            <p className="text-[10px] text-muted-foreground italic">
              Add keywords that students might use to find your course.
            </p>
          </div>

          <div className="space-y-10">
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
              <Textarea
                id="metaDescription"
                placeholder="A short summary for search engines..."
                className="h-24"
                {...register("metaDescription")}
              />
              {errors.metaDescription && (
                <p className="text-xs text-destructive">
                  {errors.metaDescription.message}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground">
                Appears in Google search results and social links.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5 shadow-2xl shadow-primary/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <CheckCircle2 className="w-32 h-32 text-primary rotate-12" />
        </div>
        <CardContent className="pt-16 pb-16 text-center relative z-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce transition-all duration-1000">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2
            className="text-3xl font-bold mb-3 tracking-tight"
            id="publish-title"
          >
            Ready to Go Live?
          </h2>
          <p className="text-muted-foreground mb-10 text-base max-w-md mx-auto leading-relaxed">
            Your course looks exceptional! Click publish to join our community
            of world-class instructors and start reaching students.
          </p>
          <div className="flex justify-center flex-col sm:flex-row gap-4 max-w-sm mx-auto">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full sm:w-auto min-w-[240px] h-14 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all duration-300"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
              ) : (
                <Save className="w-5 h-5 mr-3" />
              )}
              Publish Course
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
