import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import { getSiteSettings } from "@/lib/storefront";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const number = String(settings?.whatsapp_admin_number ?? "").replace(/\D/g, "");
  const message = encodeURIComponent("Hello, I would like to enquire about your fashion collection.");

  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Contact</p>
        <h1 className="mt-4 max-w-4xl text-7xl leading-[0.85]">A real person is one message away.</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-black/55">
          Ask about sizing, fabric suitability, custom fit, or an existing order.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="border border-black/10 bg-[#f7f5f0] p-7">
            <p className="text-xs uppercase tracking-[0.25em] text-black/40">WhatsApp</p>
            <p className="mt-2 display-font text-3xl">{settings?.business_phone || "Configured from admin settings"}</p>
            {number ? (
              <a
                href={`https://wa.me/${number}?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
              >
                Chat on WhatsApp
              </a>
            ) : null}
          </div>

          <div className="border border-black/10 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.25em] text-black/40">Email</p>
            <p className="mt-2 display-font text-3xl">{settings?.business_email || "Configured from admin settings"}</p>
            {settings?.business_email ? (
              <a href={`mailto:${settings.business_email}`} className="mt-6 inline-block rounded-full border border-black/15 px-6 py-3 text-sm font-semibold">
                Send email
              </a>
            ) : null}
          </div>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
