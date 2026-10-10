import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import { getAboutImages, getSiteSettings, storagePublicUrl } from "@/lib/storefront";

const milestones = [
  ["01", "The beginning", "A simple idea: make the person wearing the garment part of the design process."],
  ["02", "The first year", "One year of learning, creating, listening to customers, and shaping a more personal way to discover fashion."],
  ["03", "The journey ahead", "Bring style discovery, custom fit, fabric-led design and thoughtful customer support together in one experience."],
];

export default async function AboutPage() {
  const [settings, images] = await Promise.all([getSiteSettings(), getAboutImages()]);

  return (
    <>
      <StorefrontNav />
      <main>
        <section className="bg-black px-5 py-24 text-white md:px-10 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold-bright)]">Our first anniversary</p>
            <h1 className="mt-5 max-w-5xl text-7xl leading-[0.8] md:text-9xl">
              {settings?.about_title || "One year of dressing the story you want to tell."}
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
              Svastida Fashion&apos;s story journey turns one. This first anniversary is a moment to celebrate
              the people, ideas and conversations that helped shape the brand.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Why Svastida</p>
              <h2 className="mt-4 text-6xl leading-[0.9]">Personal style deserves personal attention.</h2>
            </div>
            <div className="text-base leading-8 text-black/60 md:text-lg">
              <p>{settings?.about_content || "Our first year has been about creating a more personal bridge between the customer, the fabric and the final garment. Today, we are building a showcase experience where customers can explore styles, ask for guidance, and speak directly with the team before confirming an enquiry."}</p>
            </div>
          </div>

          {images.length ? (
            <section className="mt-24">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">From the story</p>
                  <h2 className="mt-3 text-5xl leading-none md:text-7xl">Moments.</h2>
                </div>
                <p className="hidden max-w-sm text-sm leading-6 text-black/45 md:block">
                  The Svastida team can update this gallery from the admin panel. Published images appear here automatically.
                </p>
              </div>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                  <figure key={image.id} className={index % 5 === 1 ? "sm:translate-y-10" : ""}>
                    <div
                      className="aspect-[4/5] rounded-2xl bg-cover bg-center"
                      style={{ backgroundImage: `url("${storagePublicUrl(image.storage_path, "about-images") ?? ""}")` }}
                      role="img"
                      aria-label={image.alt_text ?? image.title ?? "Svastida story image"}
                    />
                    {image.title ? <figcaption className="mt-3 text-sm text-black/55">{image.title}</figcaption> : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-20 grid gap-5 md:grid-cols-3">
            {milestones.map(([number, title, body]) => (
              <article key={number} className="border-t border-black/15 pt-6">
                <span className="text-sm text-[var(--gold)]">{number}</span>
                <h3 className="mt-8 text-4xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/50">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}
