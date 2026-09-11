import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Target,
  TrendingDown,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { getCurrentUserProfile } from "@/lib/current-user";
import {
  getOverallCompetency,
  getSkillGapDomains,
  getSkillGapRows,
  type SkillGapDomain,
  type SkillGapRow,
} from "@/lib/learner-data";

export const Route = createFileRoute("/skill-gap-analysis")({
  head: () => ({
    meta: [
      {
        title: "Skill Gap Analysis — StatSkill",
      },
      {
        name: "description",
        content:
          "Review competency gaps, compare current and required levels, and identify priority areas for development.",
      },
    ],
  }),
  component: SkillGapAnalysisPage,
});

type Filter =
  | "all"
  | "priority"
  | "Technical"
  | "Statistical"
  | "Governance"
  | "Managerial";

const gapRows = getSkillGapRows();
const domainGaps = getSkillGapDomains();

function SkillGapAnalysisPage() {
  const currentUser = getCurrentUserProfile();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filteredRows = useMemo(() => {
    if (activeFilter === "all") return gapRows;

    if (activeFilter === "priority") {
      return gapRows.filter(
        (row) => row.priority === "High" || row.priority === "Moderate",
      );
    }

    return gapRows.filter((row) => row.category === activeFilter);
  }, [activeFilter]);

  const priorityGapCount = gapRows.filter((row) => row.gap < 0).length;
  const highPriorityCount = gapRows.filter(
    (row) => row.priority === "High",
  ).length;
  const domainsWithGaps = domainGaps.filter(
    (domain) => domain.gap > 0,
  ).length;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <DashboardSidebar className="sticky top-0 hidden h-screen lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar onMenuClick={() => undefined} />

        <main className="flex-1 px-4 py-8 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-6xl space-y-8">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Skill Gap Analysis
              </div>

              <div className="mt-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                  Understand Your Skill Gaps
                </h1>

                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {currentUser.currentAssignment
                    ? `Current assignment: ${currentUser.currentAssignment}`
                    : currentUser.designation
                      ? `Role: ${currentUser.designation}`
                      : "Profile context not yet provided"}
                  {currentUser.department
                    ? ` · ${currentUser.department}`
                    : ""}
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <SummaryCard
                label="Overall Competency"
                value={`${getOverallCompetency()}%`}
                detail="Current competency across mapped domains"
                icon={<Target className="h-4 w-4" />}
                tone="accent"
              />

              <SummaryCard
                label="Priority Skill Gaps"
                value={`${priorityGapCount}`}
                detail={`${highPriorityCount} high-priority areas require focused development`}
                icon={<AlertTriangle className="h-4 w-4" />}
                tone="danger"
              />

              <SummaryCard
                label="Domains Affected"
                value={`${domainsWithGaps}`}
                detail="Domains currently below the role benchmark"
                icon={<TrendingDown className="h-4 w-4" />}
                tone="neutral"
              />
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm lg:p-6">
              <div className="flex flex-col gap-3 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    Skill Gap by Domain
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Difference between your current competency and the
                    benchmark for your role.
                  </p>
                </div>

                <div className="text-xs font-medium text-muted-foreground">
                  Larger gap = greater development need
                </div>
              </div>

              <div className="mt-6 h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={domainGaps}
                    layout="vertical"
                    margin={{ top: 4, right: 20, left: 18, bottom: 4 }}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke="var(--color-border)"
                    />

                    <XAxis
                      type="number"
                      domain={[0, 20]}
                      tick={{
                        fill: "var(--color-muted-foreground)",
                        fontSize: 11,
                      }}
                      tickFormatter={(value) => `${value}%`}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="domain"
                      width={170}
                      tick={{
                        fill: "var(--color-foreground)",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      cursor={{ fill: "var(--color-muted)" }}
                      formatter={(value) => [`${value}%`, "Gap"]}
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-card)",
                        boxShadow:
                          "0 8px 24px rgba(15, 41, 66, 0.08)",
                      }}
                    />

                    <Bar
                      dataKey="gap"
                      radius={[0, 6, 6, 0]}
                      barSize={24}
                    >
                      {domainGaps.map((entry) => (
                        <Cell
                          key={entry.domain}
                          fill={
                            entry.gap > 0
                              ? entry.gap >= 10
                                ? "var(--color-destructive)"
                                : "var(--color-accent)"
                              : "var(--color-border)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                  High development need
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  Moderate development need
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  At / above benchmark
                </span>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-end lg:justify-between lg:p-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    Detailed Skill Gaps
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Compare current and required competency levels for each
                    mapped skill.
                  </p>
                </div>

                <div className="text-xs font-semibold text-muted-foreground">
                  {filteredRows.length} skills shown
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-border px-5 py-4 lg:px-6">
                <FilterButton
                  label="All"
                  active={activeFilter === "all"}
                  onClick={() => setActiveFilter("all")}
                />

                <FilterButton
                  label="Priority"
                  active={activeFilter === "priority"}
                  onClick={() => setActiveFilter("priority")}
                />

                <FilterButton
                  label="Technical"
                  active={activeFilter === "Technical"}
                  onClick={() => setActiveFilter("Technical")}
                />

                <FilterButton
                  label="Statistical"
                  active={activeFilter === "Statistical"}
                  onClick={() => setActiveFilter("Statistical")}
                />

                <FilterButton
                  label="Governance"
                  active={activeFilter === "Governance"}
                  onClick={() => setActiveFilter("Governance")}
                />

                <FilterButton
                  label="Managerial"
                  active={activeFilter === "Managerial"}
                  onClick={() => setActiveFilter("Managerial")}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-4 lg:px-6">Skill</th>
                      <th className="px-5 py-4 lg:px-6">Current</th>
                      <th className="px-5 py-4 lg:px-6">Required</th>
                      <th className="px-5 py-4 lg:px-6">Gap</th>
                      <th className="px-5 py-4 lg:px-6">Priority</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {filteredRows.map((row) => (
                      <tr
                        key={row.skill}
                        className="transition hover:bg-muted/30"
                      >
                        <td className="px-5 py-5 lg:px-6">
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {row.skill}
                            </p>

                            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                              {row.description}
                            </p>

                            <span className="mt-2 inline-flex rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                              {row.category}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-5 lg:px-6">
                          <p className="text-sm font-bold text-foreground">
                            Level {row.currentLevel}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {row.currentLabel}
                          </p>
                        </td>

                        <td className="px-5 py-5 lg:px-6">
                          <p className="text-sm font-bold text-foreground">
                            Level {row.requiredLevel}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {row.requiredLabel}
                          </p>
                        </td>

                        <td className="px-5 py-5 lg:px-6">
                          {row.gap < 0 ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
                              <TrendingDown className="h-3.5 w-3.5" />
                              {Math.abs(row.gap)} level
                            </span>
                          ) : row.gap > 0 ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                              <Check className="h-3.5 w-3.5" />
                              +{row.gap} level
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                              On target
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-5 lg:px-6">
                          <PriorityBadge priority={row.priority} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  tone: "accent" | "danger" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span
          className={
            tone === "danger"
              ? "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
              : tone === "accent"
                ? "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent"
                : "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          }
        >
          {icon}
        </span>

        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
        {value}
      </p>

      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground"
          : "inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
      }
    >
      {label}
    </button>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: "High" | "Moderate" | "Low" | "On Target";
}) {
  const className =
    priority === "High"
      ? "bg-destructive/10 text-destructive"
      : priority === "Moderate"
        ? "bg-accent-soft text-accent"
        : "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
    >
      {priority}
    </span>
  );
}
