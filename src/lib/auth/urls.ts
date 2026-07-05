let cachedBaseUrl: string | undefined;
let cachedEnvSignature: string | undefined;

function getDefaultOrigin(defaultOrigin?: string): string {
  if (defaultOrigin?.trim()) return defaultOrigin.trim();
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "http://localhost:3000";
}

function getEnvSignature(defaultOrigin: string): string {
  return JSON.stringify({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "",
    appUrl: process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "",
    defaultOrigin: defaultOrigin.trim(),
  });
}

export function resolvePublicBaseUrl(defaultOrigin?: string) {
  const normalizedDefaultOrigin = getDefaultOrigin(defaultOrigin);
  const envSignature = getEnvSignature(normalizedDefaultOrigin);

  if (cachedBaseUrl !== undefined && cachedEnvSignature === envSignature) {
    return cachedBaseUrl;
  }

  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const resolved = explicit
    ? explicit.replace(/\/+$/, "")
    : process.env.NEXT_PUBLIC_APP_URL?.trim()
      ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, "")
      : normalizedDefaultOrigin.replace(/\/+$/, "");

  cachedBaseUrl = resolved;
  cachedEnvSignature = envSignature;
  return cachedBaseUrl;
}

export function buildAuthRedirectUrl(path: string, defaultOrigin?: string) {
  const baseUrl = resolvePublicBaseUrl(defaultOrigin);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
