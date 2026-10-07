export function Pumpkin({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const height = size;
  const width = Math.round((size * 60) / 66);

  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox="2 4 60 66"
      fill="none"
      className={className ? `shrink-0 ${className}` : "shrink-0"}
    >
      <path
        className="fill-moss"
        d="M36.5 9.2c2.4-.3 7 .4 9.6 3 1.4 1.4 1.8 3 .8 4-3 .1-6.6-.8-9-2.6-1.1-.8-1.6-1.8-1.6-2.8.1-.7.1-1.2.2-1.6Z"
      />
      <path
        className="fill-moss"
        d="M29.4 23.2c.3-1.8 1-5.8 2.8-9.2 1.5-2.8 3.6-4.8 5.4-5.4-.7 2.4-1.8 5-3.4 6.8-1.7 2-3.6 3.6-4.4 5.6-.3.8-.6 1.6-.4 2.2Z"
      />
      <ellipse className="fill-ember stroke-ink" cx="17.5" cy="47" rx="11.5" ry="17.5" strokeWidth="1.6" />
      <ellipse className="fill-ember stroke-ink" cx="46.5" cy="47" rx="11.5" ry="17.5" strokeWidth="1.6" />
      <ellipse className="fill-ember stroke-ink" cx="32" cy="45" rx="14.2" ry="20.5" strokeWidth="1.6" />
      <path
        className="fill-none stroke-ember-deep"
        d="M25.2 29c-.7 7-.1 20 2.4 31"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        className="fill-none stroke-ember-deep"
        d="M32 26.8c-.35 8-.15 24 .05 35.5"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        className="fill-none stroke-ember-deep"
        d="M38.8 29c.7 7 .1 20-2.4 31"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PumpkinPatch({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [left, center, right] = compact ? [28, 44, 22] : [40, 68, 30];

  return (
    <div aria-hidden="true" className={className ? `flex items-end ${className}` : "flex items-end"}>
      <Pumpkin size={left} className="origin-bottom -rotate-6" />
      <Pumpkin size={center} className="-mx-1.5" />
      <Pumpkin size={right} className="origin-bottom rotate-6" />
    </div>
  );
}
