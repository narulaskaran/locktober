import { Suspense } from "react";
import { Avatar } from "@/components/avatar";
import { InviteLink } from "@/components/invite-link";
import { getChallengeContext } from "@/lib/challenges";
import { displayName } from "@/lib/format";
import { timezoneLabel } from "@/lib/timezones";
import { leaveChallenge, removeMember, removeMetric, rotateInvite } from "@/server/actions";
import { btnGhost, card } from "@/lib/styles";
import { MetricForm, NicknameForm, RenameForm } from "@/components/crew-forms";

export default function CrewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="mt-8 text-sm text-ink-soft">Loading the crew…</p>}>
      <Crew params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Crew({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const welcome = query.welcome === "1";
  const { challenge, members, membership } = await getChallengeContext(slug);
  const you = members.find((member) => member.isYou);
  const isOwner = membership.role === "OWNER";

  return (
    <section className="mt-8 flex flex-col gap-8">
      <div className={`${card} p-4 sm:p-5`}>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-ember">
          {welcome ? "You're in. Send this." : "Invite"}
        </p>
        <h2 className="mt-2 font-serif text-4xl leading-none">The link</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Anyone with this link can sign in and join. Without it, they can&apos;t see the board.
        </p>
        <div className="mt-4">
          <InviteLink code={challenge.inviteCode} />
        </div>
        {isOwner ? (
          <form action={rotateInvite} className="mt-4">
            <input type="hidden" name="slug" value={slug} />
            <button className={btnGhost} type="submit">
              Rotate link
            </button>
            <p className="mt-2 text-xs text-ink-soft">The old link stops working.</p>
          </form>
        ) : null}
      </div>

      <div>
        <h2 className="font-serif text-3xl">Crew</h2>
        <ul className="mt-3 border-t border-ink">
          {members.map((member) => {
            const name = displayName(member.name, member.nickname);
            return (
              <li key={member.id} className="flex items-center gap-3 border-b border-line py-3">
                <Avatar name={name} imageUrl={member.imageUrl} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {name}
                    {member.isYou ? <span className="ml-2 text-xs font-normal text-ink-soft">You</span> : null}
                  </p>
                  <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                    {member.role === "OWNER" ? "Owner" : "Member"}
                  </p>
                </div>
                {isOwner && !member.isYou && member.role !== "OWNER" ? (
                  <form action={removeMember}>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="memberId" value={member.id} />
                    <button className="text-sm underline" type="submit">
                      Remove
                    </button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <NicknameForm slug={slug} nickname={you?.nickname ?? ""} />

      {isOwner ? (
        <>
          <RenameForm slug={slug} name={challenge.name} />
          <div>
            <h2 className="font-serif text-3xl">Trackers</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Days use the {timezoneLabel(challenge.timezone)} calendar. Add steps, miles, pull-ups, or another finale event whenever you want.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {challenge.metrics.map((metric) => (
                <li key={metric.id} className="flex items-center justify-between gap-3 border border-line px-3 py-2">
                  <span>
                    <span className="font-medium">{metric.name}</span>
                    <span className="ml-2 text-xs uppercase tracking-[0.14em] text-ink-soft">
                      {metric.kind === "DAILY" ? "Daily" : "Finale"}
                      {metric.unit ? ` · ${metric.unit}` : ""}
                    </span>
                  </span>
                  {challenge.metrics.length > 1 ? (
                    <form action={removeMetric}>
                      <input type="hidden" name="slug" value={slug} />
                      <input type="hidden" name="metricId" value={metric.id} />
                      <button className="text-sm underline" type="submit">
                        Remove
                      </button>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
            <MetricForm slug={slug} />
          </div>
        </>
      ) : null}

      <form action={leaveChallenge}>
        <input type="hidden" name="slug" value={slug} />
        <button className="text-sm text-danger underline" type="submit">
          {members.length === 1 ? "Delete this board" : "Leave this board"}
        </button>
      </form>
    </section>
  );
}
