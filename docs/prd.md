# Postra Product Requirements Document

## 1. Product and user

**Postra** is an AI-powered social media writing assistant for Philippine-based small-business owners who manage their own marketing without a dedicated marketing team.

## 2. User problem

Owners can be busy, unsure whether a caption will engage customers, or uncomfortable writing detailed prompts for general AI tools. Some want to promote products without sounding too sales-focused and would benefit from creative direction.

## 3. Product goal and success measures

Help an owner create a relevant first draft for a social media post with less prompt-writing effort. In the next validation round, target at least 4 of 5 small-business owners completing their first generation without help and at least 4 of 5 rating the result relevant enough to adapt. These are proposed targets, not measured results. Current evidence: 3 of 3 testers used the app without help and described the captions as pretty accurate.

## 4. Core requirements

- Collect business name, offering type, description, target audience, platform, content goal, tone, and language in a guided form.
- Send the brief to a server-side AI route; keep the API key out of the browser.
- Return one caption, exactly five hashtags, and one creative suggestion.
- Allow the owner to copy the caption and hashtags or regenerate the result.
- Validate required fields and lengths; show understandable errors and a loading state.

## 5. Scope and non-goals

The MVP is a responsive, single-page web app for Facebook, Instagram, and TikTok. It does not create accounts, store a post history, take payments, generate images, or publish automatically. Postra currently uses Gemini through a Next.js server route and is deployed on Vercel.

## 6. Assumptions, risks, and next improvements

The initial assumption is that a guided form is easier than open-ended prompting for owners without marketing support. Three early testers supported ease of use and caption relevance; this is not proof of broad demand or willingness to pay. Existing caption tools are alternatives. A tester requested more control over target audience and narrative angle; consider this for v2 after testing with more users.
