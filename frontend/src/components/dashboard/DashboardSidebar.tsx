import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Compass,
  LayoutDashboard,
  Medal,
  Radar,
  Settings,
  Sparkles,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { StatSkillWordmark } from "@/components/StatSkillLogo";
import { getSkillGapSummaries } from "@/lib/learner-data";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: LucideIcon;
  to?:
    | "/dashboard"
    | "/competency-assessment"
    | "/skill-gap-analysis"
    | "/learning-paths"
    | "/ai-assessment-quiz";
  badge?: string;
};

const getPriorityGapCount = () => getSkillGapSummaries().length;

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Intelligence & Learning",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
      {
        label: "Competency Assessment",
        icon: Radar,
        to: "/competency-assessment",
      },
      {
        label: "Skill Gap Analysis",
        icon: TrendingDown,
        to: "/skill-gap-analysis",
        get badge() {
          return String(getPriorityGapCount());
        },
      },
      {
        label: "Learning Paths",
        icon: Compass,
        to: "/learning-paths",
      },
      {
        label: "AI Assessment Quiz",
        icon: Sparkles,
        to: "/ai-assessment-quiz",
      },
    ],
  },
  {
    title: "Cadre & Governance",
    items: [
      { label: "Cadre Badges", icon: Medal },
      { label: "Certificates & CPE", icon: BadgeCheck },
      { label: "Settings", icon: Settings },
    ],
  },
];

const itemClass =
  "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function DashboardSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex h-full w-72 shrink-0 flex-col border-r border-border bg-card",
        className,
      )}
    >
      <div className="border-b border-border px-6 py-5">
        <StatSkillWordmark />
      </div>

      <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              {group.title}
            </p>

            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const content = (
                  <>
                    <Icon className="h-[18px] w-[18px]" />

                    <span className="flex-1 text-left">
                      {item.label}
                    </span>

                    {item.badge ? (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-bold text-destructive">
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                );

                return (
                  <li key={item.label}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className={itemClass}
                        activeProps={{
                          className:
                            "bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent",
                        }}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button type="button" className={itemClass}>
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
