export const LIMITS = {
  name: 80,
  description: 600,
  audience: 200,
} as const;

export const OFFERING_TYPES = [
  { value: "product", label: "Product", hint: "Goods you sell" },
  { value: "service", label: "Service", hint: "Work you do for customers" },
  { value: "event", label: "Event", hint: "A gathering or schedule" },
] as const;

export const PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
] as const;

export const GOALS = [
  { value: "introduce", label: "Introduce the offering" },
  { value: "promote_offer", label: "Promote an offer" },
  { value: "engagement", label: "Encourage engagement" },
  { value: "announce_event", label: "Announce an event" },
] as const;

export const TONES = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "playful", label: "Playful" },
] as const;

export const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "filipino", label: "Filipino" },
  { value: "taglish", label: "Taglish" },
] as const;

type Option = { value: string; label: string };

export type OfferingType = (typeof OFFERING_TYPES)[number]["value"];
export type Platform = (typeof PLATFORMS)[number]["value"];
export type Goal = (typeof GOALS)[number]["value"];
export type Tone = (typeof TONES)[number]["value"];
export type Language = (typeof LANGUAGES)[number]["value"];

export type Brief = {
  name: string;
  offeringType: OfferingType;
  description: string;
  audience: string;
  platform: Platform;
  goal: Goal;
  tone: Tone;
  language: Language;
};

export type BriefField = keyof Brief;

export type BriefErrors = Partial<Record<BriefField | "form", string>>;

export type ValidationResult =
  | { ok: true; value: Brief }
  | { ok: false; errors: BriefErrors };

function labelFor(options: readonly Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function offeringLabel(value: OfferingType) {
  return labelFor(OFFERING_TYPES, value);
}

export function platformLabel(value: Platform) {
  return labelFor(PLATFORMS, value);
}

export function goalLabel(value: Goal) {
  return labelFor(GOALS, value);
}

export function toneLabel(value: Tone) {
  return labelFor(TONES, value);
}

export function languageLabel(value: Language) {
  return labelFor(LANGUAGES, value);
}

function readString(data: Record<string, unknown>, key: string) {
  const value = data[key];
  return typeof value === "string" ? value.trim() : "";
}

function choice<T extends string>(
  value: string,
  options: readonly { value: T }[],
  message: string,
  errors: BriefErrors,
  field: BriefField,
): T | undefined {
  const match = options.find((option) => option.value === value);
  if (!match) {
    errors[field] = message;
    return undefined;
  }
  return match.value;
}

export function validateBrief(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: { form: "Check the form and try again." } };
  }

  const data = input as Record<string, unknown>;
  const errors: BriefErrors = {};

  const name = readString(data, "name");
  const description = readString(data, "description");
  const audience = readString(data, "audience");

  if (!name) {
    errors.name = "Add the name of your business or offering.";
  } else if (name.length > LIMITS.name) {
    errors.name = `Keep the name under ${LIMITS.name} characters.`;
  }

  if (!description) {
    errors.description = "Describe what you are posting about.";
  } else if (description.length > LIMITS.description) {
    errors.description = `Keep the description under ${LIMITS.description} characters.`;
  }

  if (!audience) {
    errors.audience = "Say who you want to reach.";
  } else if (audience.length > LIMITS.audience) {
    errors.audience = `Keep the audience under ${LIMITS.audience} characters.`;
  }

  const offeringType = choice(
    readString(data, "offeringType"),
    OFFERING_TYPES,
    "Choose product, service, or event.",
    errors,
    "offeringType",
  );
  const platform = choice(
    readString(data, "platform"),
    PLATFORMS,
    "Choose Facebook, Instagram, or TikTok.",
    errors,
    "platform",
  );
  const goal = choice(
    readString(data, "goal"),
    GOALS,
    "Choose what this post should do.",
    errors,
    "goal",
  );
  const tone = choice(
    readString(data, "tone"),
    TONES,
    "Choose a brand tone.",
    errors,
    "tone",
  );
  const language = choice(
    readString(data, "language"),
    LANGUAGES,
    "Choose a language.",
    errors,
    "language",
  );

  if (
    !name ||
    !description ||
    !audience ||
    !offeringType ||
    !platform ||
    !goal ||
    !tone ||
    !language ||
    Object.keys(errors).length > 0
  ) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      offeringType,
      description,
      audience,
      platform,
      goal,
      tone,
      language,
    },
  };
}

export const sampleBrief: Brief = {
  name: "Lola's Bibingka",
  offeringType: "product",
  description:
    "Warm bibingka baked every afternoon. This week, buy 2 and get a free puto.",
  audience: "Families and office workers in Quezon City",
  platform: "instagram",
  goal: "promote_offer",
  tone: "friendly",
  language: "taglish",
};
