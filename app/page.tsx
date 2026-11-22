import { CaptionStudio } from "@/components/caption-studio";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mango">
            For Filipino MSMEs
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Postra
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted">
            Your AI Marketing Sidekick. Describe your product, service, or
            event, and get one caption, five hashtags, and a creative idea for
            Facebook, Instagram, or TikTok.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <CaptionStudio />
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-sm text-muted sm:px-6">
        Postra writes the words. You copy them and post them yourself.
      </footer>
    </div>
  );
}
