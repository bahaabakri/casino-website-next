"use client";

import { SiteConfig } from "@/server/site/site.type";
import { createContext, useContext, type ReactNode } from "react";

const SiteConfigContext = createContext<SiteConfig | null>(null);

export function SiteConfigProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: SiteConfig;
}) {
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  const siteConfig = useContext(SiteConfigContext);

  if (!siteConfig) {
    throw new Error("useSiteConfig must be used within SiteConfigProvider");
  }

  return siteConfig;
}
