import type { PageSectionContent } from "@/server/page-section/page-section.type";
import type { SiteConfig } from "@/server/site/site.type";
import { ContactForm } from "./contact-form";

function getString(content: PageSectionContent, key: string): string | null {
  const value = content[key];

  return typeof value === "string" && value.trim() ? value : null;
}

export function ContactUsFormSection({
  content,
  site,
}: {
  content: PageSectionContent;
  site: SiteConfig;
}) {
  const title = getString(content, "title") ?? getString(content, "name");
  const description = getString(content, "description");

  return (
    <section className="bg-background py-16 text-foreground sm:py-20">
      <div className="mx-auto grid max-w-3xl gap-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          {title ? (
            <h2 className="text-3xl font-bold tracking-normal sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-base leading-7 text-foreground/70">
              {description}
            </p>
          ) : null}
        </div>

        <ContactForm recipientEmail={site.email} />
      </div>
    </section>
  );
}
