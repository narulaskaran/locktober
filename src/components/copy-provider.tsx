"use client";

import { createContext, useContext } from "react";
import { english, type Copy } from "@/lib/copy";

const CopyContext = createContext<Copy>(english);

export function CopyProvider({
  copy,
  children,
}: {
  copy: Copy;
  children: React.ReactNode;
}) {
  return <CopyContext.Provider value={copy}>{children}</CopyContext.Provider>;
}

export function useCopy() {
  return useContext(CopyContext);
}
