import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";

export default function ReturnsPage() {
  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Store policy</p>
        <h1 className="mt-4 text-6xl leading-[0.85]">Returns & refunds.</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-black/60">
          <p><strong className="text-black">Customised orders are not eligible for returns or refunds once the customer has reviewed and consented to the measurements and customisation details.</strong></p>
          <p>Measurements are discussed and confirmed with the customer before work begins. If a measurement error attributable to Svastida causes a fit issue, the garment will be restitched or altered as reasonably required.</p>
          <p>For standard or non-custom enquiries, any return or exchange request is reviewed individually before confirmation.</p>
          <p>As of now, Svastida works orders through phone calls and keeps in touch with customers through the process. For assistance, contact <a className="font-medium text-black underline" href="mailto:svastidaa.helpdesk@gmail.com">svastidaa.helpdesk@gmail.com</a>.</p>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
