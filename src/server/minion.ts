"use server";

import { cookies } from "next/headers";
import { MINION_COOKIE } from "@/lib/voice";

export async function setMinionMode(formData: FormData) {
  const jar = await cookies();
  if (formData.get("enabled") === "1") {
    jar.set(MINION_COOKIE, "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
      sameSite: "lax",
      httpOnly: true,
    });
    return;
  }
  jar.set(MINION_COOKIE, "", { path: "/", maxAge: 0 });
}
