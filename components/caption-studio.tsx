"use client";

import { useState } from "react";
import {
  GOALS,
  LANGUAGES,
  LIMITS,
  OFFERING_TYPES,
  PLATFORMS,
  TONES,
  validateBrief,
  type BriefErrors,
  type BriefField,
} from "@/lib/brief";
import type { Generation } from "@/lib/parse-generation";

type FormState = Record<BriefField, string>;

const emptyForm: FormState = {
  name: "",
  offeringType: "",
  description: "",
  audience: "",
  platform: "",
  goal: "",
  tone: "",
  language: "",
};

const fieldOrder: BriefField[] = [
  "name",
  "offeringType",
  "description",
  "audience",
  "platform",
  "goal",
  "tone",
  "language",
];

type Choice = { value: string; label: string; hint?: string };

function ChoiceGroup({
  legend,
  name,
  options,
  value,
  error,
  onChange,
}: {
  legend: string;
  name: BriefField;
  options: readonly Choice[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-foreground">{legend}</legend>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                selected
                  ? "border-accent bg-[#e7f5f0]"
                  : "border-line bg-card hover:border-accent/40"
              }`}
            >
              <input
                className="mt-1 accent-accent"
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              <span>
                <span className="block text-sm font-medium">{option.label}</span>
                {option.hint ? (
                  <span className="mt-0.5 block text-sm text-muted">
                    {option.hint}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function CaptionStudio() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<BriefErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Generation | null>(null);
  const [copied, setCopied] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "generate" | "regenerate" | null
  >(null);

  function update(field: BriefField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function submit(fresh: boolean) {
    const validation = validateBrief(form);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("error");
      setMessage("Check the highlighted fields, then try again.");
      const first = fieldOrder.find((field) => validation.errors[field]);
      if (first) {
        document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      }
      return;
    }

    setErrors({});
    setStatus("loading");
    setMessage("");
    setCopied(false);
    setPendingAction(fresh ? "regenerate" : "generate");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.value, fresh }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        fields?: BriefErrors;
        caption?: string;
        hashtags?: Generation["hashtags"];
        suggestion?: string;
      } | null;

      if (!response.ok || !payload?.caption || !payload.hashtags || !payload.suggestion) {
        if (payload?.fields) setErrors(payload.fields);
        setStatus("error");
        setMessage(
          payload?.error ??
            "Postra could not write a caption just now. Please try again.",
        );
        return;
      }

      setResult({
        caption: payload.caption,
        hashtags: payload.hashtags,
        suggestion: payload.suggestion,
      });
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage(
        "Postra could not write a caption just now. Please try again.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function copyContent() {
    if (!result) return;
    const text = `${result.caption}\n\n${result.hashtags
      .map((tag) => `#${tag}`)
      .join(" ")}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
      setStatus("error");
      setMessage("Copy did not work in this browser. Select the caption and copy it yourself.");
    }
  }

  const loading = status === "loading";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <form
        className="rounded-3xl border border-line bg-card p-5 shadow-[0_12px_40px_rgba(70,42,12,0.06)] sm:p-6"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit(false);
        }}
      >
        <h2 className="text-xl font-semibold tracking-tight">
          Tell Postra about this post
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Fill in the blanks the way you would explain the post to a friend.
        </p>

        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold">Business or offering name</span>
            <input
              name="name"
              value={form.name}
              maxLength={LIMITS.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Lola's Bibingka"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="mt-2 w-full rounded-2xl border border-line bg-white px-3 py-3 text-base outline-none ring-accent/30 focus:ring-4"
            />
            {errors.name ? (
              <span id="name-error" className="mt-2 block text-sm text-danger">
                {errors.name}
              </span>
            ) : null}
          </label>

          <ChoiceGroup
            legend="What are you posting about?"
            name="offeringType"
            options={OFFERING_TYPES}
            value={form.offeringType}
            error={errors.offeringType}
            onChange={(value) => update("offeringType", value)}
          />

          <label className="block">
            <span className="text-sm font-semibold">Description</span>
            <textarea
              name="description"
              value={form.description}
              maxLength={LIMITS.description}
              rows={4}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Warm bibingka baked every afternoon. This week, buy 2 and get a free puto."
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              className="mt-2 w-full rounded-2xl border border-line bg-white px-3 py-3 text-base outline-none ring-accent/30 focus:ring-4"
            />
            {errors.description ? (
              <span
                id="description-error"
                className="mt-2 block text-sm text-danger"
              >
                {errors.description}
              </span>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Who is this for?</span>
            <input
              name="audience"
              value={form.audience}
              maxLength={LIMITS.audience}
              onChange={(event) => update("audience", event.target.value)}
              placeholder="Families and office workers in Quezon City"
              aria-invalid={Boolean(errors.audience)}
              aria-describedby={errors.audience ? "audience-error" : undefined}
              className="mt-2 w-full rounded-2xl border border-line bg-white px-3 py-3 text-base outline-none ring-accent/30 focus:ring-4"
            />
            {errors.audience ? (
              <span
                id="audience-error"
                className="mt-2 block text-sm text-danger"
              >
                {errors.audience}
              </span>
            ) : null}
          </label>

          <ChoiceGroup
            legend="Where will you post it?"
            name="platform"
            options={PLATFORMS}
            value={form.platform}
            error={errors.platform}
            onChange={(value) => update("platform", value)}
          />
          <ChoiceGroup
            legend="What should this post do?"
            name="goal"
            options={GOALS}
            value={form.goal}
            error={errors.goal}
            onChange={(value) => update("goal", value)}
          />
          <ChoiceGroup
            legend="How should it sound?"
            name="tone"
            options={TONES}
            value={form.tone}
            error={errors.tone}
            onChange={(value) => update("tone", value)}
          />
          <ChoiceGroup
            legend="Which language?"
            name="language"
            options={LANGUAGES}
            value={form.language}
            error={errors.language}
            onChange={(value) => update("language", value)}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-5 text-base font-semibold text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:opacity-60"
          >
            {pendingAction === "generate" ? "Writing your caption…" : "Generate caption"}
          </button>
          <button
            type="button"
            disabled={loading || !result}
            onClick={() => void submit(true)}
            className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-white px-5 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
          >
            {pendingAction === "regenerate" ? "Writing your caption…" : "Regenerate"}
          </button>
        </div>
      </form>

      <section
        aria-busy={loading}
        className="rounded-3xl border border-line bg-[#fff7ec] p-5 sm:p-6"
      >
        <h2 className="text-xl font-semibold tracking-tight">Your post</h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Copy the caption and hashtags, then paste them into the app yourself.
        </p>

        {loading ? (
          <p className="mt-4 text-sm font-semibold text-accent">
            Writing your caption…
          </p>
        ) : null}

        {message ? (
          <p role="alert" className="mt-4 rounded-2xl bg-danger-bg px-3 py-3 text-sm text-danger">
            {message}
          </p>
        ) : null}

        {result ? (
          <div className="mt-5 space-y-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-mango">
                Caption
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-base leading-7">
                {result.caption}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-mango">
                Hashtags
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {result.hashtags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-sm font-medium text-foreground"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-mango">
                Creative suggestion
              </h3>
              <p className="mt-2 text-base leading-7">{result.suggestion}</p>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-base leading-7 text-muted">
            Your caption, five hashtags, and one idea will show up here.
          </p>
        )}
        <button
          type="button"
          onClick={() => void copyContent()}
          disabled={loading || !result}
          className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-base font-semibold text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
        >
          {copied ? "Copied" : "Copy content"}
        </button>
        <p role="status" className="sr-only">
          {copied ? "Caption and hashtags copied." : ""}
        </p>
      </section>
    </div>
  );
}
