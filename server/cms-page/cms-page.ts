import "server-only";
import type { CmsPage } from "./cms-page.type";

function getCmsApiUrl(): string {
  const apiUrl = process.env.CMS_API_URL;

  if (!apiUrl) {
    throw new Error("Missing required environment variable: CMS_API_URL");
  }

  return apiUrl;
}

export async function getSitePages(siteId: number): Promise<CmsPage[]> {
  const apiUrl = getCmsApiUrl();
  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/pages?siteId=${encodeURIComponent(siteId)}`,
    {
      next: {
        revalidate: 300,
        tags: [`cms-pages-${siteId}`],
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CMS pages (${response.status} ${response.statusText})`,
    );
  }

  const pages: unknown = await response.json();

  if (
    typeof pages !== "object" ||
    pages === null ||
    Array.isArray(pages) ||
    !("data" in pages) ||
    !Array.isArray(pages.data)
  ) {
    throw new Error("CMS returned an invalid pages list");
  }

  return pages.data;
}

export async function getSitePageBySlug(siteId: number, slug: string): Promise<CmsPage> {
  if (typeof slug !== "string" || slug.trim() === "") {
    throw new Error("Page slug must be a non-empty string");
  }

  const apiUrl = getCmsApiUrl();
  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/pages/${encodeURIComponent(slug)}?siteId=${encodeURIComponent(siteId)}`,
    {
      next: {
        revalidate: 300,
        tags: [`cms-page-${slug}`],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CMS page (${response.status} ${response.statusText})`,
    );
  }

  const page: unknown = await response.json();

  if (typeof page !== "object" || page === null || Array.isArray(page)) {
    throw new Error("CMS returned an invalid page");
  }

  return page as CmsPage;
}
