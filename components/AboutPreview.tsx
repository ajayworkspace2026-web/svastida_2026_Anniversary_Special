import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

export default function AboutPreview() {
  return (
    <section className="bg-black px-5 py-24 text-white md:px-10">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-end">
        <SectionHeading
          eyebrow="Our journey"
          title="A fashion label built around the person wearing it."
          description="The story, craftsmanship, and design philosophy will live here and in the full About page."
        />
        <div className="border-l border-white/10 pl-8 md:pl-12">
          <p className="text-2xl leading-relaxed text-white/85 display-font md:text-4xl">
            We are building fashion where the customer is part of the design, not just
            the checkout.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex rounded-full border border-[var(--gold-bright)] px-6 py-3 text-sm text-[var(--gold-bright)] transition hover:bg-[var(--gold-bright)] hover:text-black"
          >
            Read our story
          </Link>
        </div>
      </div>
    </section>
  );
}
