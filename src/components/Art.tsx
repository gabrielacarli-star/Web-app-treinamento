import Image from "next/image";

/**
 * A funnel illustration. Same fixed square footprint the placeholder had, so
 * swapping art in and out never shifts the layout below it.
 */
export function Art({
  id,
  alt = "",
  priority = false,
}: {
  id: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl2">
      <Image
        src={`/art/${id}.png`}
        alt={alt}
        fill
        sizes="(max-width: 432px) 100vw, 432px"
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}
