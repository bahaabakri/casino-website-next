import Link from "next/link";
import type { PageSectionContent } from "@/server/page-section/page-section.type";
import type { SiteConfig } from "@/server/site/site.type";
import { getMediaUrl } from "@/utils/media-url";
import { HeroBackgroundSlider } from "./hero-background-slider";

function getString(content: PageSectionContent, key: string): string | null {
  const value = content[key];

  return typeof value === "string" && value.trim() ? value : null;
}

function hasImagePath(item: unknown): item is { imagePath: string } {
  return (
    typeof item === "object" &&
    item !== null &&
    "imagePath" in item &&
    typeof item.imagePath === "string" &&
    item.imagePath.trim() !== ""
  );
}

function getBackgroundImageUrls(content: PageSectionContent): string[] {
  const backgroundImages = content.backgroundImages;

  if (!Array.isArray(backgroundImages)) {
    return [];
  }

  return backgroundImages.flatMap((item) => {
    if (hasImagePath(item)) {
      return [getMediaUrl(item.imagePath)];
    }

    return [];
  });
}

export function HeroSection({
  content,
  site,
}: {
  content: PageSectionContent;
  site: SiteConfig;
}) {
  const title = getString(content, "title");
  const subtitle = getString(content, "subtitle");
  const buttonText = getString(content, "buttonText");
  const buttonLink = getString(content, "buttonLink");
  const imageUrls = getBackgroundImageUrls(content);

  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <HeroBackgroundSlider imageUrls={imageUrls} imageAlt={title ?? site.name} />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {title ? <h1 className="max-w-3xl text-4xl font-bold">{title}</h1> : null}
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-lg text-background/80">{subtitle}</p>
        ) : null}
        {buttonText && buttonLink ? (
          <Link
            href={buttonLink}
            className="mt-8 inline-flex items-center justify-center rounded-md bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background/90"
          >
            {buttonText}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
