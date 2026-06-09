type Media = {
  id: number;
  name: string;
  url: string;
};

type SitePage = {
  id: number;
  title: string;
  slug: string;
  type: string;
  isHome: boolean;
  isPublished: boolean;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaImage: Media | null;
  settings: {
    showHeader: boolean;
    showFooter: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

export type SiteConfig = {
  id: number;
  name: string;
  slug: string;
  domain: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
  defaultSeoImage: Media | null;
  socialLinks: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    youtube: string | null;
    tiktok: string | null;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  logo: Media | null;
  pages: SitePage[];
};