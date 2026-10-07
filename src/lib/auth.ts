import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const requireUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? null;
  const name =
    clerkUser?.fullName?.trim() ||
    clerkUser?.username?.trim() ||
    email?.split("@")[0] ||
    "Athlete";
  const imageUrl = clerkUser?.imageUrl ?? null;

  return prisma.user.upsert({
    where: { id: userId },
    update: { name, email, imageUrl },
    create: { id: userId, name, email, imageUrl },
  });
});

export async function optionalUserId() {
  const { userId } = await auth();
  return userId;
}
