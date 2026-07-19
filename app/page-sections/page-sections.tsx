import type {
  PageSection,
  PageSectionContent,
} from "@/server/page-section/page-section.type";
import { getPageSectionById } from "@/server/page-section/page-section";
import type { SiteConfig } from "@/server/site/site.type";
import { HeroSection } from "./hero-section";

type SectionComponent = ({
  content,
  site,
}: {
  content: PageSectionContent;
  site: SiteConfig;
}) => React.ReactNode;

const sectionRegistry: Record<string, SectionComponent> = {
  hero: HeroSection,
};

function sortSections(first: PageSection, second: PageSection): number {
  return first.order - second.order;
}

export async function PageSections({
  sections,
  site,
}: {
  sections: PageSection[];
  site: SiteConfig;
}) {
  const activeSections = sections
    .filter((section) => section.isActive !== false)
    .sort(sortSections);
  const sectionDetails = await Promise.all(
    activeSections.map((section) => getPageSectionById(section.id)),
  );

  // console.log('sectionDetails', sectionDetails)

  return (
    <>
      {sectionDetails.map((section) => {
        const Component = sectionRegistry[section.sectionType.key];

        if (!Component) {
          return null;
        }

        return (
          <Component
            key={section.id}
            content={section.content ?? {}}
            site={site}
          />
        );
      })}
    </>
  );
}
