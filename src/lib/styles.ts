export const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-ink px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const btnInk = `${btn} bg-ink text-paper hover:bg-[#2a241e]`;
export const btnEmber = `${btn} border-ember bg-ember text-paper hover:bg-ember-deep`;
export const btnGhost = `${btn} bg-paper-2 text-ink hover:bg-white`;

export const field =
  "min-h-11 w-full border border-ink bg-paper-2 px-3 text-base outline-none focus:bg-white";

// The big number box used when logging a score. Not built on `field` because
// two competing font-size utilities resolve by stylesheet order, not class order.
export const numberField =
  "min-h-16 w-full border border-ink bg-paper-2 px-3 font-serif text-5xl leading-none tabular-nums outline-none focus:bg-white";

export const card = "border border-ink bg-paper-2 shadow-[3px_3px_0_#1c1712]";

export const chip = "border border-ink px-3 py-2 text-sm";
export const chipOn = `${chip} bg-ink text-paper`;
export const chipOff = `${chip} bg-paper-2 hover:bg-white`;
