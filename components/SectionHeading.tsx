type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--gold)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-5xl leading-[0.95] text-black md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-sm leading-7 text-[var(--muted)] md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
