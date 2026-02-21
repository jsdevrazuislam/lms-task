"use client";

import axios from "axios";
import Hls from "hls.js";
import { Loader2, AlertCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useVideoTicket } from "@/features/course/hooks/useVideoTicket";
import { cn } from "@/lib/utils";

interface SecureVideoPlayerProps {
  courseId: string;
  lessonId: string;
  className?: string;
  onProgress?: (progress: number) => void;
}

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  courseId,
  lessonId,
  className,
  onProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hlsError, setHlsError] = useState<string | null>(null);
  const MAX_RETRIES = 5;

  const {
    data: ticketData,
    isLoading: isTicketLoading,
    error: ticketError,
  } = useVideoTicket(courseId, lessonId);

  const streamUrl = ticketData?.data?.url;
  const fetchError = axios.isAxiosError(ticketError)
    ? ticketError.response?.data?.message
    : null;
  const errorMessage =
    fetchError ||
    (ticketError ? "Unauthorized or video not found" : null) ||
    hlsError;
  const isLoading = isTicketLoading;

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    let hls: Hls | null = null;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Autoplay or ready to play
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (retryCount < MAX_RETRIES) {
                const delay = Math.pow(2, retryCount) * 1000;
                console.warn(
                  `Fatal network error, retrying in ${delay / 1000}s... (Attempt ${retryCount + 1}/${MAX_RETRIES})`,
                );
                setTimeout(() => {
                  hls?.startLoad();
                  setRetryCount((prev) => prev + 1);
                }, delay);
              } else {
                console.error("Max retries reached for network error");
                setHlsError(
                  "Connection lost. Please check your internet and refresh.",
                );
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error encountered, recovering...");
              hls?.recoverMediaError();
              break;
            default:
              console.error("Unrecoverable error:", data.details);
              setHlsError("Playback error: " + data.details);
              hls?.destroy();
              break;
          }
        }
      });
      hls.on(Hls.Events.MANIFEST_LOADED, () => {
        setRetryCount(0);
        setHlsError(null);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS support
      video.src = streamUrl;
    } else {
      // Use a slight delay to avoid synchronous state update in effect warning
      const timeoutId = setTimeout(() => {
        setHlsError("Your browser does not support HLS streaming");
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl, retryCount]);

  const handleTimeUpdate = () => {
    if (videoRef.current && onProgress) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      onProgress(progress);
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "aspect-video bg-muted rounded-xl flex flex-col items-center justify-center gap-3 border shadow-inner",
          className,
        )}
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-medium text-muted-foreground animate-pulse">
          Initializing secure stream...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        className={cn(
          "aspect-video bg-destructive/5 rounded-xl flex flex-col items-center justify-center gap-2 border border-destructive/20 p-6 text-center",
          className,
        )}
      >
        <AlertCircle className="w-8 h-8 text-destructive" />
        <p className="text-sm font-semibold text-destructive">
          Secure Playback Blocked
        </p>
        <p className="text-[10px] text-muted-foreground">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl border border-white/10",
        className,
      )}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        playsInline
        controls
      />

      {/* Overlay for aesthetic */}
      {!isLoading && !errorMessage && (
        <div className="absolute top-4 left-4 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
            {retryCount > 0 ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Reconnecting... ({retryCount})
                </span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  Secure Stream
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
