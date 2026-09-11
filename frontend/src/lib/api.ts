/**
 * StatSkill AI Backend API Client
 * Connects the React/Vite UI directly to the FastAPI Backend Server
 * with built-in caching & graceful offline demo fallback.
 */

export const API_BASE = 
  import.meta.env.VITE_API_URL || 
  (typeof window !== "undefined" && window.location.hostname === "localhost" 
    ? "http://localhost:8000" 
    : "");

export type UserSession = {
  user_id: string;
  name: string;
  email: string;
  role: "admin" | "learner";
  designation?: string;
  department?: string;
  employee_id?: string;
  token: string;
};

export type ExtractedSkillItem = {
  skill: string;
  level: number;
  raw_skill?: string;
  evidence?: string;
};

export type AssessResult = {
  employee_id: string;
  extracted_skills: ExtractedSkillItem[];
  initial_competencies: Record<string, number>;
  overall_score: number;
};

export type GapAnalysisRow = {
  skill: string;
  category: "Technical" | "Statistical" | "Governance" | "Managerial";
  description: string;
  currentLevel: number;
  currentLabel: string;
  requiredLevel: number;
  requiredLabel: string;
  gap: number;
  priority: "High" | "Moderate" | "Low" | "On Target";
};

export type GapDomain = {
  domain: string;
  gap: number;
  note: string;
};

export type GapAnalysisResponse = {
  employee_id: string;
  role: string;
  department: string;
  overall_competency: number;
  rows: GapAnalysisRow[];
  domains: GapDomain[];
};

export type RadarDimension = {
  dimension: string;
  current: number;
  target: number;
};

export type DomainCard = {
  icon: string;
  title: string;
  description: string;
  score: number;
  status: string;
  tone: "success" | "destructive" | "neutral";
};

export type CompetenciesResponse = {
  employee_id: string;
  radar: RadarDimension[];
  domains: DomainCard[];
};

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

export async function loginUser(email: string, password: string): Promise<UserSession> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`Login failed with status ${res.status}`);
    const data = (await res.json()) as UserSession;
    if (typeof window !== "undefined") {
      localStorage.setItem("statskill.session", JSON.stringify(data));
    }
    return data;
  } catch (err) {
    console.warn("Backend auth unavailable, using demo fallback:", err);
    const role: "admin" | "learner" = email.toLowerCase().includes("admin") ? "admin" : "learner";
    const demoSession: UserSession = {
      user_id: role === "admin" ? "USR-ADMIN" : "USR-E001",
      name: role === "admin" ? "Dr. S. K. Mukherjee (Admin)" : "Vivek Reddy",
      email,
      role,
      designation: role === "admin" ? "Joint Director (HRD)" : "Statistical Officer",
      department: role === "admin" ? "MoSPI" : "Ministry of Electronics & IT",
      employee_id: role === "admin" ? "ADM001" : "E001",
      token: "demo-local-token"
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("statskill.session", JSON.stringify(demoSession));
    }
    return demoSession;
  }
}

export async function assessProfile(payload: {
  employee_id: string;
  experience_text: string;
  designation?: string;
  department?: string;
}): Promise<AssessResult> {
  try {
    const res = await fetch(`${API_BASE}/api/assess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Assessment failed with status ${res.status}`);
    const data = (await res.json()) as AssessResult;
    if (typeof window !== "undefined") {
      localStorage.setItem("statskill.activeAssessment", JSON.stringify(data));
    }
    return data;
  } catch (err) {
    console.warn("Backend assess unavailable, generating local estimate:", err);
    const fallback: AssessResult = {
      employee_id: payload.employee_id,
      extracted_skills: [
        { skill: "Survey Design", level: 4, evidence: "Demonstrated across past experience" },
        { skill: "Data Analysis", level: 3, evidence: "Tabulation and validation experience" },
        { skill: "Python", level: 1, evidence: "Emerging competency requirement" },
        { skill: "Data Governance", level: 3, evidence: "Public sector compliance awareness" }
      ],
      initial_competencies: {
        "Statistical Sciences": 78,
        "Technical & Analytics": 45,
        "Governance & Compliance": 82,
        "Field Operations": 70
      },
      overall_score: 69
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("statskill.activeAssessment", JSON.stringify(fallback));
    }
    return fallback;
  }
}

