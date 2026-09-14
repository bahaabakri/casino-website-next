import type { PageSectionContent } from "@/server/page-section/page-section.type";
import type { SiteConfig } from "@/server/site/site.type";
import { getMediaUrl } from "@/utils/media-url";
import { SliderHero, type SliderSlide } from "./slider-hero";

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function getImagePath(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value !== "object" || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const directPath =
    record.imagePath ?? record.path ?? record.url ?? record.src ?? record.imageUrl;

  if (typeof directPath === "string" && directPath.trim()) {
    return directPath;
  }

  return getImagePath(record.image);
}

function getButtonFields(item: Record<string, unknown>): {
  buttonText: string | null;
  buttonLink: string | null;
} {
  const button = item.button;

  if (typeof button === "object" && button !== null) {
    const buttonRecord = button as Record<string, unknown>;

    return {
      buttonText:
        getString(buttonRecord.text) ??
        getString(buttonRecord.label) ??
        getString(buttonRecord.buttonText),
      buttonLink:
        getString(buttonRecord.link) ??
        getString(buttonRecord.href) ??
        getString(buttonRecord.buttonLink) ??
        getString(buttonRecord.url),
    };
  }

  return {
    buttonText: getString(item.buttonText) ?? getString(item.buttonLabel),
    buttonLink: getString(item.buttonLink) ?? getString(item.buttonHref),
  };
}

function getSlides(content: PageSectionContent, site: SiteConfig): SliderSlide[] {
  const sliders = content.sliders;

  if (!Array.isArray(sliders)) {
    return [];
  }

  return sliders.flatMap((item, index) => {
    if (typeof item !== "object" || item === null) {
      return [];
    }

    const record = item as Record<string, unknown>;
    const title = getString(record.title);
    const subtitle = getString(record.subtitle);
    const { buttonText, buttonLink } = getButtonFields(record);
    const imagePath = getImagePath(
      record.backgroundImage ?? record.image ?? record,
    );

    if (!imagePath && !title && !subtitle && !buttonText) {
      return [];
    }

    return [
      {
        title,
        subtitle,
        buttonText,
        buttonLink,
        imageUrl: imagePath ? getMediaUrl(imagePath) : "",
        imageAlt: title ?? `${site.name} slide ${index + 1}`,
      },
    ];
  });
}

export function SliderSection({
  content,
  site,
}: {
  content: PageSectionContent;
  site: SiteConfig;
}) {
  const slides = getSlides(content, site);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative min-h-[min(70vh,32rem)] overflow-hidden bg-foreground text-background">
      <SliderHero slides={slides} />
    </section>
  );
}
