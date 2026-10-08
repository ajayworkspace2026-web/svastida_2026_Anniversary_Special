import Link from "next/link";

export default function Pagination({
  basePath,
  page,
  hasNext,
}: {
  basePath: string;
  page: number;
  hasNext: boolean;
}) {
  const previous = page > 1 ? page - 1 : null;
  const next = hasNext ? page + 1 : null;

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-between border-t border-black/10 pt-5">
      {previous ? (
        <Link
          href={`${basePath}?page=${previous}`}
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm hover:border-black"
        >
          Previous
        </Link>
      ) : <span />}
      <span className="text-xs uppercase tracking-[0.2em] text-black/35">Page {page}</span>
      {next ? (
        <Link
          href={`${basePath}?page=${next}`}
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm hover:border-black"
        >
          Next
        </Link>
      ) : <span />}
    </nav>
  );
}
