# Postra

Your AI Marketing Sidekick for Filipino micro, small, and medium businesses. Describe a product, service, or event and get one social caption, five hashtags, and a creative suggestion for Facebook, Instagram, or TikTok.

Postra does not create accounts, save posts, or publish for you.

## Setup

Use Node.js 24 LTS for the same runtime as GitHub Actions. Newer Node versions can run the app locally.

```bash
npm install
cp .env.example .env.local
```

Put your Gemini API key in `.env.local`:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
```

Start the application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to use Postra

1. Enter your business or offering name.
2. Select whether you're promoting a product, service, or event.
3. Describe your offering and target audience.
4. Choose Facebook, Instagram, or TikTok.
5. Select your content goal, brand tone, and preferred language.
6. Click **Generate Caption** to receive one caption, five hashtags, and a creative suggestion.
7. Use **Copy** to copy the caption and hashtags, or **Regenerate** to request another version.

## Scripts

- `npm run dev` starts the local app
- `npm test` runs the unit tests
- `npm run lint` runs ESLint
- `npm run build` creates a production build

## Deploying later

The GitHub Actions workflow in `.github/workflows/ci.yml` installs dependencies, lints, tests, and builds on Node.js 24 LTS.

Vercel can host this as a Next.js project. Add `GEMINI_API_KEY` and `GEMINI_MODEL` in the project environment settings for Production and Preview. Set `GEMINI_MODEL` to `gemini-3.5-flash-lite`.

Keep your actual API key out of git. `.env.local` is ignored, and `.env.example` should only contain placeholder values or variable names.

See `spec.md` for the product requirements and `architecture.md` for how the page, route, and Gemini call fit together.
