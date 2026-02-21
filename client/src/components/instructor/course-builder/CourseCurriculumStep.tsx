import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { CurriculumModule } from "@/components/instructor/course-builder/CurriculumModule";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CourseFormValues } from "@/features/course/types/course-form";

interface CourseCurriculumStepProps {
  modules: CourseFormValues["modules"];
  onDragEnd: (result: DropResult) => void;
  appendModule: (data: CourseFormValues["modules"][number]) => void;
  removeModule: (index: number) => void;
}

export const CourseCurriculumStep: React.FC<CourseCurriculumStepProps> = ({
  modules,
  onDragEnd,
  appendModule,
  removeModule,
}) => {
  const {
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  const addModule = () => {
    appendModule({
      id: crypto.randomUUID().substring(0, 8),
      title: `Section ${modules.length + 1}`,
      lessons: [],
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Step 3: Curriculum Builder
            </CardTitle>
            <CardDescription>
              Organize your course into sections and lessons.
            </CardDescription>
          </div>
          <Button type="button" onClick={addModule} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="modules" type="module">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-6"
                >
                  {modules.map((module, mIdx) => (
                    <CurriculumModule
                      key={module.id}
                      module={module}
                      mIdx={mIdx}
                      removeModule={removeModule}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {modules.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/5">
              <p className="text-muted-foreground mb-4">
                You haven&apos;t added any sections yet.
              </p>
              <Button
                type="button"
                onClick={() =>
                  appendModule({
                    id: crypto.randomUUID().substring(0, 8),
                    title: "Course Introduction",
                    lessons: [],
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Building
              </Button>
            </div>
          )}
          {errors.modules && typeof errors.modules.message === "string" && (
            <p className="text-sm text-destructive mt-4 text-center">
              {errors.modules.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
