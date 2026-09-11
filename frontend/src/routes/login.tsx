import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { StatSkillWordmark } from "@/components/StatSkillLogo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — StatSkill AI" },
      {
        name: "description",
        content:
          "Sign in to StatSkill AI to access your competency and personalized learning dashboard.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const role =
    new URLSearchParams(window.location.search).get("role") === "admin"
      ? "admin"
      : "learner";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Temporary frontend-only behavior.
    // Backend authentication will replace this later.
    window.location.href =
      role === "admin" ? "/admin-dashboard" : "/build-profile";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
        <section className="flex flex-1 flex-col justify-start px-6 pt-10 pb-16 lg:px-16 lg:pt-12 lg:pb-20">
          <StatSkillWordmark />

          <div className="mt-20 max-w-lg lg:mt-20">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Build Skills.
              <br />
              Close Gaps.
              <br />
              <span className="text-accent">Strengthen the Workforce.</span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              Sign in to access your competency profile, skill-gap analysis,
              personalized learning paths and AI-powered assessments.
            </p>
          </div>
        </section>

        <section className="flex flex-1 flex-col border-t border-border bg-card px-6 pt-10 pb-16 lg:border-l lg:border-t-0 lg:px-16 lg:pt-12 lg:pb-20">
          <div className="mx-auto w-full max-w-md">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in options
            </Link>
          </div>

          <div className="mx-auto mt-22 w-full max-w-md">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Sign in with Email
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Enter your registered email and password to continue to
                StatSkill AI.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.gov.in"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="password" className="text-sm font-semibold text-foreground">
                    Password
                  </label>
                  <button type="button" className="text-xs font-semibold text-accent hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative mt-2">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Sign In
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Sign in with Government SSO / Parichay
            </button>

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              Your role and permissions determine which StatSkill AI workspace you can access.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
