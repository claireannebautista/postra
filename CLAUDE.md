# Postra agent guide

Postra helps a Filipino MSME owner write one social caption. Stay inside that MVP.

## Product boundaries

- One page, one `POST /api/generate` route, Gemini on the server.
- Do not add authentication, a database, payments, image generation, or automatic posting.
- The browser may send a brief. It must never receive `GEMINI_API_KEY`.
- A successful response is one caption, exactly five hashtags, and one creative suggestion.

## Where to change things

- Form labels, choices, and length limits live in `lib/brief.ts`. The page and the route both use `validateBrief`.
- Prompt wording lives in `lib/prompt.ts`.
- Reply checking lives in `lib/parse-generation.ts`.
- The Gemini call lives in `lib/generate-caption.ts`. Postra currently uses `gemini-3.5-flash-lite`, configured through `GEMINI_MODEL` in the server environment.



- Keep Route Handlers in `app/api`. This Next.js version’s notes are in `node_modules/next/dist/docs/`. Read them before changing routing or caching.

## Checks

- Run `npm test` after editing `lib/`.
- Run `npm run lint` before handing work off.
- CI uses Node.js 24 LTS. Do not pin the workflow back to Node 20.

## Copy and tone

Write interface text in plain English. Generated captions follow the owner’s language choice: English, Filipino, or Taglish. Explain failures in one sentence and let the owner try again.
