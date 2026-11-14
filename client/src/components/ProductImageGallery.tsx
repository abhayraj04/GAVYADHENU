import { useState, useRef, MouseEvent } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ShieldCheck } from "lucide-react";
import { ProductImage } from "./ProductImage";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  category?: string;
  badge?: string;
}

export function ProductImageGallery({
  images,
  productName,
  category,
  badge,
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const activeImage = images[currentIndex] || "/gavyadhenu-logo.png";

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Main Image Stage */}
      <div
        ref={mainImageRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        className="relative w-full aspect-square bg-[#fbf9f5] dark:bg-neutral-900 rounded-3xl border border-[#ece4d6] dark:border-neutral-800 overflow-hidden group cursor-crosshair shadow-sm"
      >
        {/* Normal Image */}
        <div
          className={`w-full h-full p-6 transition-opacity duration-200 ${
            isZooming ? "opacity-0 md:opacity-0" : "opacity-100"
          }`}
        >
          <ProductImage
            src={activeImage}
            alt={`${productName} view ${currentIndex + 1}`}
            className="w-full h-full object-contain filter drop-shadow-md"
            aspectRatio="square"
            loading="eager"
          />
        </div>

        {/* Hover Magnifier / Lens View */}
        {isZooming && (
          <div
            className="absolute inset-0 pointer-events-none bg-no-repeat bg-contain"
            style={{
              backgroundImage: `url('${activeImage}')`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundSize: "260%",
              backgroundColor: "#fbf9f5",
            }}
          />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none z-10">
          {category && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2d5a27]/90 text-white tracking-wide shadow-sm backdrop-blur-sm">
              {category}
            </span>
          )}
          {badge && (
            <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-amber-500/90 text-white shadow-sm flex items-center gap-1 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              {badge}
            </span>
          )}
        </div>

        {/* Zoom Hint & Expand Button */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-white/80 dark:bg-neutral-800/80 backdrop-blur px-2.5 py-1 rounded-lg border border-neutral-200/60 shadow-sm pointer-events-none">
            <ZoomIn className="w-3.5 h-3.5 text-neutral-600" />
            Hover to zoom
          </span>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label="View full image"
            className="p-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 hover:bg-white text-neutral-700 dark:text-neutral-200 shadow-md border border-neutral-200/70 hover:scale-105 transition"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Prev / Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 dark:bg-neutral-800/85 text-neutral-700 dark:text-neutral-200 hover:bg-white shadow-md transition opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 dark:bg-neutral-800/85 text-neutral-700 dark:text-neutral-200 hover:bg-white shadow-md transition opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-2xl p-2 bg-[#fbf9f5] dark:bg-neutral-900 border-2 transition-all duration-200 overflow-hidden ${
                idx === currentIndex
                  ? "border-[#2d5a27] shadow-md ring-2 ring-[#2d5a27]/20 scale-105"
                  : "border-[#ece4d6] dark:border-neutral-800 hover:border-neutral-400 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              {idx === currentIndex && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-[#2d5a27]" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Preview */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-amber-400 p-2 transition"
              aria-label="Close fullscreen modal"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="w-full h-[70vh] flex items-center justify-center p-4">
              <img
                src={activeImage}
                alt={productName}
                className="max-w-full max-h-full object-contain filter drop-shadow-2xl"
              />
            </div>

            <div className="text-white text-center mt-3">
              <h3 className="text-lg font-semibold">{productName}</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-14 h-14 rounded-xl p-1 bg-white/10 border-2 transition ${
                      idx === currentIndex ? "border-amber-400 scale-110" : "border-white/20 opacity-60"
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductImageGallery;
