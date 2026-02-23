"use client";

import { Play } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  videoUrl,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-none ring-0">
        <DialogHeader className="p-4 bg-background border-b sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full bg-black flex items-center justify-center">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full"
              poster="/placeholder-course.jpg"
            />
          ) : (
            <div className="text-white text-center p-8">
              <Play className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm opacity-60">No preview video available</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-background">
          <h3 className="font-bold text-foreground line-clamp-1">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">Course Preview</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
