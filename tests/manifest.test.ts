import { afterEach, describe, expect, it, vi } from "vitest";
import manifest from "@/app/manifest";

afterEach(() => vi.unstubAllEnvs());

describe("home-screen installation manifest", () => {
  it.each([
    ["0", "/ignored", "/"],
    ["1", "/national-charity-fund", "/national-charity-fund/"],
    ["1", "", "/"],
  ])("keeps launch, scope and icons within the deployment path", (staticExport, basePath, root) => {
    vi.stubEnv("STATIC_EXPORT", staticExport);
    vi.stubEnv("PAGES_BASE_PATH", basePath);
    const config = manifest();
    expect(config.id).toBe(root);
    expect(config.start_url).toBe(root);
    expect(config.scope).toBe(root);
    for (const icon of config.icons ?? []) {
      expect(icon.src.startsWith(root)).toBe(true);
      expect(icon.type).toBe("image/png");
    }
  });

  it("provides standalone launch and required Android icon sizes", () => {
    const config = manifest();
    expect(config.name).toBeTruthy();
    expect(config.short_name).toBeTruthy();
    expect(config.display).toBe("standalone");
    expect(config.prefer_related_applications).toBe(false);
    expect(config.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ sizes: "192x192", purpose: "any" }),
      expect.objectContaining({ sizes: "512x512", purpose: "any" }),
      expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
    ]));
  });
});