export type CurrentUserProfile = {
  employeeId?: string;
  name: string;
  role?: "admin" | "learner";
  designation: string;
  department: string;
  currentAssignment: string;
  highestQualification: string;
  yearsOfExperience: string;
  previousTraining: string;
  existingSkills: string[];
  workExperience: string;
  resumeFileName: string;
  overallCompetency?: number;
};

const STORAGE_KEY = "statskill.currentUserProfile";

export const defaultCurrentUserProfile: CurrentUserProfile = {
  employeeId: "E001",
  name: "Vivek Reddy",
  role: "learner",
  designation: "Statistical Officer",
  department: "Ministry of Electronics & IT",
  currentAssignment: "NSS Field Survey & Data Validation",
  highestQualification: "M.Sc. Statistics",
  yearsOfExperience: "8",
  previousTraining: "Data Privacy in Public Sector, Foundational AI",
  existingSkills: ["Survey Design", "Data Analysis", "Communication"],
  workExperience: "Responsible for data validation, tabulation, and preliminary analysis of survey datasets.",
  resumeFileName: "Vivek_Reddy_Resume.pdf",
  overallCompetency: 74,
};

export function getCurrentUserProfile(): CurrentUserProfile {
  if (typeof window === "undefined") return defaultCurrentUserProfile;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCurrentUserProfile;

    const parsed = JSON.parse(raw) as Partial<CurrentUserProfile>;

    return {
      ...defaultCurrentUserProfile,
      ...parsed,
      existingSkills: Array.isArray(parsed.existingSkills)
        ? parsed.existingSkills.filter(
            (skill): skill is string => typeof skill === "string",
          )
        : defaultCurrentUserProfile.existingSkills,
    };
  } catch {
    return defaultCurrentUserProfile;
  }
}

export function saveCurrentUserProfile(
  profile: CurrentUserProfile,
): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearCurrentUserProfile(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
}

export function getUserInitials(name: string): string {
  if (!name || !name.trim()) return "U";
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
