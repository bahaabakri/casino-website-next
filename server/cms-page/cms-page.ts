import "server-only";
import type { CmsPage } from "./cms-page.type";

function getCmsApiUrl(): string {
  const apiUrl = process.env.CMS_API_URL;

  if (!apiUrl) {
    throw new Error("Missing required environment variable: CMS_API_URL");
  }

  return apiUrl;
}

export async function getPageBySlug(slug: string): Promise<CmsPage> {
  if (typeof slug !== "string" || slug.trim() === "") {
    throw new Error("Page slug must be a non-empty string");
  }

  const apiUrl = getCmsApiUrl();
  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/pages/${encodeURIComponent(slug)}`,
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
