import type { Metadata } from "next";
import type { CmsPage } from "@/server/cms-page/cms-page.type";
import type { SiteConfig } from "@/server/site/site.type";
import { getMediaUrl } from "./media-url";

function getSiteUrl(domain: string): URL {
  if (/^https?:\/\//i.test(domain)) {
    return new URL(domain);
  }

  const protocol = domain.startsWith("localhost") ? "http" : "https";

  return new URL(`${protocol}://${domain}`);
}

export function getSiteMetadata(siteConfig: SiteConfig): Metadata {
  const siteUrl = getSiteUrl(siteConfig.domain);
  const title = siteConfig.defaultSeoTitle || siteConfig.name;
  const description = siteConfig.defaultSeoDescription || undefined;
  const image = siteConfig.defaultSeoImage
    ? getMediaUrl(siteConfig.defaultSeoImage.url)
    : undefined;

  return {
    metadataBase: siteUrl,
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: siteConfig.name,
      images: image
        ? [
            {
              url: image,
              alt: siteConfig.defaultSeoImage?.name || siteConfig.name,
            },
          ]
        : undefined,
      type: "website",
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function getPageMetadata(page: CmsPage): Metadata {
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || page.description || undefined;
  const image = page.metaImage ? getMediaUrl(page.metaImage.url) : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image
        ? [
            {
              url: image,
              alt: page.metaImage?.name || title,
            },
          ]
        : undefined,
      type: "website",
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
