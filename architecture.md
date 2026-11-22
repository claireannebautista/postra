# Architecture notes

Postra is a small Next.js 16 App Router application. The browser collects a brief. A Route Handler on the server asks Gemini for one caption and checks the reply before sending it back.

```
Caption form
    |  POST /api/generate
    v
validateBrief (lib/brief.ts)
    |
    v
buildPrompt (lib/prompt.ts)
    |
    v
Gemini generateContent  (GEMINI_API_KEY, server only)
    |
    v
parseGeneration (lib/parse-generation.ts)
    |
    v
Caption, 5 hashtags, 1 suggestion
```

`POST` is not cached. Each Generate and Regenerate click is a new model call. Postra does not write to a database.

## Modules

| Path | Responsibility |
| --- | --- |
| `app/page.tsx` | Page shell and introduction |
| `components/caption-studio.tsx` | Form state, client validation, loading, errors, copy |
| `app/api/generate/route.ts` | Accepts the brief, calls Gemini, returns JSON or an error |
| `lib/brief.ts` | Allowed choices, length limits, and `validateBrief` |
| `lib/prompt.ts` | Turns a valid brief into the model prompt |
| `lib/parse-generation.ts` | Requires one caption, exactly five hashtags, and one suggestion |
| `lib/generate-caption.ts` | Server-only Gemini request and one retry when the JSON is unusable |

The form and the route both call `validateBrief`, so a request that skips the form still has to pass the same checks.

## Model

The route calls the Gemini REST API:

`POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`

The code fallback is `gemini-2.5-flash`. `GEMINI_MODEL` in the server environment overrides that fallback. The example environment file selects `gemini-3.5-flash-lite`. The key is sent in the `x-goog-api-key` header and is read from `GEMINI_API_KEY` inside the server module. It is not prefixed with `NEXT_PUBLIC_`.

The request asks for JSON with `responseMimeType: application/json`. The parser still checks the payload, because a schema request can come back short or duplicated. A failed parse triggers one stricter retry, then a 502 with a generic message. The model error is logged on the server and is not shown in the browser.

Regenerate sends the same brief with `fresh: true`, which asks for a different opening line.

## Deployment shape

GitHub Actions (`.github/workflows/ci.yml`) runs on Node.js 24 LTS: install, lint, unit test, and production build. The build does not need a real key, because the key is read only when a caption is requested.

Vercel can host the app as a Next.js project. Set `GEMINI_API_KEY` in the project environment for Production and Preview. Do not commit `.env.local`. `.env.example` lists the variable names only.

## What this design leaves out

There is no session, user table, or post history. The caption exists in the browser until the owner refreshes the page.
