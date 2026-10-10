import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";

export default function ShippingPage() {
  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Store policy</p>
        <h1 className="mt-4 text-6xl leading-[0.85]">Shipping.</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-black/60">
          <p><strong className="text-black">Online / internet shipping is available.</strong> Shipping availability, delivery timelines and final charges are confirmed with the customer before the enquiry is converted into a confirmed order.</p>
          <p>Svastida currently works enquiries through phone calls and stays in touch with the customer throughout the order process, including customisation and delivery coordination.</p>
          <p>For shipping assistance, contact <a className="font-medium text-black underline" href="mailto:svastidaa.helpdesk@gmail.com">svastidaa.helpdesk@gmail.com</a>.</p>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
