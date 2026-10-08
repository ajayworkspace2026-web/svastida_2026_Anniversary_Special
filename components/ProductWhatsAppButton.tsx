"use client";

type ProductWhatsAppButtonProps = {
  phoneNumber: string | null | undefined;
  productName: string;
  size: string;
};

export default function ProductWhatsAppButton({
  phoneNumber,
  productName,
  size,
}: ProductWhatsAppButtonProps) {
  const number = String(phoneNumber ?? "").replace(/\D/g, "");

  if (!number) {
    return null;
  }

  const message = encodeURIComponent(
    [
      "Hello Svastida, I would like to enquire about this product.",
      "",
      `Product: ${productName}`,
      `Size: ${size || "Not selected"}`,
    ].join("\n"),
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="block w-full rounded-full border border-[#1d9d51]/30 bg-[#eefaf3] px-6 py-4 text-center text-sm font-semibold text-[#15753d] transition hover:bg-[#e3f6eb]"
    >
      Enquire on WhatsApp
    </a>
  );
}
