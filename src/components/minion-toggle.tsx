import { setMinionMode } from "@/server/minion";
import { btnEmber, btnGhost } from "@/lib/styles";

export function MinionToggle({ on, label }: { on: boolean; label: string }) {
  return (
    <form
      action={setMinionMode}
      className="fixed right-4 z-40 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-5"
    >
      <input type="hidden" name="enabled" value={on ? "0" : "1"} />
      <button
        type="submit"
        aria-pressed={on}
        className={`${on ? btnEmber : btnGhost} shadow-[3px_3px_0_#1c1712]`}
      >
        {label}
      </button>
    </form>
  );
}
