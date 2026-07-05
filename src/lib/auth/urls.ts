let cachedBaseUrl: string | undefined;
let cachedEnvSignature: string | undefined;

function getEnvSignature(defaultOrigin: string): string {
  return JSON.stringify({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "",
    appUrl: process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "",
    defaultOrigin: defaultOrigin.trim(),
  });
}

export function resolvePublicBaseUrl(defaultOrigin = "http://localhost:3000") {
  const envSignature = getEnvSignature(defaultOrigin);

  if (cachedBaseUrl !== undefined && cachedEnvSignature === envSignature) {
    return cachedBaseUrl;
  }

  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const resolved = explicit
    ? explicit.replace(/\/+$/, "")
    : process.env.NEXT_PUBLIC_APP_URL?.trim()
      ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, "")
      : defaultOrigin.replace(/\/+$/, "");

  cachedBaseUrl = resolved;
  cachedEnvSignature = envSignature;
  return cachedBaseUrl;
}

export function buildAuthRedirectUrl(path: string, defaultOrigin = "http://localhost:3000") {
  const baseUrl = resolvePublicBaseUrl(defaultOrigin);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