export async function fetchGapAnalysis(employeeId: string): Promise<GapAnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/gap-analysis/${employeeId}`);
    if (!res.ok) throw new Error(`Gap analysis failed: ${res.status}`);
    const data = (await res.json()) as GapAnalysisResponse;
    if (typeof window !== "undefined") {
      localStorage.setItem("statskill.activeGapAnalysis", JSON.stringify(data));
    }
    return data;
  } catch (err) {
    console.warn("Fetch gap analysis fallback:", err);
    return getCachedGapAnalysis();
  }
}

export async function fetchCompetencies(employeeId: string): Promise<CompetenciesResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/competencies/${employeeId}`);
    if (!res.ok) throw new Error(`Competencies fetch failed: ${res.status}`);
    return (await res.json()) as CompetenciesResponse;
  } catch (err) {
    console.warn("Fetch competencies fallback:", err);
    return {
      employee_id: employeeId,
      radar: [
        { dimension: "Statistical Sciences", current: 82, target: 80 },
        { dimension: "Technical & Analytics", current: 61, target: 75 },
        { dimension: "Governance & Compliance", current: 88, target: 80 },
        { dimension: "Field Operations & Leadership", current: 76, target: 70 },
      ],
      domains: [
        { icon: "analytics", title: "Statistical Sciences", description: "Core official statistics & sampling.", score: 82, status: "Above Target", tone: "success" },
        { icon: "terminal", title: "Technical & Analytics", description: "Python, SQL, automated workflows.", score: 61, status: "Needs Attention", tone: "destructive" },
        { icon: "policy", title: "Digital Governance", description: "Data protection & civil service protocols.", score: 88, status: "Above Target", tone: "success" },
        { icon: "account_tree", title: "Field Operations", description: "Survey administration & quality audits.", score: 76, status: "On Target", tone: "success" },
      ]
    };
  }
}

export function getCachedGapAnalysis(): GapAnalysisResponse {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("statskill.activeGapAnalysis");
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
  }
  return {
    employee_id: "E001",
    role: "Statistical Officer",
    department: "Ministry of Statistics (MoSPI)",
    overall_competency: 74,
    rows: [
      { skill: "Python for Data Processing", category: "Technical", description: "Data automation & cleaning scripts", currentLevel: 1, currentLabel: "Novice", requiredLevel: 3, requiredLabel: "Intermediate", gap: -2, priority: "High" },
      { skill: "Survey Sampling Design", category: "Statistical", description: "Stratified & cluster sampling protocols", currentLevel: 4, currentLabel: "Advanced", requiredLevel: 4, requiredLabel: "Advanced", gap: 0, priority: "On Target" },
      { skill: "Relational SQL Queries", category: "Technical", description: "Database extraction & aggregation", currentLevel: 2, currentLabel: "Foundational", requiredLevel: 3, requiredLabel: "Intermediate", gap: -1, priority: "Moderate" },
      { skill: "Data Privacy & Governance", category: "Governance", description: "Government metadata & privacy standards", currentLevel: 4, currentLabel: "Advanced", requiredLevel: 3, requiredLabel: "Intermediate", gap: 1, priority: "On Target" }
    ],
    domains: [
      { domain: "Technical & Analytical", gap: 14, note: "Python and automated data workflows" },
      { domain: "Statistical Sciences", gap: 8, note: "National accounts and sampling estimation" },
      { domain: "Managerial & Field Operations", gap: 4, note: "Field coordination and quality controls" },
      { domain: "Digital Governance", gap: 0, note: "Current competency meets benchmark" }
    ]
  };
}
