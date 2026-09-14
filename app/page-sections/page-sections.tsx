import type {
  PageSection,
  PageSectionContent,
} from "@/server/page-section/page-section.type";
import { getPageSectionById } from "@/server/page-section/page-section";
import type { SiteConfig } from "@/server/site/site.type";
import { ContactUsFormSection } from "./contact-us-form-section";
import { ContactUsInfoSection } from "./contact-us-info-section";
import { HeroSection } from "./hero-section";
import { ImageGallerySection } from "./image-gallery-section";
import { SliderSection } from "./slider-section";

type SectionComponent = ({
  content,
  site,
}: {
  content: PageSectionContent;
  site: SiteConfig;
}) => React.ReactNode;

const sectionRegistry: Record<string, SectionComponent> = {
  "contact-us-form": ContactUsFormSection,
  "contact-us-info": ContactUsInfoSection,
  hero: HeroSection,
  sliders: SliderSection,
  "images-gallery": ImageGallerySection,
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
