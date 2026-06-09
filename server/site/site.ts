import "server-only";
import { SiteConfig } from "./site.type";

function getRequiredEnv(name: "CMS_API_URL" | "CMS_SITE_ID"): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const apiUrl = getRequiredEnv("CMS_API_URL");
  const siteId = getRequiredEnv("CMS_SITE_ID");
  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/sites/${encodeURIComponent(siteId)}`,
    {
      next: {
        revalidate: 300,
        tags: [`site-config-${siteId}`],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch site config (${response.status} ${response.statusText})`,
    );
  }

  const siteConfig: unknown = await response.json();

  if (
    typeof siteConfig !== "object" ||
    siteConfig === null ||
    Array.isArray(siteConfig)
  ) {
    throw new Error("CMS returned an invalid site config");
  }

  return siteConfig as SiteConfig;
}
