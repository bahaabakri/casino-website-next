export type PageSectionContent = Record<string, unknown>;

export type SectionFieldType =
  | "string"
  | "text"
  | "richtext"
  | "number"
  | "boolean"
  | "image"
  | "image[]"
  | "url"
  | "select"
  | "group"
  | "group[]";

export type SectionFieldSchema = {
  name: string;
  type: SectionFieldType;
  label?: string;
  required?: boolean;
  placeholder?: string;
  formFields?: SectionFieldSchema[];
};

export type PageSectionType = {
  id: number;
  key: string;
  name: string;
  category: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  contentSchema?: SectionFieldSchema[];
};

export type PageSection = {
  id: number;
  pageId: number;
  sectionTypeId: number;
  sectionType: PageSectionType;
  content: PageSectionContent | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
