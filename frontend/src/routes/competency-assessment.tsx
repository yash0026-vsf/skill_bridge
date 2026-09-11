import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { CompetencyRadar } from "@/components/dashboard/DashboardSections";
import { getCurrentUserProfile } from "@/lib/current-user";
import {
  getCompetencyAssessmentState,
  getDefaultCompetencies,
  type CompetencyScore,
} from "@/lib/learner-data";

export const Route = createFileRoute("/competency-assessment")({
  head: () => ({
    meta: [
      { title: "Competency Assessment — StatSkill" },
      {
        name: "description",
        content: "Review your AI-generated competency assessment and start the diagnostic quiz.",
      },
    ],
  }),
  component: CompetencyAssessmentPage,
});

type ProfileData = {
  designation: string;
  department: string;
  currentAssignment: string;
  highestQualification: string;
  yearsOfExperience: string;
  previousTraining: string;
};

function CompetencyAssessmentPage() {
  const savedProfile = getCurrentUserProfile();

  const profile: ProfileData = {
    designation: savedProfile.designation,
    department: savedProfile.department,
    currentAssignment: savedProfile.currentAssignment,
    highestQualification: savedProfile.highestQualification,
    yearsOfExperience: savedProfile.yearsOfExperience,
    previousTraining: savedProfile.previousTraining,
  };

  const existingSkills = savedProfile.existingSkills;
  const workExperience = savedProfile.workExperience;
  const resumeFileName = savedProfile.resumeFileName;
  const assessmentState = getCompetencyAssessmentState();
  const initialCompetencies = getDefaultCompetencies();
  const currentCompetencies = getDefaultCompetencies();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <DashboardSidebar className="sticky top-0 hidden h-screen lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar onMenuClick={() => undefined} />

        <main className="flex-1 px-4 py-7 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                  Competency Assessment
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your starting competency is being established from your profile and resume.
                </p>
              </div>
              <span className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent">
                {assessmentState.status === "Ready"
                  ? "Assessment Ready"
                  : assessmentState.status}
              </span>
            </section>

            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">Initial competency score</p>
                  <div className="mt-2 flex items-end gap-3">
                    <span className="text-5xl font-extrabold tracking-tight text-foreground">--</span>
                    <span className="pb-2 text-sm text-muted-foreground">Awaiting AI result</span>
                  </div>
                  <a href="/ai-assessment-quiz?mode=diagnostic" className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90">
                    Start Diagnostic Quiz
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    This is the baseline score produced from the evidence you submitted. The diagnostic quiz will validate and refine it.
                  </p>
                </div>

                <CompetencyGrid items={initialCompetencies} />
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current competency</p>
                  <h2 className="mt-1 text-lg font-bold text-foreground">Updated after diagnostic assessment</h2>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">Awaiting diagnostic</div>
              </div>

              <div className="mt-4">
                <CompetencyGrid items={currentCompetencies} />
              </div>
            </section>

            <CompetencyRadar showAction={false} />

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-base font-bold text-foreground">Assessment context</h2>
                <div className="mt-4 space-y-2.5">
                  <InfoRow label="Designation" value={profile.designation || "Not provided"} />
                  <InfoRow label="Department" value={profile.department || "Not provided"} />
                  <InfoRow label="Assignment" value={profile.currentAssignment || "Not provided"} />
                  <InfoRow label="Qualification" value={profile.highestQualification || "Not provided"} />
                  <InfoRow label="Experience" value={profile.yearsOfExperience || "Not provided"} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-base font-bold text-foreground">Evidence</h2>
                <p className="mt-1 text-xs text-muted-foreground">Inputs used for the initial assessment.</p>

                <div className="mt-4 rounded-lg border border-success/20 bg-success/5 p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-success" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{resumeFileName || "Resume uploaded"}</p>
                      <p className="text-xs text-muted-foreground">Ready for AI processing</p>
                    </div>
                  </div>
                </div>

                {existingSkills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Skills</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {existingSkills.map((skill) => (
                        <span key={skill} className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Work experience</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{workExperience || "Not provided"}</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function CompetencyGrid({ items }: { items: CompetencyScore[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.name} className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">{item.name}</p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {item.score === null ? "--" : `${item.score}%`}
          </p>
        </div>
      ))}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-3.5 py-2.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="max-w-[65%] truncate text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
