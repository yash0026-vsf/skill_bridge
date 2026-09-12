import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  Compass,
  Download,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Medal,
  Radar,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  X,
  type LucideIcon,
} from "lucide-react";
import { StatSkillWordmark } from "@/components/StatSkillLogo";
import { getSkillGapSummaries } from "@/lib/learner-data";
import { getCurrentUserProfile } from "@/lib/current-user";
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
  action?: "badges" | "cpe" | "settings";
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
      { label: "Cadre Badges", icon: Medal, action: "badges" },
      { label: "Certificates & CPE", icon: BadgeCheck, action: "cpe" },
      { label: "Settings", icon: Settings, action: "settings" },
    ],
  },
];

const itemClass =
  "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function DashboardSidebar({ className }: { className?: string }) {
  const [activeDialog, setActiveDialog] = useState<"badges" | "cpe" | "settings" | null>(null);
  const user = getCurrentUserProfile();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("statskill.session");
      window.location.href = "/login";
    }
  };

  return (
    <>
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
                        <button
                          type="button"
                          onClick={() => item.action && setActiveDialog(item.action)}
                          className={cn(
                            itemClass,
                            activeDialog === item.action && "bg-accent-soft text-accent font-semibold"
                          )}
                        >
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

      {/* Cadre Badges Modal */}
      {activeDialog === "badges" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Medal className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">National Cadre Badges</h3>
                  <p className="text-xs text-muted-foreground">Issued under MoSPI & NSSTA Competency Framework</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🥇</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">Official Statistics Specialist (Level 3)</h4>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">VERIFIED</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Certified in National Accounts, Index Numbers, and GVA Compilation standards.</p>
                    <p className="mt-2 text-[10px] font-medium text-accent">Awarded by National Statistical Systems Training Academy (NSSTA)</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">Sampling Methodology Auditor</h4>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">VERIFIED</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Competency in Stratified Neyman Allocation, cluster sampling, and non-sampling bias mitigation.</p>
                    <p className="mt-2 text-[10px] font-medium text-accent">MoSPI Cadre Board · Benchmark 82%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-border bg-background p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⏳</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">Python Data Automation Fellow</h4>
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">68% PROGRESS</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Complete the remaining iGOT Python module and pass the mastery quiz to unlock Level 3 badge.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Close
              </button>
              <a
                href="https://igotkarmayogi.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Sync with iGOT Karmayogi <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Certificates & CPE Modal */}
      {activeDialog === "cpe" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <BadgeCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">Certificates & CPE Credits</h3>
                  <p className="text-xs text-muted-foreground">Continuing Professional Education (MoSPI Mandate)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground">Total CPE Hours</p>
                <p className="mt-1 text-2xl font-black text-foreground">42.5 <span className="text-xs font-normal text-muted-foreground">/ 50 hrs</span></p>
                <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">85% Completed</span>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground">Certificates Issued</p>
                <p className="mt-1 text-2xl font-black text-foreground">3</p>
                <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">Govt. Verified</span>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-2.5">
                  <Award className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs font-bold text-foreground">National Accounts Compilation (NSSTA)</p>
                    <p className="text-[10px] text-muted-foreground">16 CPE Hours · Issued Jan 2026</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-accent">View PDF</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-foreground">DPDP Act 2023 & Microdata Confidentiality</p>
                    <p className="text-[10px] text-muted-foreground">14 CPE Hours · Issued Nov 2025</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-accent">View PDF</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Survey Sampling & Design of Experiments</p>
                    <p className="text-[10px] text-muted-foreground">12.5 CPE Hours · Issued Aug 2025</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-accent">View PDF</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => alert("Official MoSPI CPE Transcript generated. Downloading PDF...")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
              >
                <Download className="h-3.5 w-3.5" /> Download Transcript
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeDialog === "settings" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Settings className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">Platform & Cadre Settings</h3>
                  <p className="text-xs text-muted-foreground">Manage profile, role parameters, and sessions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">Active Profile</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">{user.designation} · {user.department}</p>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">ID: {user.employeeId}</p>
                  </div>
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent uppercase">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground">AI Assessment Engine</p>
                    <p className="text-[11px] text-muted-foreground">Connected to Gemini 2.5 Flash via MoSPI Backend</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">CONNECTED</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground">iGOT Karmayogi Sync</p>
                    <p className="text-[11px] text-muted-foreground">Auto-synchronize courses and completion hours</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">ENABLED</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>

              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
