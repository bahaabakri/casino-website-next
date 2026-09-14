import "server-only";
import type { PageSection } from "@/server/page-section/page-section.type";

function getCmsApiUrl(): string {
  const apiUrl = process.env.CMS_API_URL;

  if (!apiUrl) {
    throw new Error("Missing required environment variable: CMS_API_URL");
  }

  return apiUrl.replace(/\/$/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getSectionFromResponse(section: unknown): PageSection {
  if (!isRecord(section)) {
    throw new Error("CMS returned an invalid page section");
  }

  if ("data" in section && isRecord(section.data)) {
    return section.data as PageSection;
  }

  if ("section" in section && isRecord(section.section)) {
    return section.section as PageSection;
  }

  return section as PageSection;
}

export async function getPageSections(pageId: number): Promise<PageSection[]> {
  if (!Number.isInteger(pageId) || pageId <= 0) {
    throw new Error("Page id must be a positive integer");
  }

  const apiUrl = getCmsApiUrl();
  const response = await fetch(
    `${apiUrl}/page-sections?pageId=${encodeURIComponent(pageId)}`,
    {
      next: {
        revalidate: 300,
        tags: [`page-sections-${pageId}`],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch page sections (${response.status} ${response.statusText})`,
    );
  }

  const sections: unknown = await response.json();
  if (!isRecord(sections)) {
    throw new Error("CMS returned an invalid page sections list");
  }

  if ("data" in sections && Array.isArray(sections.data)) {
    return sections.data;
  }

  if ("sections" in sections && Array.isArray(sections.sections)) {
    return sections.sections;
  }

  throw new Error("CMS returned an invalid page sections list");
}

export async function getPageSectionById(id: number): Promise<PageSection> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Page section id must be a positive integer");
  }

  const apiUrl = getCmsApiUrl();
  const response = await fetch(
    `${apiUrl}/page-sections/${encodeURIComponent(id)}`,
    process.env.NODE_ENV === "development"
      ? { cache: "no-store" }
      : {
          next: {
            revalidate: 300,
            tags: [`page-section-${id}`],
          },
        },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch page section (${response.status} ${response.statusText})`,
    );
  }

  return getSectionFromResponse(await response.json());
}
