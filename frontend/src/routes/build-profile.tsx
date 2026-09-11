import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileText,
  GraduationCap,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { StatSkillWordmark } from "@/components/StatSkillLogo";
import { getCurrentUserProfile, saveCurrentUserProfile } from "@/lib/current-user";

export const Route = createFileRoute("/build-profile")({
  head: () => ({
    meta: [
      { title: "Build Profile — StatSkill" },
      {
        name: "description",
        content: "Build your competency profile and submit evidence for your initial AI assessment.",
      },
    ],
  }),
  component: BuildProfilePage,
});

type ProfileData = {
  name: string;
  designation: string;
  department: string;
  currentAssignment: string;
  highestQualification: string;
  yearsOfExperience: string;
  previousTraining: string;
};

function BuildProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>(() => {
    const currentUser = getCurrentUserProfile();
    return {
      name: currentUser.name,
      designation: currentUser.designation,
      department: currentUser.department,
      currentAssignment: currentUser.currentAssignment,
      highestQualification: currentUser.highestQualification,
      yearsOfExperience: currentUser.yearsOfExperience,
      previousTraining: currentUser.previousTraining,
    };
  });

  const [existingSkills, setExistingSkills] = useState<string[]>(
    () => getCurrentUserProfile().existingSkills,
  );
  const [workExperience, setWorkExperience] = useState(
    () => getCurrentUserProfile().workExperience,
  );
  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateProfile = (field: keyof ProfileData, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;

    const exists = existingSkills.some(
      (item) => item.toLowerCase() === skill.toLowerCase(),
    );

    if (!exists) setExistingSkills((current) => [...current, skill]);
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setExistingSkills((current) => current.filter((item) => item !== skill));
  };

  const validateResume = (file: File) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const lowerName = file.name.toLowerCase();
    const valid = allowedExtensions.some((extension) =>
      lowerName.endsWith(extension),
    );

    if (!valid) {
      window.alert("Please upload a PDF, DOC or DOCX resume.");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      window.alert("Resume size must be 10 MB or smaller.");
      return false;
    }

    return true;
  };

  const handleResumeChange = (file?: File) => {
    if (file && validateResume(file)) setResumeFile(file);
  };

  const handleGenerateAssessment = () => {
    const requiredFields: Array<[keyof ProfileData, string]> = [
      ["name", "full name"],
      ["designation", "designation"],
      ["department", "department"],
      ["currentAssignment", "current assignment"],
      ["highestQualification", "highest qualification"],
      ["yearsOfExperience", "years of experience"],
    ];

    for (const [field, label] of requiredFields) {
      if (!profile[field].trim()) {
        window.alert(`Please enter your ${label}.`);
        return;
      }
    }

    if (!resumeFile) {
      window.alert("Please upload your latest resume before continuing.");
      return;
    }

    if (!workExperience.trim()) {
      window.alert("Please describe your work experience and responsibilities.");
      return;
    }

    saveCurrentUserProfile({
      ...profile,
      existingSkills,
      workExperience,
      resumeFileName: resumeFile.name,
    });

    navigate({ to: "/competency-assessment" });
  };

  const profileItems = [
    {
      label: "Professional details",
      done:
        profile.name.trim().length > 0 &&
        profile.designation.trim().length > 0 &&
        profile.department.trim().length > 0 &&
        profile.currentAssignment.trim().length > 0,
    },
    {
      label: "Education & experience",
      done:
        profile.highestQualification.trim().length > 0 &&
        profile.yearsOfExperience.trim().length > 0,
    },
    { label: "Resume", done: Boolean(resumeFile) },
    { label: "Skills", done: existingSkills.length > 0 },
    { label: "Work experience", done: workExperience.trim().length > 0 },
  ];

  const completedItems = profileItems.filter((item) => item.done).length;
  const profileCompletion = Math.round(
    (completedItems / profileItems.length) * 100,
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-5 lg:px-8">
          <StatSkillWordmark />
        </div>
      </header>

      <main className="px-4 py-7 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <section>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
              Build Your Competency Profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Add your professional details and resume to establish your starting competency.
            </p>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <section className="xl:col-span-8">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Profile & Evidence
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Information used for the initial AI assessment.
                    </p>
                  </div>
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ProfileInput label="Full Name" value={profile.name} placeholder="e.g. Ananya Sharma" onChange={(value) => updateProfile("name", value)} />
                  <ProfileInput label="Designation" value={profile.designation} placeholder="e.g. Deputy Statistical Officer" onChange={(value) => updateProfile("designation", value)} />
                  <ProfileInput label="Department" value={profile.department} placeholder="e.g. Directorate of Economics & Statistics" onChange={(value) => updateProfile("department", value)} />
                  <ProfileInput label="Current Assignment" value={profile.currentAssignment} placeholder="e.g. Survey Operations & Data Analysis" onChange={(value) => updateProfile("currentAssignment", value)} />
                  <ProfileInput label="Highest Qualification" value={profile.highestQualification} placeholder="e.g. M.Sc. Statistics" onChange={(value) => updateProfile("highestQualification", value)} />
                  <ProfileInput label="Years of Experience" value={profile.yearsOfExperience} placeholder="e.g. 3.5 years" onChange={(value) => updateProfile("yearsOfExperience", value)} />
                  <ProfileInput label="Previous Training" value={profile.previousTraining} placeholder="e.g. Survey Methods, Data Quality" onChange={(value) => updateProfile("previousTraining", value)} />
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Resume / CV</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PDF, DOC or DOCX · Maximum 10 MB
                      </p>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {!resumeFile ? (
                    <label
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                        handleResumeChange(event.dataTransfer.files[0]);
                      }}
                      className={
                        isDragging
                          ? "mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-accent bg-accent/5 px-6 py-8 text-center"
                          : "mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center transition hover:border-accent/50 hover:bg-muted/30"
                      }
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        onChange={(event) => handleResumeChange(event.target.files?.[0])}
                      />
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-foreground">Upload your resume</p>
                      <p className="mt-1 text-xs text-muted-foreground">Drag & drop or click to choose</p>
                    </label>
                  ) : (
                    <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-success/20 bg-success/5 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-5 w-5 shrink-0 text-success" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{resumeFile.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">Ready for assessment</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setResumeFile(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Remove resume">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Existing Skills</h3>
                      <p className="mt-1 text-xs text-muted-foreground">Add the skills you currently use.</p>
                    </div>
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {existingSkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {existingSkills.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`} className="text-muted-foreground hover:text-foreground">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <input
                      value={newSkill}
                      onChange={(event) => setNewSkill(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addSkill();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/10"
                      placeholder="e.g. Python, GIS, Survey Design"
                    />
                    <button type="button" onClick={addSkill} className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">
                      Add
                    </button>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Work Experience</h3>
                      <p className="mt-1 text-xs text-muted-foreground">Responsibilities, projects, tools and statistical work.</p>
                    </div>
                    <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <textarea
                    value={workExperience}
                    onChange={(event) => setWorkExperience(event.target.value)}
                    rows={5}
                    maxLength={2000}
                    className="mt-4 w-full resize-none rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/10"
                    placeholder="Describe your responsibilities and relevant work..."
                  />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Used as assessment evidence</span>
                    <span>{workExperience.length}/2000</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end border-t border-border pt-6">
                  <button type="button" onClick={handleGenerateAssessment} className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90">
                    Generate Initial Assessment
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            <aside className="xl:col-span-4">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Profile</p>
                    <h2 className="mt-1 text-lg font-bold text-foreground">Completion</h2>
                  </div>
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">{profileCompletion}%</span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${profileCompletion}%` }} />
                </div>

                <div className="mt-5 space-y-2">
                  {profileItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 text-sm">
                      <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                      {item.done ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <span className="text-[11px] font-semibold text-muted-foreground">Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/10"
        placeholder={placeholder}
      />
    </div>
  );
}
