# Postra specification

Postra is a web caption helper for Filipino micro, small, and medium enterprises that do not have a marketing team. An owner describes a product, service, or event and receives one social caption, exactly five hashtags, and one creative suggestion.

This MVP does not create accounts, store posts, take payment, or publish to social networks.

## Users

Filipino MSME owners across industries. They may sell products, offer services, or promote events. The interface assumes they are comfortable with a phone and a Facebook, Instagram, or TikTok account, and that they are new to writing marketing copy.

## Screens

One responsive page:

1. A short introduction: Postra, Your AI Marketing Sidekick.
2. A form for the post brief.
3. A result card with the caption, five hashtags, a creative suggestion, and a copy button.

On a narrow screen the form sits above the result. On a wide screen they sit side by side.

## Inputs

| Field | Control | Required | Limit |
| --- | --- | --- | --- |
| Business or offering name | Text | Yes | 80 characters |
| Offering type | Product, Service, or Event | Yes | One choice |
| Description | Text area | Yes | 600 characters |
| Target audience | Text | Yes | 200 characters |
| Platform | Facebook, Instagram, or TikTok | Yes | One choice |
| Content goal | Introduce the offering, promote an offer, encourage engagement, or announce an event | Yes | One choice |
| Brand tone | Friendly, professional, or playful | Yes | One choice |
| Language | English, Filipino, or Taglish | Yes | One choice |

## Output

A successful generation returns:

- One caption in the selected language and tone, shaped for the selected platform.
- Exactly five hashtags.
- One creative suggestion, such as a photo, opening line, or time to post. The suggestion is advice. It is not part of the copied post.

Copy content copies the caption and the five hashtags. Regenerate asks for a new version of the same brief.

## Behavior

- The form checks every field before it calls the server. Missing choices and over-long text show a plain-language message beside the field.
- The server checks the same rules again.
- While a request is in flight, the pressed button reads “Writing your caption…” and the result area is marked busy.
- If the model is unavailable, the key is missing, or the reply cannot be parsed after one retry, the page says Postra could not write a caption and the owner can try again.
- The API key stays in a server environment variable. The browser never receives it.

## Out of scope

Accounts, saved history, databases, payments, image generation, analytics, and automatic posting.
