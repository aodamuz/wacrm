import { afterEach, describe, expect, it } from "vitest";
import { buildAuthRedirectUrl, resolvePublicBaseUrl } from "./urls";

describe("auth URL helpers", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  afterEach(() => {
    if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;

    if (originalAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  });

  it("prefers NEXT_PUBLIC_SITE_URL when building the public base URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://crm.example.com/";
    delete process.env.NEXT_PUBLIC_APP_URL;

    expect(resolvePublicBaseUrl("http://localhost:3000")).toBe(
      "https://crm.example.com",
    );
  });

  it("falls back to NEXT_PUBLIC_APP_URL when SITE_URL is not configured", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://app.example.com/";

    expect(resolvePublicBaseUrl("http://localhost:3000")).toBe(
      "https://app.example.com",
    );
  });

  it("builds absolute auth redirect URLs from the configured base URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://crm.example.com";

    expect(buildAuthRedirectUrl("/join/demo-token")).toBe(
      "https://crm.example.com/join/demo-token",
    );
  });

  it("recomputes when the environment signature changes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://crm.example.com";
    expect(resolvePublicBaseUrl()).toBe("https://crm.example.com");

    process.env.NEXT_PUBLIC_SITE_URL = "https://staging.example.com";
    expect(resolvePublicBaseUrl()).toBe("https://staging.example.com");
  });
});
