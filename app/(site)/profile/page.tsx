"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UsageDonut } from "@/components/profile/UsageDonut";
import { StatGrid } from "@/components/profile/StatGrid";
import { LexicalUnitsChart } from "@/components/profile/LexicalUnitsChart";
import { MediaArchive } from "@/components/profile/MediaArchive";
import {
  lexicalUnits,
  mediaArchive,
  profileStats,
  profileSummary,
  usageSlices,
} from "@/lib/mock/profile";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <ProfileHeader userSystemId={profileSummary.userSystemId} />

        <section
          aria-label="Usage summary"
          className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_1fr]"
        >
          <UsageDonut
            centerPercent={profileSummary.totalAnalyzedPercent}
            slices={usageSlices}
          />
          <StatGrid stats={profileStats} />
        </section>

        <LexicalUnitsChart units={lexicalUnits} />

        <MediaArchive items={mediaArchive} />
      </div>
    </AuthGuard>
  );
}
