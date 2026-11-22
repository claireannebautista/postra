import { describe, expect, it } from "vitest";
import { sampleBrief } from "./brief";
import { buildPrompt } from "./prompt";

describe("buildPrompt", () => {
  it("includes the platform, goal, and language", () => {
    const prompt = buildPrompt(sampleBrief);

    expect(prompt).toContain("Instagram");
    expect(prompt).toContain("Promote an offer");
    expect(prompt).toContain("Taglish");
    expect(prompt).toContain("Lola's Bibingka");
  });

  it("asks for a different opening when regenerating", () => {
    const prompt = buildPrompt(sampleBrief, { fresh: true });
    expect(prompt).toContain("Change the opening line.");
  });
});
