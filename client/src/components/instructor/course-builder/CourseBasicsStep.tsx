import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CourseFormValues } from "@/features/course/types/course-form";

interface CourseBasicsStepProps {
  categories?: { id: string; name: string }[];
  loadingCategories: boolean;
}

export const CourseBasicsStep: React.FC<CourseBasicsStepProps> = ({
  categories,
  loadingCategories,
}) => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CourseFormValues>();
  const isFree = watch("isFree");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Step 1: Basic Information
          </CardTitle>
          <CardDescription>
            Start with the fundamental details of your course.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2 min-w-0">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                placeholder="e.g., Professional Web Development Bootcamp"
                className="break-all"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2 min-w-0">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                placeholder="A short punchy line to describe your course"
                className="break-all"
                {...register("subtitle")}
              />
              {errors.subtitle && (
                <p className="text-xs text-destructive">
                  {errors.subtitle.message}
                </p>
              )}
            </div>

            <FormField
              control={control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  {loadingCategories ? (
                    <Skeleton className="h-10 w-full rounded-md" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="price">Sale Price ($)</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="isFree" className="text-xs cursor-pointer">
                      Free Course
                    </Label>
                    <Switch
                      id="isFree"
                      checked={isFree}
                      onCheckedChange={(val) => {
                        setValue("isFree", val);
                        if (val) {
                          setValue("price", 0, { shouldValidate: true });
                          setValue("originalPrice", 0, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                <Input
                  id="price"
                  type="number"
                  disabled={isFree}
                  placeholder="0.00"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  disabled={isFree}
                  placeholder="0.00"
                  {...register("originalPrice", { valueAsNumber: true })}
                />
                {errors.originalPrice && (
                  <p className="text-xs text-destructive">
                    {errors.originalPrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 12.5 hours, 4 weeks"
                  {...register("duration")}
                />
                {errors.duration && (
                  <p className="text-xs text-destructive">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <FormField
                control={control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2 min-w-0">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of what students will learn..."
                className="h-48 resize-none break-all"
                {...register("description")}
              />
              <div className="flex justify-end">
                <p className="text-[10px] text-muted-foreground italic">
                  Try to be as descriptive as possible (min. 50 characters)
                </p>
              </div>
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
