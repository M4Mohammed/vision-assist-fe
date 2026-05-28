import {
  FileText,
  Image as ImageIcon,
  PlaySquare,
  Radio,
  Subtitles,
  type LucideIcon,
} from "lucide-react";
import type { ProfileStat } from "@/lib/mock/profile";
import { StatCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils/cn";

const iconMap: Record<ProfileStat["iconKey"], LucideIcon> = {
  image: ImageIcon,
  play: PlaySquare,
  broadcast: Radio,
  caption: Subtitles,
  document: FileText,
};

interface StatGridProps {
  stats: ProfileStat[];
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.iconKey];
        const isWide = stat.key === "lexical_units_total";
        return (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            caption={stat.caption}
            icon={<Icon className="size-5" />}
            className={cn(
              isWide && "sm:col-span-2 lg:col-span-2",
              index === 3 && "sm:col-span-1", // total captions
            )}
          />
        );
      })}
    </div>
  );
}
