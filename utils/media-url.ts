import "server-only";

function getCmsApiUrl(): string {
  const apiUrl = process.env.CMS_API_URL;

  if (!apiUrl) {
    throw new Error("Missing required environment variable: CMS_API_URL");
  }

  return apiUrl;
}

export function getMediaUrl(path: string | null | undefined): string {
  if (!path) {
    return "";
  }

  if (/^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  const baseUrl = getCmsApiUrl().replace(/\/$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  return `${baseUrl}/${normalizedPath}`;
}
