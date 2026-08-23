import type { PageSectionContent } from "@/server/page-section/page-section.type";
import type { SiteConfig } from "@/server/site/site.type";
import { getMediaUrl } from "@/utils/media-url";
import { ImageGalleryCarousel } from "./image-gallery-carousel";

type GalleryImage = {
  url: string;
  alt: string;
};

function getString(content: PageSectionContent, key: string): string | null {
  const value = content[key];

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

function getImageAlt(value: unknown, fallback: string): string {
  if (typeof value !== "object" || value === null) {
    return fallback;
  }

  const record = value as Record<string, unknown>;
  const alt = record.alt ?? record.altText ?? record.title ?? record.name;

  return typeof alt === "string" && alt.trim() ? alt : fallback;
}

function getImageItems(content: PageSectionContent): unknown[] {
  const fields = ["images", "galleryImages", "imageGallery", "items"];

  for (const field of fields) {
    const value = content[field];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function getGalleryImages(content: PageSectionContent, site: SiteConfig): GalleryImage[] {
  return getImageItems(content).flatMap((item, index) => {
    const imagePath = getImagePath(item);

    if (!imagePath) {
      return [];
    }

    return [
      {
        url: getMediaUrl(imagePath),
        alt: getImageAlt(item, `${site.name} gallery image ${index + 1}`),
      },
    ];
  });
}

export function ImageGallerySection({
  content,
  site,
}: {
  content: PageSectionContent;
  site: SiteConfig;
}) {
  const images = getGalleryImages(content, site);
  const title = getString(content, "title");
  const description = getString(content, "description");
  const showAllHref = getString(content, "showAllLink") ?? "/";
  const showAllLabel = getString(content, "showAllLabel") ?? "Show all";

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-4 text-foreground sm:py-8">
      <div className="container mx-auto">
        <ImageGalleryCarousel
          images={images}
          title={title}
          description={description}
          showAllHref={showAllHref}
          showAllLabel={showAllLabel}
        />
      </div>
    </section>
  );
}
