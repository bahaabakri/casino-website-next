"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type GalleryImage = {
  url: string;
  alt: string;
};

export function ImageGalleryCarousel({
  images,
  title,
  description,
  showAllHref,
  showAllLabel,
}: {
  images: GalleryImage[];
  title: string | null;
  description: string | null;
  showAllHref: string;
  showAllLabel: string;
}) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const activeIndexRef = useRef(0);

  const scrollToIndex = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current;
      const normalizedIndex = (index + images.length) % images.length;
      const nextSlide = scroller?.children[normalizedIndex];

      activeIndexRef.current = normalizedIndex;

      if (nextSlide instanceof HTMLElement) {
        autoScrollRef.current = true;
        scroller?.scrollTo({
          left: nextSlide.offsetLeft,
          behavior: "smooth",
        });
        window.setTimeout(() => {
          autoScrollRef.current = false;
        }, 700);
      }
    },
    [images.length],
  );

  const updateActiveIndexFromScroll = useCallback(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const slidePositions = Array.from(scroller.children).map((child) =>
      child instanceof HTMLElement ? child.offsetLeft : 0,
    );
    const closestIndex = slidePositions.reduce((closest, position, index) => {
      const closestDistance = Math.abs(
        slidePositions[closest] - scroller.scrollLeft,
      );
      const distance = Math.abs(position - scroller.scrollLeft);

      return distance < closestDistance ? index : closest;
    }, 0);

    activeIndexRef.current = closestIndex;
  }, []);

  const pauseAutoPlay = useCallback(() => {
    if (!autoScrollRef.current) {
      isUserInteractingRef.current = true;
      updateActiveIndexFromScroll();
      setIsAutoPlaying(false);
    }
  }, [updateActiveIndexFromScroll]);

  const resumeAutoPlay = useCallback(() => {
    isUserInteractingRef.current = false;
    updateActiveIndexFromScroll();
    setIsAutoPlaying(true);
  }, [updateActiveIndexFromScroll]);

  const handleScroll = useCallback(() => {
    if (isUserInteractingRef.current && !autoScrollRef.current) {
      updateActiveIndexFromScroll();
    }
  }, [updateActiveIndexFromScroll]);

  const moveBy = useCallback(
    (offset: number) => {
      pauseAutoPlay();
      scrollToIndex(activeIndexRef.current + offset);
    },
    [pauseAutoPlay, scrollToIndex],
  );

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      scrollToIndex(activeIndexRef.current + 1);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [images.length, isAutoPlaying, scrollToIndex]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div onPointerLeave={resumeAutoPlay}>
      <div className="mb-8 flex items-start justify-between gap-4">
        {title || description ? (
          <div className="min-w-0 max-w-2xl">
            {title ? (
              <h2 className="text-xl font-bold tracking-normal sm:text-2xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-3 text-base leading-7 text-foreground/70">
                {description}
              </p>
            ) : null}
          </div>
        ) : (
          <div />
        )}

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={showAllHref}
            className="mr-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {showAllLabel}
          </Link>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Show previous gallery image"
                onClick={() => moveBy(-1)}
                onFocus={pauseAutoPlay}
                onBlur={resumeAutoPlay}
                className="flex size-9 items-center justify-center rounded-site border border-foreground/15 bg-background text-lg font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                aria-label="Show next gallery image"
                onClick={() => moveBy(1)}
                onFocus={pauseAutoPlay}
                onBlur={resumeAutoPlay}
                className="flex size-9 items-center justify-center rounded-site border border-foreground/15 bg-background text-lg font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                <span aria-hidden="true">›</span>
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={pauseAutoPlay}
        onTouchStart={pauseAutoPlay}
        onTouchEnd={resumeAutoPlay}
        onTouchCancel={resumeAutoPlay}
        onWheel={pauseAutoPlay}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="relative aspect-4/3 min-w-[min(72vw,18rem)] snap-start overflow-hidden rounded-site bg-foreground/5"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              unoptimized
              sizes="(min-width: 1024px) 288px, 72vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
