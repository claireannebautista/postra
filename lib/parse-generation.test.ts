import { describe, expect, it } from "vitest";
import { parseGeneration } from "./parse-generation";

const valid = {
  caption: "Buy 2 bibingka, get 1 puto. Perfect for merienda.",
  hashtags: ["Bibingka", "Quezon City", "Merienda", "SupportLocal", "Puto"],
  suggestion: "Film the cheese pull while the bibingka is still hot.",
};

describe("parseGeneration", () => {
  it("returns one caption, exactly five hashtags, and one suggestion", () => {
    const result = parseGeneration(JSON.stringify(valid));

    expect(result).toEqual({
      caption: valid.caption,
      hashtags: ["Bibingka", "QuezonCity", "Merienda", "SupportLocal", "Puto"],
      suggestion: valid.suggestion,
    });
  });

  it("rejects a payload that does not have exactly five hashtags", () => {
    expect(
      parseGeneration(
        JSON.stringify({ ...valid, hashtags: valid.hashtags.slice(0, 4) }),
      ),
    ).toBeNull();

    expect(
      parseGeneration(
        JSON.stringify({ ...valid, hashtags: [...valid.hashtags, "Extra"] }),
      ),
    ).toBeNull();
  });

  it("reads JSON wrapped in a markdown fence", () => {
    const fenced = "```json\n" + JSON.stringify(valid) + "\n```";
    expect(parseGeneration(fenced)?.caption).toBe(valid.caption);
  });
});
