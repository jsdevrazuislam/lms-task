"use client";

import { Play, ExternalLink } from "lucide-react";
import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PromoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
  poster?: string;
}

export const PromoPreviewModal: React.FC<PromoPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  videoUrl,
  poster = "/placeholder-course.png",
}) => {
  const videoDetails = useMemo(() => {
    if (!videoUrl) return null;

    // YouTube Detection
    const ytMatch = videoUrl.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    if (ytMatch) {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`,
      };
    }

    // Vimeo Detection
    const vimeoMatch = videoUrl.match(
      /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/,
    );
    if (vimeoMatch) {
      return {
        type: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      };
    }

    // Facebook Detection
    if (videoUrl.includes("facebook.com") || videoUrl.includes("fb.watch")) {
      return {
        type: "facebook",
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=0&autoplay=1`,
      };
    }

    // Default to File (MP4/Cloudinary)
    return {
      type: "file",
      url: videoUrl,
    };
  }, [videoUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-black border-none ring-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <DialogHeader className="p-4 bg-background border-b sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="aspect-video w-full bg-black flex items-center justify-center relative bg-linear-to-b from-zinc-900 to-black">
          {!videoUrl ? (
            <div className="text-white/40 text-center p-12">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-10" />
              <p className="text-sm font-medium">
                Preview video is being processed or not provided
              </p>
            </div>
          ) : videoDetails?.type === "file" ? (
            <video
              src={videoDetails.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain shadow-2xl"
              poster={poster}
            />
          ) : (
            <iframe
              src={videoDetails?.embedUrl}
              className="w-full h-full absolute inset-0 border-none"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              title={title}
            />
          )}
        </div>

        <div className="p-6 bg-card border-t border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-foreground text-xl tracking-tight line-clamp-1">
                {title}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary text-white uppercase tracking-tighter">
                  Preview
                </span>
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  Course Content <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
