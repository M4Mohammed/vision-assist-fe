import {
  BadgeCheck,
  Clock,
  Eye,
  Globe,
  Hand,
  History,
  Monitor,
  Volume2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Capability {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const capabilities: Capability[] = [
  {
    title: "Real-Time Vision",
    description:
      "Advanced AI analyzes your camera feed in real-time, providing instant descriptions.",
    Icon: Eye,
  },
  {
    title: "Lightning Fast",
    description:
      "Get captions in milliseconds with our optimized processing pipeline.",
    Icon: Zap,
  },
  {
    title: "Always Here for You",
    description: "Always on, 24 hours a day, 7 days a week.",
    Icon: Clock,
  },
  {
    title: "High Accuracy",
    description:
      "Industry-leading accuracy with continuous learning models.",
    Icon: BadgeCheck,
  },
  {
    title: "World for all",
    description:
      "See the world through us and share the experience with everyone.",
    Icon: Globe,
  },
  {
    title: "Text to Speech",
    description:
      "Generated captions are read by a high-fidelity AI assistant.",
    Icon: Volume2,
  },
  {
    title: "Who Said a Visa?",
    description: "Free and forever free. No hidden costs or subscriptions.",
    Icon: Monitor,
  },
  {
    title: "Easy as a Finger Snap",
    description:
      "React to the system and control everything with your voice.",
    Icon: Hand,
  },
  {
    title: "History Tracking",
    description:
      "Keep track of all generated captions with timestamps and analytics.",
    Icon: History,
  },
];

export function CapabilitiesGrid() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="border-b border-[var(--stroke)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-3">
          <h2
            id="capabilities-heading"
            className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          >
            Powerful AI Capabilities
          </h2>
          <p className="max-w-2xl text-[var(--fg-secondary)]">
            Everything you need for intelligent visual understanding.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ title, description, Icon }) => (
            <li key={title}>
              <Card className="flex h-full flex-col gap-6 p-8">
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-full bg-[var(--bg-elevated)] text-white"
                >
                  <Icon className="size-6" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
                    {description}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
