"use client";

import { ImageIcon } from "lucide-react";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CustomImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackIcon?: React.ReactNode;
  containerClassName?: string;
  priority?: boolean;
}

export function CustomImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackIcon,
  priority,
  ...props
}: CustomImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted w-full h-full",
        containerClassName,
      )}
    >
      {(isLoading || hasError) && (
        <div className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-none" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40 p-4 text-center">
              {fallbackIcon || <ImageIcon className="h-10 w-10 opacity-20" />}
            </div>
          )}
        </div>
      )}

      {!hasError && (
        <Image
          {...props}
          src={src}
          alt={alt}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={cn(
            "transition-all duration-500 w-full h-full",
            props.fill ? "object-cover" : "",
            isLoading && !priority
              ? "opacity-0 scale-105"
              : "opacity-100 scale-100",
            className,
          )}
        />
      )}
    </div>
  );
}
