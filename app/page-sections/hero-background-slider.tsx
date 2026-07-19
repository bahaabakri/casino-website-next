"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroBackgroundSlider({
  imageUrls,
  imageAlt,
}: {
  imageUrls: string[];
  imageAlt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % imageUrls.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [imageUrls.length]);

  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0">
      {imageUrls.map((imageUrl, index) => (
        <Image
          key={`${imageUrl}-${index}`}
          src={imageUrl}
          alt={index === 0 ? imageAlt : ""}
          fill
          unoptimized
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-40" : "opacity-0"
          }`}
        />
      ))}
      {imageUrls.length > 1 ? (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {imageUrls.map((imageUrl, index) => (
            <button
              key={`${imageUrl}-control-${index}`}
              type="button"
              aria-label={`Show hero image ${index + 1}`}
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
  );
}
