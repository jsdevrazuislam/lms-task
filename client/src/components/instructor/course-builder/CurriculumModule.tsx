import { Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Plus } from "lucide-react";
import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CurriculumLesson } from "@/components/instructor/course-builder/CurriculumLesson";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseFormValues } from "@/features/course/types/course-form";

interface CurriculumModuleProps {
  module: CourseFormValues["modules"][number];
  mIdx: number;
  removeModule: (index: number) => void;
}

export const CurriculumModule: React.FC<CurriculumModuleProps> = ({
  module,
  mIdx,
  removeModule,
}) => {
  const { register, control } = useFormContext<CourseFormValues>();
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `modules.${mIdx}.lessons`,
  });

  const addLesson = () => {
    appendLesson({
      id: crypto.randomUUID().substring(0, 8),
      title: "New Lesson",
      contentType: "text" as const,
      isPreview: false,
      content: "",
      videoUrl: "",
    });
  };

  return (
    <Draggable draggableId={module.id} index={mIdx}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="border rounded-xl bg-muted/20 overflow-hidden"
        >
          <div className="bg-muted/40 p-4 flex items-center gap-3 border-b">
            <div {...provided.dragHandleProps}>
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
            </div>
            <div className="flex-1">
              <Input
                className="font-semibold text-base h-8 px-0 border-none focus-visible:ring-0 bg-transparent shadow-none"
                placeholder="Section Title"
                {...register(`modules.${mIdx}.title`)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => removeModule(mIdx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <Droppable droppableId={`module-${module.id}`} type="lesson">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="p-4 space-y-3"
              >
                {lessonFields.map((lesson, lIdx) => (
                  <CurriculumLesson
                    key={lesson.id}
                    lesson={lesson}
                    mIdx={mIdx}
                    lIdx={lIdx}
                    removeLesson={removeLesson}
                  />
                ))}
                {provided.placeholder}

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full border-2 border-dashed border-muted-foreground/10 h-10 text-xs text-muted-foreground hover:bg-muted/50"
                  onClick={addLesson}
                >
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  Add Lesson
                </Button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
