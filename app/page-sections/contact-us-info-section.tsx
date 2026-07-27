import type { PageSectionContent } from "@/server/page-section/page-section.type";
import type { SiteConfig } from "@/server/site/site.type";

function getString(content: PageSectionContent, key: string): string | null {
  const value = content[key];

  return typeof value === "string" && value.trim() ? value : null;
}

function getMailToHref(email: string): string {
  return `mailto:${email}`;
}

export function ContactUsInfoSection({
  content,
}: {
  content: PageSectionContent;
  site: SiteConfig;
}) {
  const phone = getString(content, "phone");
  const email = getString(content, "email");
  const address = getString(content, "address");

  if (!phone && !email && !address) {
    return null;
  }

  return (
    <section className="bg-background py-12 text-foreground">
      <div className="mx-auto grid max-w-3xl gap-4 px-4 sm:px-6 lg:px-8">
        {phone ? (
          <div className="rounded-site border border-foreground/10 bg-background p-5">
            <p className="text-sm font-semibold text-foreground/60">Phone</p>
            <p className="mt-2 text-base font-medium">{phone}</p>
          </div>
        ) : null}

        {email ? (
          <div className="rounded-site border border-foreground/10 bg-background p-5">
            <p className="text-sm font-semibold text-foreground/60">Email</p>
            <a
              href={getMailToHref(email)}
              className="mt-2 inline-flex text-base font-medium text-primary underline-offset-4 hover:underline"
            >
              {email}
            </a>
          </div>
        ) : null}

        {address ? (
          <div className="rounded-site border border-foreground/10 bg-background p-5">
            <p className="text-sm font-semibold text-foreground/60">Address</p>
            <p className="mt-2 whitespace-pre-line text-base font-medium">
              {address}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
