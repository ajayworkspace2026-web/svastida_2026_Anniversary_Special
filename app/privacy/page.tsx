import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";

export default function PrivacyPage() {
  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Store policy</p>
        <h1 className="mt-4 text-6xl leading-[0.85]">Privacy.</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-black/60">
          <p>Customer contact and delivery details are used to handle enquiries, sizing, customisation, order coordination and customer support.</p>
          <p>Svastida Fashion will not ask for OTPs, passwords, UPI PINs, CVVs, card PINs, banking credentials or remote access to a customer device.</p>
          <p>Uploaded fabric images and enquiry information are used only for the service and support requested by the customer and should not be publicly shared.</p>
          <p>For privacy questions, contact <a className="font-medium text-black underline" href="mailto:svastidaa.helpdesk@gmail.com">svastidaa.helpdesk@gmail.com</a>.</p>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
