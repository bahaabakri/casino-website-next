import type { Metadata } from "next";
import { getSitePageBySlug } from "@/server/cms-page/cms-page";
import { getPageSections } from "@/server/page-section/page-section";
import { getSiteConfig } from "@/server/site/site";
import { getPageMetadata } from "@/utils/seo";
import { PageSections } from "./page-sections/page-sections";

const homeSlug = "home";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  const page = await getSitePageBySlug(siteConfig.id, homeSlug);

  return getPageMetadata(page);
}

export default async function Home() {
  const siteConfig = await getSiteConfig();
  const page = await getSitePageBySlug(siteConfig.id, homeSlug);

  const sections = await getPageSections(page.id);

  return (
    <div>
      <PageSections sections={sections} site={siteConfig} />
    </div>
  );
}
