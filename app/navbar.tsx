import Link from "next/link";
import Image from "next/image";
import { getSitePages } from "@/server/cms-page/cms-page";
import type { SiteConfig } from "@/server/site/site.type";
import { getMediaUrl } from "@/utils/media-url";
import { NavLink } from "./nav-link";

function getPageHref(page: { slug: string; isHome: boolean }): string {
  return page.isHome ? "/" : `/${page.slug.replace(/^\/+/, "")}`;
}

export async function Navbar({ siteConfig }: { siteConfig: SiteConfig }) {
  const pages = (await getSitePages(siteConfig.id))
    .filter((page) => page.isPublished && page.settings.showHeader)
    .sort((first, second) => {
      if (first.isHome) return -1;
      if (second.isHome) return 1;

      return first.title.localeCompare(second.title);
    });

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/95 backdrop-blur">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center text-base font-semibold tracking-normal"
        >
          {siteConfig.logo ? (
            <Image
              src={getMediaUrl(siteConfig.logo.url)}
              alt={siteConfig.logo.name || siteConfig.name}
              width={160}
              height={40}
              unoptimized
              className="h-10 w-auto max-w-40 object-contain"
            />
          ) : (
            <span className="truncate">{siteConfig.name}</span>
          )}
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto">
          {pages.map((page) => (
            <NavLink key={page.id} href={getPageHref(page)}>
              {page.title}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
