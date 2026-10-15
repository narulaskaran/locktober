/**
 * Renders copy that may contain {month}, filled with the current month's name.
 * The name comes from CSS (see .month-name in globals.css) because the month is
 * only known in the browser, and this way it needs no client state or flash.
 */
export function MonthText({ text }: { text: string }) {
  const [before, after] = text.split("{month}");
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <span className="month-name" />
      {after}
    </>
  );
}
