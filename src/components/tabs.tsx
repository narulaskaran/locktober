"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCopy } from "@/components/copy-provider";

export function ChallengeTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const copy = useCopy();
  const base = `/c/${slug}`;
  const items = [
    { href: "", label: copy.tabs.today },
    { href: "/month", label: copy.tabs.month },
    { href: "/finale", label: copy.tabs.finale },
    { href: "/crew", label: copy.tabs.crew },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-paper-2 pb-[env(safe-area-inset-bottom)] md:static md:mt-6 md:border-0 md:bg-transparent md:pb-0">
      <ul className="mx-auto grid max-w-2xl grid-cols-4 md:flex md:gap-2">
        {items.map((item) => {
          const href = `${base}${item.href}`;
          const active =
            item.href === ""
              ? pathname === base
              : pathname.startsWith(href);
          return (
            <li key={item.href}>
              <Link
                href={href}
                className={`flex min-h-14 items-center justify-center px-3 text-sm md:min-h-10 md:border md:border-ink ${
                  active
                    ? "bg-ink font-medium text-paper md:bg-ink"
                    : "text-ink-soft md:bg-paper-2 md:text-ink"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
