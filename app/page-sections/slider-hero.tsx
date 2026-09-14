"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type SliderSlide = {
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  imageUrl: string;
  imageAlt: string;
};

export function SliderHero({ slides }: { slides: SliderSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  if (!activeSlide) {
    return null;
  }

  return (
    <>
      <div className="absolute inset-0">
        {slides.map((slide, index) =>
          slide.imageUrl ? (
            <Image
              key={`${slide.imageUrl}-${index}`}
              src={slide.imageUrl}
              alt={index === activeIndex ? slide.imageAlt : ""}
              fill
              unoptimized
              priority={index === 0}
              sizes="100vw"
              className={`object-cover transition-opacity duration-1000 ${
                index === activeIndex ? "opacity-40" : "opacity-0"
              }`}
            />
          ) : null,
        )}
        {slides.length > 1 ? (
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={`${slide.imageUrl}-control-${index}`}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === activeIndex ? "bg-background" : "bg-background/40"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {activeSlide.title ? (
          <h1 className="max-w-3xl text-4xl font-bold">{activeSlide.title}</h1>
        ) : null}
        {activeSlide.subtitle ? (
          <p className="mt-4 max-w-2xl text-lg text-background/80">
            {activeSlide.subtitle}
          </p>
        ) : null}
        {activeSlide.buttonText && activeSlide.buttonLink ? (
          activeSlide.buttonLink.startsWith("http") ? (
            <a
              href={activeSlide.buttonLink}
              className="mt-8 inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background/90"
              target="_blank"
              rel="noopener noreferrer"
            >
              {activeSlide.buttonText}
            </a>
          ) : (
            <Link
              href={activeSlide.buttonLink}
              className="mt-8 inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background/90"
            >
              {activeSlide.buttonText}
            </Link>
          )
        ) : null}
      </div>
    </>
  );
}
