import Link from "next/link";

type CollectionCardProps = {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  index: number;
};

export default function CollectionCard({
  name,
  slug,
  description,
  imageUrl,
  index,
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${slug}`}
      className="group relative min-h-80 overflow-hidden bg-black"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          loading={index < 2 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
        />
      ) : null}
      <div className="absolute inset-0 bg-black/40 transition group-hover:bg-black/25" />
      <div className="relative flex h-full min-h-80 flex-col justify-end p-7 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-bright)]">
          Collection
        </p>
        <h3 className="mt-2 text-4xl">{name}</h3>
        {description ? <p className="mt-2 max-w-sm text-sm text-white/65">{description}</p> : null}
      </div>
    </Link>
  );
}
