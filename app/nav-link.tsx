"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function normalizePath(path: string): string {
  if (path === "/") {
    return path;
  }

  return path.replace(/\/+$/, "");
}

export function NavLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  const pathname = usePathname();
  const isActive = normalizePath(pathname) === normalizePath(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "whitespace-nowrap rounded-[var(--site-radius)] px-3 py-2 text-sm font-medium transition",
        isActive
          ? "bg-[var(--site-primary-soft)] text-[var(--site-primary)]"
          : "text-foreground/75 hover:bg-[var(--site-secondary-soft)] hover:text-[var(--site-secondary)]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
