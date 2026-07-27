import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSitePageBySlug, getSitePages } from "@/server/cms-page/cms-page";
import { getPageSections } from "@/server/page-section/page-section";
import { getSiteConfig } from "@/server/site/site";
import type { CmsPage } from "@/server/cms-page/cms-page.type";
import { getPageMetadata } from "@/utils/seo";
import { PageSections } from "../page-sections/page-sections";

type CmsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function normalizeSlug(slug: string): string {
  return slug.replace(/^\/+|\/+$/g, "");
}

async function getPublishedPage(slug: string): Promise<CmsPage> {
  const normalizedSlug = normalizeSlug(slug);
  const siteConfig = await getSiteConfig();
  const pages = await getSitePages(siteConfig.id);

  const page = pages.find(
    (item) =>
      item.isPublished &&
      !item.isHome &&
      normalizeSlug(item.slug) === normalizedSlug,
  );

  if (!page) {
    notFound();
  }

  return getSitePageBySlug(siteConfig.id, normalizedSlug);
}

export async function generateMetadata({
  params,
}: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);

  return getPageMetadata(page);
}

export default async function CmsPageRoute({ params }: CmsPageProps) {
  const { slug } = await params;
  const [siteConfig, page] = await Promise.all([
    getSiteConfig(),
    getPublishedPage(slug),
  ]);
  const sections = await getPageSections(page.id);
  
  return (
    <div>
      <PageSections sections={sections} site={siteConfig} />
    </div>
  );
}
