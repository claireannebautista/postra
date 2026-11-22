export type Generation = {
  caption: string;
  hashtags: [string, string, string, string, string];
  suggestion: string;
};

const HASHTAG_PATTERN = /^[\p{L}\p{N}_]+$/u;

export function normalizeHashtag(value: unknown) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim().replace(/^#+/u, "").replace(/\s+/gu, "");
  if (!cleaned || cleaned.length > 40) return null;
  if (!HASHTAG_PATTERN.test(cleaned)) return null;
  return cleaned;
}

function readJson(raw: string): unknown {
  const trimmed = raw
    .trim()
    .replace(/^```(?:json)?\s*/iu, "")
    .replace(/\s*```$/u, "");

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

export function parseGeneration(raw: string): Generation | null {
  const parsed = readJson(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  const record = parsed as Record<string, unknown>;
  const caption = typeof record.caption === "string" ? record.caption.trim() : "";
  const suggestion =
    typeof record.suggestion === "string" ? record.suggestion.trim() : "";

  if (!caption || caption.length > 2000) return null;
  if (!suggestion || suggestion.length > 500) return null;
  if (!Array.isArray(record.hashtags) || record.hashtags.length !== 5) {
    return null;
  }

  const hashtags = record.hashtags.map(normalizeHashtag);
  if (hashtags.some((tag) => tag === null)) return null;

  const normalized = hashtags as [string, string, string, string, string];
  const unique = new Set(normalized.map((tag) => tag.toLocaleLowerCase()));
  if (unique.size !== 5) return null;

  return { caption, hashtags: normalized, suggestion };
}
