import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Landmark,
  Mail,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import { StatSkillWordmark } from "@/components/StatSkillLogo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "StatSkill AI — Competency Intelligence for India's Statistical Workforce",
      },
      {
        name: "description",
        content:
          "AI-powered competency intelligence and personalized learning for India's statistical workforce. Build skills, close gaps, strengthen the workforce.",
      },
      {
        property: "og:title",
        content: "StatSkill AI — Competency Intelligence Platform",
      },
      {
        property: "og:description",
        content:
          "AI-powered competency intelligence and personalized learning for India's statistical workforce.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const valueProps = [
  {
    icon: ClipboardList,
    title: "Assess",
    text: "Understand current competencies and identify skill gaps.",
  },
  {
    icon: BookOpen,
    title: "Learn",
    text: "Get personalized learning recommendations based on your role.",
  },
  {
    icon: TrendingUp,
    title: "Improve",
    text: "Track progress and continuously strengthen workforce capability.",
  },
];

const roles = [
  {
    id: "learner" as const,
    icon: User,
    title: "Learner",
    text: "Build your competency profile, identify skill gaps and follow your personalized learning path.",
  },
  {
    id: "admin" as const,
    icon: ShieldCheck,
    title: "Admin",
    text: "Understand workforce capability, identify organizational gaps and plan training interventions.",
  },
];

type Role = (typeof roles)[number]["id"];

function Index() {
  const [role, setRole] = useState<Role>("learner");
  const [status, setStatus] = useState<string | null>(null);

  const mockAuth = (label: string) => {
    setStatus(null);
    setTimeout(
      () =>
        setStatus(
          `${label} is a prototype demo — no real authentication happens yet.`,
        ),
      600,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
        {/* Left: brand + value proposition */}
        <section className="flex flex-1 flex-col justify-start px-6 pt-12 pb-16 lg:px-16 lg:pt-16 lg:pb-20">
          <StatSkillWordmark />

          <h1 className="mt-20 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:mt-24">
            Build Skills.
            <br />
            Close Gaps.
            <br />
            <span className="text-accent">
              Strengthen the Workforce.
            </span>
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            AI-powered competency intelligence and personalized learning for
            India's statistical workforce.
          </p>

          <div className="mt-14 grid max-w-lg gap-4 sm:grid-cols-3">
            {valueProps.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
                  <item.icon className="h-4 w-4" />
                </div>

                <h2 className="mt-3 text-sm font-semibold text-foreground">
                  {item.title}
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right: sign in */}
        <section className="flex flex-1 flex-col justify-start border-t border-border bg-card px-6 pt-12 pb-16 lg:border-l lg:border-t-0 lg:px-16 lg:pt-16 lg:pb-20">
          <div className="mx-auto mt-12 w-full max-w-md lg:mt-32">
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
              Sign in as{" "}
              {role === "learner" ? "Learner" : "Admin"}
            </h2>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              You'll be taken to your personalized competency and learning
              dashboard.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {roles.map((r) => {
                const selected = role === r.id;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    aria-pressed={selected}
                    className={cn(
                      "relative rounded-xl border-2 p-4 text-left transition-colors",
                      selected
                        ? "border-accent bg-accent-soft"
                        : "border-border bg-card hover:border-muted-foreground/30",
                    )}
                  >
                    {selected && (
                      <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    )}

                    <r.icon
                      className={cn(
                        "h-5 w-5",
                        selected
                          ? "text-accent"
                          : "text-muted-foreground",
                      )}
                    />

                    <div className="mt-3 text-sm font-semibold text-foreground">
                      {r.title}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {r.text}
                    </p>
                  </button>
                );
              })}
            </div>

            {role === "learner" ? (
              <button
                type="button"
                onClick={() => mockAuth("Government SSO")}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Landmark className="h-4 w-4" />
                Sign in with Government SSO / Parichay
              </button>
            ) : (
              <button
                type="button"
                onClick={() => mockAuth("Government SSO")}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Landmark className="h-4 w-4" />
                Sign in with Government SSO / Parichay
              </button>
            )}

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Your selected role will determine your StatSkill AI workspace.
            </p>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-border" />

              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                or
              </span>

              <span className="h-px flex-1 bg-border" />
            </div>

            {role === "learner" ? (
 
              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Mail className="h-4 w-4" />
                Continue with Email
              </Link>
            ) : (
  <Link
    to="/login"
    search={{ role: "admin" }}
    className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
  >
    <Mail className="h-4 w-4" />
    Continue with Email
  </Link>
)}

            {status && (
              <p
                role="status"
                className="mt-6 rounded-lg bg-muted px-4 py-3 text-center text-xs font-medium text-foreground"
              >
                {status}
              </p>
            )}

            <p className="mt-8 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <span className="underline underline-offset-2">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="underline underline-offset-2">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}