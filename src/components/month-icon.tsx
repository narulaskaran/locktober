import { MONTH_THEMES } from "@/lib/themes";

/**
 * One icon per month, all 64x64 and painted with the theme variables
 * (--ink, --ember, --ember-deep, --moss, --paper-2), so they recolor with the
 * palette. MonthIconSprite is rendered once in the layout; every MonthIcon
 * references all twelve symbols and CSS (globals.css) shows the current
 * month's. That keeps the right icon in the server HTML even though the month
 * is only known in the browser.
 */
export function MonthIconSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <g id="mi-jan">
          <path d="M16 10h32c1 12-4 22-16 24C20 32 15 22 16 10Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }} />
          <path d="M18 18h28c-.4 3-1.2 6-3 8.6-3 2.2-6.4 3-11 3-3.6 0-7-.8-9.2-3C18.8 24 18.2 21 18 18Z" opacity=".18" style={{ fill: "var(--moss)" }} />
          <path d="M32 34v16" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" fill="none" style={{ stroke: "var(--ink)" }} />
          <path d="M22 54c0-3 5-4 10-4s10 1 10 4Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember-deep)", stroke: "var(--ink)" }} />
          <circle cx="27" cy="22" r="1.8" style={{ fill: "var(--paper-2)" }} />
          <circle cx="34" cy="26" r="1.4" style={{ fill: "var(--paper-2)" }} />
          <circle cx="38" cy="18" r="1.6" style={{ fill: "var(--paper-2)" }} />
          <path d="M52 8l1.8 5.2L59 15l-5.2 1.8L52 22l-1.8-5.2L45 15l5.2-1.8Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--moss)", stroke: "var(--ink)" }} />
          <path d="M10 22l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }} />
        </g>
        <g id="mi-feb">
          <path d="M32 56C10 41 5 27 13 18c7-8 16-4 19 4 3-8 12-12 19-4 8 9 3 23-19 38Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }} />
          <path d="M17 24c1-4 5-6 9-4" fill="none" strokeWidth="3" strokeLinecap="round" opacity=".7" style={{ stroke: "var(--paper-2)" }} />
          <path d="M36 50c8-7 14-14 14-22" fill="none" strokeWidth="2.4" strokeLinecap="round" opacity=".45" style={{ stroke: "var(--ember-deep)" }} />
        </g>
        <g id="mi-mar">
          <g strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }}>
            <path d="M32 30C20 24 17 11 25 8c6-2 7 5 7 9 0-4 1-11 7-9 8 3 5 16-7 22Z" />
            <path d="M32 34c-6 12-19 15-22 7-2-6 5-7 9-7-4 0-11-1-9-7 3-8 16-5 22 7Z" transform="translate(0 -2) rotate(0)" />
            <path d="M32 34c6 12 19 15 22 7 2-6-5-7-9-7 4 0 11-1 9-7-3-8-16-5-22 7Z" transform="translate(0 -2)" />
            <path d="M32 34C20 40 17 53 25 56c6 2 7-5 7-9 0 4 1 11 7 9 8-3 5-16-7-22Z" transform="translate(0 0)" />
          </g>
          <g strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".55" style={{ stroke: "var(--ember-deep)" }}>
            <path d="M32 30c-4-4-6-9-5-15" />
            <path d="M32 30c4-4 6-9 5-15" />
            <path d="M32 34c-6 0-12 2-17 6" />
            <path d="M32 34c6 0 12 2 17 6" />
          </g>
          <path d="M32 38c1 8 3 14 8 20" fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: "var(--moss)" }} />
        </g>
        <g id="mi-apr">
          <path d="M6 32C6 17 18 8 32 8s26 9 26 24c-4-5-8-5-10.6-1-2.6-4-7.4-4-10.4 0-3-4-8-4-10.6 0-2.6-4-7-4-10.4 1-2.6-4-7-4-10.6 0Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }} />
          <path d="M32 8c-5 6-8 14-8 23M32 8c5 6 8 14 8 23" fill="none" strokeWidth="2" opacity=".55" style={{ stroke: "var(--paper-2)" }} />
          <path d="M32 8V4" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" fill="none" style={{ stroke: "var(--ink)" }} />
          <path d="M32 31v18c0 5-3 8-8 8-4 0-6-3-6-6" fill="none" strokeWidth="2.4" strokeLinecap="round" style={{ stroke: "var(--ink)" }} />
          <g style={{ fill: "var(--moss)" }}>
            <path d="M48 40c2 3 3 5 3 7a3 3 0 0 1-6 0c0-2 1-4 3-7Z" />
            <path d="M56 48c1.5 2 2 4 2 5.5a2.5 2.5 0 0 1-5 0c0-1.5.5-3.5 3-5.5Z" opacity=".8" />
            <path d="M42 54c1.5 2 2 3.5 2 5a2.5 2.5 0 0 1-5 0c0-1.5.5-3 3-5Z" opacity=".8" />
          </g>
        </g>
        <g id="mi-may">
          <path d="M32 38v20" fill="none" strokeWidth="3.2" strokeLinecap="round" style={{ stroke: "var(--moss)" }} />
          <path d="M32 56c-8-1-14-6-16-16 8 1 14 6 16 16Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--moss)", stroke: "var(--ink)" }} />
          <path d="M32 52c6-1 11-5 14-12-7 0-12 4-14 12Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" opacity=".9" style={{ fill: "var(--moss)", stroke: "var(--ink)" }} />
          <path d="M16 14c-1 14 3 24 16 26 13-2 17-12 16-26l-8 8-8-10-8 10Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }} />
          <path d="M32 12c-5 6-7 14-4 26" fill="none" strokeWidth="2" strokeLinecap="round" opacity=".6" style={{ stroke: "var(--ember-deep)" }} />
          <path d="M32 12c5 6 7 14 4 26" fill="none" strokeWidth="2" strokeLinecap="round" opacity=".35" style={{ stroke: "var(--ember-deep)" }} />
        </g>
        <g id="mi-jun">
          <g strokeWidth="4" strokeLinecap="round" style={{ stroke: "var(--ember)" }}>
            <path d="M32 4v8" />
            <path d="M32 52v8" />
            <path d="M4 32h8" />
            <path d="M52 32h8" />
            <path d="M12.2 12.2l5.6 5.6" />
            <path d="M46.2 46.2l5.6 5.6" />
            <path d="M12.2 51.8l5.6-5.6" />
            <path d="M46.2 17.8l5.6-5.6" />
          </g>
          <circle cx="32" cy="32" r="14" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }} />
          <path d="M22 28c2-5 7-8 12-7" fill="none" strokeWidth="3" strokeLinecap="round" opacity=".6" style={{ stroke: "var(--paper-2)" }} />
          <path d="M24 38c3 4 9 5 13 2" fill="none" strokeWidth="2.4" strokeLinecap="round" opacity=".5" style={{ stroke: "var(--ember-deep)" }} />
        </g>
        <g id="mi-jul">
          <g strokeLinecap="round" strokeWidth="3.2" fill="none">
            <path d="M32 6v14" style={{ stroke: "var(--ember)" }} />
            <path d="M32 44v14" style={{ stroke: "var(--ember)" }} />
            <path d="M6 32h14" style={{ stroke: "var(--ember)" }} />
            <path d="M44 32h14" style={{ stroke: "var(--ember)" }} />
            <path d="M13.6 13.6l10 10" style={{ stroke: "var(--moss)" }} />
            <path d="M40.4 40.4l10 10" style={{ stroke: "var(--moss)" }} />
            <path d="M13.6 50.4l10-10" style={{ stroke: "var(--moss)" }} />
            <path d="M40.4 23.6l10-10" style={{ stroke: "var(--moss)" }} />
          </g>
          <g style={{ fill: "var(--ember)" }}><circle cx="32" cy="4" r="2.6" />
          <circle cx="32" cy="60" r="2.6" />
          <circle cx="4" cy="32" r="2.6" />
          <circle cx="60" cy="32" r="2.6" />
          </g>
          <g style={{ fill: "var(--moss)" }}><circle cx="11" cy="11" r="2.6" />
          <circle cx="53" cy="53" r="2.6" />
          <circle cx="11" cy="53" r="2.6" />
          <circle cx="53" cy="11" r="2.6" />
          </g>
          <path d="M32 24l2.6 5.4 5.9.8-4.3 4.1 1 5.8L32 37.3l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--paper-2)", stroke: "var(--ink)" }} />
        </g>
        <g id="mi-aug">
          <circle cx="48" cy="14" r="8" opacity=".9" style={{ fill: "var(--moss)" }} />
          <path d="M30 58c1-14 1-26-2-38" fill="none" strokeWidth="5" strokeLinecap="round" style={{ stroke: "var(--ink)" }} />
          <path d="M30 58c1-14 1-26-2-38" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 5" opacity=".7" style={{ stroke: "var(--paper-2)" }} />
          <g strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }}>
            <path d="M28 20C20 10 9 12 5 20c9-4 15-1 23 0Z" />
            <path d="M28 20C28 8 38 2 48 6c-8 1-14 6-20 14Z" />
            <path d="M28 20c8-2 17 1 22 12-8-6-14-8-22-12Z" />
            <path d="M28 20C20 18 12 22 10 32c6-7 10-10 18-12Z" />
          </g>
          <circle cx="27" cy="23" r="3" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember-deep)", stroke: "var(--ink)" }} />
          <circle cx="32" cy="24" r="2.8" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember-deep)", stroke: "var(--ink)" }} />
          <path d="M8 58c6-4 10-4 16 0s10 4 16 0 10-4 16 0" fill="none" strokeWidth="3" strokeLinecap="round" opacity=".7" style={{ stroke: "var(--ember)" }} />
        </g>
        <g id="mi-sep">
          <path d="M32 6l5 11 6-3-2 13 13-5-4 11 7 4-17 7 2 6-9-2v12h-2V48l-9 2 2-6-17-7 7-4-4-11 13 5-2-13 6 3Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }} />
          <path d="M32 18v36M32 36l-11-9M32 36l11-9M32 42l-12 2M32 42l12 2" fill="none" strokeWidth="1.6" strokeLinecap="round" opacity=".7" style={{ stroke: "var(--ember-deep)" }} />
          <circle cx="12" cy="54" r="3" opacity=".85" style={{ fill: "var(--moss)" }} />
          <circle cx="53" cy="55" r="2.4" opacity=".85" style={{ fill: "var(--moss)" }} />
        </g>
        <g id="mi-oct">
          <path d="M12 56V28C12 14 21 6 32 6s20 8 20 22v28l-6.7-5.6L39.3 56l-7.3-5.6L24.7 56l-6-5.6Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--paper-2)", stroke: "var(--ink)" }} />
          <ellipse cx="25" cy="29" rx="3.2" ry="4.6" style={{ fill: "var(--ink)" }} />
          <ellipse cx="39" cy="29" rx="3.2" ry="4.6" style={{ fill: "var(--ink)" }} />
          <ellipse cx="32" cy="39" rx="3.4" ry="4.2" style={{ fill: "var(--ink)" }} />
          <circle cx="19" cy="37" r="3" opacity=".55" style={{ fill: "var(--ember)" }} />
          <circle cx="45" cy="37" r="3" opacity=".55" style={{ fill: "var(--ember)" }} />
          <path d="M14 38C8 36 5 30 6 24c4 3 7 5 8 8" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--moss)", stroke: "var(--ink)" }} />
          <path d="M50 38c6-2 9-8 8-14-4 3-7 5-8 8" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--moss)", stroke: "var(--ink)" }} />
        </g>
        <g id="mi-nov">
          <g transform="translate(1 0) scale(.95) translate(-2 -4)">
            <path d="M36.5 9.2c2.4-.3 7 .4 9.6 3 1.4 1.4 1.8 3 .8 4-3 .1-6.6-.8-9-2.6-1.1-.8-1.6-1.8-1.6-2.8.1-.7.1-1.2.2-1.6Z" style={{ fill: "var(--moss)" }} />
            <path d="M29.4 23.2c.3-1.8 1-5.8 2.8-9.2 1.5-2.8 3.6-4.8 5.4-5.4-.7 2.4-1.8 5-3.4 6.8-1.7 2-3.6 3.6-4.4 5.6-.3.8-.6 1.6-.4 2.2Z" style={{ fill: "var(--moss)" }} />
            <g strokeWidth="1.6" style={{ fill: "var(--ember)", stroke: "var(--ink)" }}>
              <ellipse cx="17.5" cy="47" rx="11.5" ry="17.5" />
              <ellipse cx="46.5" cy="47" rx="11.5" ry="17.5" />
              <ellipse cx="32" cy="45" rx="14.2" ry="20.5" />
            </g>
            <g fill="none" strokeLinecap="round" style={{ stroke: "var(--ember-deep)" }}>
              <path d="M25.2 29c-.7 7-.1 20 2.4 31" strokeWidth="1.35" />
              <path d="M32 26.8c-.35 8-.15 24 .05 35.5" strokeWidth="1.2" />
              <path d="M38.8 29c.7 7 .1 20-2.4 31" strokeWidth="1.35" />
            </g>
          </g>
        </g>
        <g id="mi-dec">
          <path d="M12 54C14 24 28 8 50 12c-6 2-8 8-6 14 3 8 8 14 10 28Z" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--ember)", stroke: "var(--ink)" }} />
          <path d="M24 28c4-6 9-9 15-10" fill="none" strokeWidth="2.6" strokeLinecap="round" opacity=".35" style={{ stroke: "var(--paper-2)" }} />
          <path d="M44 28c3 8 7 14 10 26" fill="none" strokeWidth="2.4" strokeLinecap="round" opacity=".45" style={{ stroke: "var(--ember-deep)" }} />
          <rect x="6" y="48" width="52" height="12" rx="6" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--paper-2)", stroke: "var(--ink)" }} />
          <circle cx="52" cy="12" r="6.5" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ fill: "var(--paper-2)", stroke: "var(--ink)" }} />
        </g>
      </defs>
    </svg>
  );
}

export function MonthIcon({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className ? `month-icon shrink-0 ${className}` : "month-icon shrink-0"}
    >
      {MONTH_THEMES.map((theme) => (
        <use key={theme} href={`#mi-${theme}`} className={`mi-${theme}`} />
      ))}
    </svg>
  );
}

export function MonthIconPatch({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [left, center, right] = compact ? [28, 44, 22] : [40, 68, 30];

  return (
    <div aria-hidden="true" className={className ? `flex items-end ${className}` : "flex items-end"}>
      <MonthIcon size={left} className="origin-bottom -rotate-6" />
      <MonthIcon size={center} className="-mx-1.5" />
      <MonthIcon size={right} className="origin-bottom rotate-6" />
    </div>
  );
}
