<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Postra

Postra is a caption helper for Filipino MSMEs. Keep the MVP to one page, one Gemini route, and no accounts or database.

- Read `CLAUDE.md` before changing product behavior.
- Keep `GEMINI_API_KEY` on the server. Never prefix it with `NEXT_PUBLIC_`.
- Share validation in `lib/brief.ts` so the form and `POST /api/generate` agree.
- Run `npm test` after changing `lib/`.

## Postra

Postra is a caption helper for Filipino MSMEs. Keep the MVP to one page, one Gemini route, and no accounts or database.

- Read `CLAUDE.md` before changing product behavior.
- Keep `GEMINI_API_KEY` on the server. Never prefix it with `NEXT_PUBLIC_`.
- Share validation in `lib/brief.ts` so the form and `POST /api/generate` agree.
- Run `npm test` after changing `lib/`.
