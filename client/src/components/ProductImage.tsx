import { useState } from "react";
import { Sparkles, ImageOff } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: "square" | "portrait" | "video";
  loading?: "lazy" | "eager";
  fallbackSrc?: string;
}

export function ProductImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  aspectRatio = "square",
  loading = "lazy",
  fallbackSrc = "/gavyadhenu-logo.png",
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "portrait"
      ? "aspect-[3/4]"
      : "aspect-video";

  return (
    <div
      className={`relative overflow-hidden bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center ${aspectClass} ${containerClassName}`}
    >
      {/* Loading Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 animate-pulse flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-neutral-300 dark:text-neutral-600 animate-spin" />
        </div>
      )}

      {/* Main Image */}
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-neutral-400 bg-neutral-100 dark:bg-neutral-800">
          {fallbackSrc && fallbackSrc !== src ? (
            <img
              src={fallbackSrc}
              alt={alt}
              className="w-16 h-16 object-contain opacity-60 mb-2"
            />
          ) : (
            <ImageOff className="w-8 h-8 mb-1 opacity-50" />
          )}
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            Gavyadhenu Pure
          </span>
        </div>
      )}
    </div>
  );
}

export default ProductImage;
