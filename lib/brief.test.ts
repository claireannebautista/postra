import { describe, expect, it } from "vitest";
import { sampleBrief, validateBrief } from "./brief";

describe("validateBrief", () => {
  it("accepts a complete brief and trims the text fields", () => {
    const result = validateBrief({
      ...sampleBrief,
      name: "  Lola's Bibingka  ",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Lola's Bibingka");
      expect(result.value.platform).toBe("instagram");
    }
  });

  it("rejects a blank name and an unknown platform", () => {
    const result = validateBrief({
      ...sampleBrief,
      name: "   ",
      platform: "twitter",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toMatch(/name/i);
      expect(result.errors.platform).toMatch(/Facebook, Instagram, or TikTok/);
    }
  });
});
