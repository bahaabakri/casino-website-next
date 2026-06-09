type Media = {
  id: number;
  name: string;
  url: string;
};

export type CmsPage = {
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
