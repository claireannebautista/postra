import { buildPrompt } from "./prompt";
import { parseGeneration, type Generation } from "./parse-generation";
import type { Brief } from "./brief";

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

type GeminiPart = { text?: string; thought?: boolean };

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
  }>;
  error?: { message?: string };
};

export type GenerateDeps = {
  fetchImpl?: typeof fetch;
  apiKey?: string;
  model?: string;
  fresh?: boolean;
};

function readModelText(payload: GeminiResponse) {
  const parts = payload.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((part) => part.text && part.thought !== true)
    .map((part) => part.text)
    .join("")
    .trim();
}

async function requestGemini(
  prompt: string,
  deps: Required<Pick<GenerateDeps, "fetchImpl" | "apiKey" | "model">>,
) {
  const response = await deps.fetchImpl(
    `${ENDPOINT}/${deps.model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": deps.apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 2048,
        },
      }),
      signal: AbortSignal.timeout(60000),
    },
  );

  const payload = (await response.json().catch(() => null)) as GeminiResponse | null;
  if (!response.ok || payload?.error) {
    const detail = payload?.error?.message ?? `Gemini returned ${response.status}`;
    throw new Error(detail);
  }

  const text = payload ? readModelText(payload) : "";
  if (!text) {
    throw new Error("Gemini returned an empty caption.");
  }
  return text;
}

export async function generateCaption(
  brief: Brief,
  deps: GenerateDeps = {},
): Promise<Generation> {
  const apiKey = deps.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const fetchImpl = deps.fetchImpl ?? fetch;
  const model = deps.model ?? process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
  let lastText = "";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const prompt =
      attempt === 0
        ? buildPrompt(brief, { fresh: deps.fresh })
        : `${buildPrompt(brief, { fresh: deps.fresh })}\n\nThe previous reply was not valid JSON with exactly 5 hashtags. Reply with JSON only.`;

    lastText = await requestGemini(prompt, { fetchImpl, apiKey, model });
    const parsed = parseGeneration(lastText);
    if (parsed) return parsed;
  }

  throw new Error(
    `Model returned an unusable caption: ${lastText.slice(0, 180)}`,
  );
}
