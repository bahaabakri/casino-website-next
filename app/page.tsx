import Image from "next/image";
import { useSiteConfig } from "./site-config-context";
import { getSiteConfig } from "@/server/site/site";

export default async function Home() {
  const siteConfig = await getSiteConfig();

  return (
    <div>
      <h1>{siteConfig.name}</h1>
      <p>{siteConfig.domain}</p>
    </div>
  );
}
