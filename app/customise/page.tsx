import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import AIFashionDesigner from "@/components/AIFashionDesigner";

export default function CustomisePage() {
  return (
    <>
      <StorefrontNav />
      <main>
        <section className="bg-black px-5 py-24 text-white md:px-10 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold-bright)]">
              AI fashion designer
            </p>
            <h1 className="mt-5 max-w-5xl text-7xl leading-[0.8] md:text-9xl">
              Design from the fabric you already have.
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
              Upload a clear fabric photograph, choose a dress direction and explore multiple
              visual concepts before you decide what to make.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
          <AIFashionDesigner />
        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}
