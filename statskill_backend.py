"""StatSkill Connected Backend API Server
Connects Member 2's AI Skill Intelligence engine directly with Member 5's React frontend
(https://github.com/NihalTiwari8008/statskill-ai-entry).

Maintains 100% UI/UX fidelity while powering:
1. POST /api/assess -> Gemini AI extraction & semantic taxonomy normalization
2. GET  /api/gap-analysis/{employee_id} -> Live benchmark gap calculation
3. GET  /api/competencies/{employee_id} -> Radar chart & domain percentages
4. GET  /api/learning-recommendations/{employee_id} -> Official iGOT/NSSTA course paths
5. GET  /api/quiz/diagnostic/{employee_id} -> Adaptive pre/post quiz items
"""

import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Member 2 Modules
from data_loader import load_employees, load_requirements, load_courses
from skill_extractor import extract_skills
from skill_normalizer import normalize_extracted_skills
from gap_analyzer import merge_skills, calculate_skill_gaps

app = FastAPI(
    title="StatSkill Connected AI Backend",
    description="Powers the StatSkill Frontend with real-time AI skill assessment & gap analysis",
    version="1.0.0",
)

# Enable CORS for frontend (Vite/React typically on port 5173, 3000, or 8080)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load underlying datasets
EMPLOYEES = {e["employee_id"]: e for e in load_employees()}
REQUIREMENTS = load_requirements()
COURSES = load_courses()

# ---------------------------------------------------------------------------
# Pydantic Schemas (Aligned with frontend expectations)
# ---------------------------------------------------------------------------
class LoginPayload(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    user_id: str
    name: str
    email: str
    role: str
    designation: Optional[str] = None
    department: Optional[str] = None
    employee_id: Optional[str] = None
    token: str

class AssessPayload(BaseModel):
    employee_id: str
    experience_text: str
    designation: Optional[str] = None
    department: Optional[str] = None

class ExtractedSkillItem(BaseModel):
    skill: str
    level: int
    raw_skill: Optional[str] = None
    evidence: Optional[str] = None

class AssessResult(BaseModel):
    employee_id: str
    extracted_skills: List[ExtractedSkillItem]
    initial_competencies: Dict[str, int]
    overall_score: int


# ---------------------------------------------------------------------------
# 0. Authentication (Powers /login with Role-Based Access)
# ---------------------------------------------------------------------------
@app.post("/api/auth/login", response_model=UserResponse, tags=["Authentication"])
def login(payload: LoginPayload):
    email_clean = payload.email.strip().lower()

    # Admin Login Check (MoSPI Officer / Administrator)
    if "admin" in email_clean:
        return UserResponse(
            user_id="USR-ADMIN-01",
            name="Dr. S. K. Mukherjee",
            email="admin@statskill.gov.in",
            role="admin",
            designation="Joint Director (HRD & Training)",
            department="Ministry of Statistics & Programme Implementation (MoSPI)",
            employee_id="ADM001",
            token="bearer-admin-token-2026"
        )

    # Check matching employee in official catalog (by ID or name)
    found_emp = None
    for emp in EMPLOYEES.values():
        e_id = emp.get("employee_id", "").lower()
        e_name = emp.get("name", "").lower()
        if e_id == email_clean or email_clean in e_name or email_clean.split("@")[0] in e_name.replace(" ", "."):
            found_emp = emp
            break

    # If demo test profiles
    if not found_emp:
        if "rajesh" in email_clean or "101" in email_clean:
            found_emp = {
                "employee_id": "EMP101",
                "name": "Rajesh Kumar",
                "designation": "Statistical Officer",
                "department": "MoSPI, Government of India",
                "existing_skills": {"SPSS": 4, "MS Excel": 4, "Sampling Design": 3, "Survey Auditing": 3}
            }
        elif "priya" in email_clean or "102" in email_clean:
            found_emp = {
                "employee_id": "EMP102",
                "name": "Priya Sharma",
                "designation": "Data Analyst",
                "department": "National Accounts & Economic Analytics",
                "existing_skills": {"Python": 4, "SQL": 4, "Tableau": 4, "Exploratory Data Analysis": 3}
            }
        elif "amit" in email_clean or "103" in email_clean:
            found_emp = {
                "employee_id": "EMP103",
                "name": "Amit Patel",
                "designation": "Field Survey Supervisor",
                "department": "Field Operations Division (FOD)",
                "existing_skills": {"Field Enumeration": 4, "CAPI Application": 3, "Quality Control": 3}
            }
        else:
            # Default to first official employee (Vivek Reddy - E001)
            found_emp = EMPLOYEES.get("E001") or list(EMPLOYEES.values())[0]

    return UserResponse(
        user_id=f"USR-{found_emp.get('employee_id')}",
        name=found_emp.get("name", "Officer"),
        email=payload.email if "@" in payload.email else f"{found_emp.get('name', 'officer').lower().replace(' ', '.')}@gov.in",
        role="learner",
        designation=found_emp.get("designation") or found_emp.get("current_role", "Statistical Officer"),
        department=found_emp.get("department", "MoSPI"),
        employee_id=found_emp.get("employee_id"),
        token=f"bearer-learner-token-{found_emp.get('employee_id')}"
    )


@app.get("/api/auth/me", tags=["Authentication"])
def get_current_user_info(token: Optional[str] = None):
    if token and "admin" in token.lower():
        return {
            "user_id": "USR-ADMIN-01",
            "name": "Dr. S. K. Mukherjee",
            "role": "admin",
            "designation": "Joint Director",
            "department": "MoSPI"
        }
    return {
        "user_id": "USR-E001",
        "name": "Vivek Reddy",
        "role": "learner",
        "designation": "Statistical Officer",
        "department": "Ministry of Electronics & IT",
        "employee_id": "E001"
    }


# ---------------------------------------------------------------------------
# 1. AI Competency Assessment (Powers /build-profile & /competency-assessment)
# ---------------------------------------------------------------------------
@app.post("/api/assess", response_model=AssessResult, tags=["Competency Assessment"])
def assess_profile(payload: AssessPayload):
    """Invokes Gemini LLM to extract competencies from experience text
    and updates active employee record for dynamic gap analysis.
    """
    text = payload.experience_text.strip()
    if not text:
        return AssessResult(
            employee_id=payload.employee_id,
            extracted_skills=[],
            initial_competencies={"Statistical": 40, "Technical": 30, "Governance": 50, "Behavioural": 60},
            overall_score=45
        )

    # Real Gemini AI extraction & normalization
    raw = extract_skills(text)
    normalized = normalize_extracted_skills(raw)

    extracted_skills = []
    extracted_dict = {}
    category_scores = {"Statistical": [], "Technical": [], "Governance": [], "Behavioural": []}

    for item in normalized:
        comp_name = item.get("mapped_competency") or item.get("raw_skill", item.get("skill"))
        lvl = int(item.get("level", 1))
        extracted_dict[comp_name] = lvl
        extracted_skills.append(
            ExtractedSkillItem(
                skill=comp_name,
                level=lvl,
                raw_skill=item.get("raw_skill"),
                evidence=item.get("evidence")
            )
        )
        pct = lvl * 20
        c_lower = comp_name.lower()
        if any(w in c_lower for w in ["survey", "analysis", "data", "sampling", "statistic", "econom"]):
            category_scores["Statistical"].append(pct)
        elif any(w in c_lower for w in ["python", "sql", "digital", "system", "code", "automation"]):
            category_scores["Technical"].append(pct)
        elif any(w in c_lower for w in ["governance", "privacy", "office", "compliance", "rti"]):
            category_scores["Governance"].append(pct)
        else:
            category_scores["Behavioural"].append(pct)

    initial_comps = {
        cat: int(sum(scores)/len(scores)) if scores else 50
        for cat, scores in category_scores.items()
    }
    overall = int(sum(initial_comps.values()) / len(initial_comps))

    # Update active in-memory employee record so subsequent /gap-analysis reflects this assessment!
    e_id = payload.employee_id or "EMP-ACTIVE"
    EMPLOYEES[e_id] = {
        "employee_id": e_id,
        "name": payload.employee_id,
        "designation": payload.designation or "Statistical Officer",
        "department": payload.department or "Ministry of Statistics (MoSPI)",
        "existing_skills": extracted_dict,
        "resume_text": text
    }

    return AssessResult(
        employee_id=e_id,
        extracted_skills=extracted_skills,
        initial_competencies=initial_comps,
        overall_score=overall
    )


# ---------------------------------------------------------------------------
# 2. Skill Gap Analysis (Powers /skill-gap-analysis)
# ---------------------------------------------------------------------------
@app.get("/api/gap-analysis/{employee_id}", tags=["Gap Analysis"])
def get_gap_analysis(employee_id: str):
    """Returns 100% dynamic gap rows, domain rollups, and summary metrics for the frontend table & charts."""
    emp = EMPLOYEES.get(employee_id) or list(EMPLOYEES.values())[0]
    role = emp.get("designation") or emp.get("current_role", "Statistical Officer")
    required = emp.get("required_competency_profile") or REQUIREMENTS.get(role, {})
    existing = emp.get("existing_skills") or emp.get("quiz_assessed_skills") or {}

    calculated = calculate_skill_gaps(existing, required)

    rows = []
    category_gaps = {
        "Technical & Analytical": 0,
        "Statistical Sciences": 0,
        "Managerial & Field Operations": 0,
        "Digital Governance": 0
    }
    category_largest_gap = {}
    total_req_points = 0
    total_curr_points = 0

    for item in calculated:
        curr = item["current_level"]
        req = item["required_level"]
        gap = curr - req  # Frontend format: negative means gap (e.g. -2)
        priority = "High" if gap <= -2 else ("Moderate" if gap == -1 else "On Target")

        total_req_points += req
        total_curr_points += min(curr, req)

        # Categorize
        name = item["skill"]
        name_l = name.lower()
        if any(w in name_l for w in ["python", "sql", "digital", "gis", "code", "system", "automation"]):
            cat = "Technical"
            dom = "Technical & Analytical"
        elif any(w in name_l for w in ["survey", "analysis", "sampling", "account", "statistic", "econom"]):
            cat = "Statistical"
            dom = "Statistical Sciences"
        elif any(w in name_l for w in ["governance", "privacy", "office", "compliance", "rti"]):
            cat = "Governance"
            dom = "Digital Governance"
        else:
            cat = "Managerial"
            dom = "Managerial & Field Operations"

        gap_amt = max(0, req - curr)
        category_gaps[dom] += gap_amt
        if gap_amt > 0 and (dom not in category_largest_gap or gap_amt > category_largest_gap[dom][1]):
            category_largest_gap[dom] = (name, gap_amt)

        level_labels = {0: "None", 1: "Novice", 2: "Foundational", 3: "Intermediate", 4: "Advanced", 5: "Expert"}
        rows.append({
            "skill": name,
            "category": cat,
            "description": f"Competency evaluation for {name}",
            "currentLevel": curr,
            "currentLabel": level_labels.get(curr, "Operational"),
            "requiredLevel": req,
            "requiredLabel": level_labels.get(req, "Advanced"),
            "gap": gap,
            "priority": priority
        })

    # Dynamic overall competency percentage
    overall_comp = int(round((total_curr_points / total_req_points * 100))) if total_req_points > 0 else 75

    # Dynamic domains list
    domains = []
    for dom_name, total_gap in category_gaps.items():
        if total_gap > 0 and dom_name in category_largest_gap:
            top_s, _ = category_largest_gap[dom_name]
            note = f"Primary focus on {top_s} and workflow integration"
        elif total_gap > 0:
            note = f"Identified competency gap of {total_gap} levels across domain"
        else:
            note = "Current competency meets benchmark requirements"

        domains.append({
            "domain": dom_name,
            "gap": total_gap,
            "note": note
        })

    return {
        "employee_id": employee_id,
        "role": role,
        "department": emp.get("department", "Government Department"),
        "overall_competency": overall_comp,
        "rows": rows,
        "domains": domains
    }


# ---------------------------------------------------------------------------
# 2.1 Dynamic Radar & Competencies (Powers /dashboard & /competency-assessment)
# ---------------------------------------------------------------------------
@app.get("/api/competencies/{employee_id}", tags=["Competencies"])
def get_competencies(employee_id: str):
    """Returns dynamic radar chart coordinates and domain cards comparing current vs benchmark."""
    emp = EMPLOYEES.get(employee_id) or list(EMPLOYEES.values())[0]
    role = emp.get("designation") or emp.get("current_role", "Statistical Officer")
    required = emp.get("required_competency_profile") or REQUIREMENTS.get(role, {})
    existing = emp.get("existing_skills") or emp.get("quiz_assessed_skills") or {}

    radar_domains = [
        {"dimension": "Statistical Sciences", "keywords": ["survey", "analysis", "sampling", "statistic", "account", "econom"]},
        {"dimension": "Technical & Analytics", "keywords": ["python", "sql", "digital", "data", "gis", "automation"]},
        {"dimension": "Governance & Compliance", "keywords": ["governance", "privacy", "office", "compliance", "rti"]},
        {"dimension": "Field Operations & Leadership", "keywords": ["leadership", "management", "communication", "coordination", "field"]}
    ]

    radar_data = []
    domain_cards = []

    for item in radar_domains:
        dim = item["dimension"]
        kw = item["keywords"]

        curr_scores = []
        req_scores = []

        for s, req_lvl in required.items():
            if any(k in s.lower() for k in kw):
                req_scores.append(req_lvl)
                curr_lvl = 0
                for es, el in existing.items():
                    if es.lower() == s.lower():
                        curr_lvl = el
                        break
                curr_scores.append(curr_lvl)

        if not req_scores:
            req_scores = [3]
            curr_scores = [2]

        avg_req = sum(req_scores) / len(req_scores)
        avg_curr = sum(curr_scores) / len(curr_scores)

        target_pct = min(100, int(round(avg_req * 20)))
        current_pct = min(100, int(round(avg_curr * 20)))

        radar_data.append({
            "dimension": dim,
            "current": current_pct,
            "target": target_pct
        })

        diff = current_pct - target_pct
        status = "Above Target" if diff >= 5 else ("On Target" if diff >= -5 else "Needs Attention")
        tone = "success" if diff >= -5 else "destructive"

        domain_cards.append({
            "icon": "analytics" if "Statistical" in dim else ("terminal" if "Technical" in dim else ("policy" if "Governance" in dim else "account_tree")),
            "title": dim,
            "description": f"Benchmark competency requirements for {role}.",
            "score": current_pct,
            "status": status,
            "tone": tone
        })

    return {
        "employee_id": employee_id,
        "radar": radar_data,
        "domains": domain_cards
    }



# ---------------------------------------------------------------------------
# 3. Learning Paths / Recommendations (Powers /learning-paths)
# ---------------------------------------------------------------------------
@app.get("/api/learning-recommendations/{employee_id}", tags=["Learning Paths"])
def get_learning_recommendations(employee_id: str):
    """Returns targeted course cards from the 50-course catalog matching identified gaps."""
    emp = EMPLOYEES.get(employee_id) or list(EMPLOYEES.values())[0]
    role = emp.get("designation") or emp.get("current_role", "")
    required = REQUIREMENTS.get(role, {})
    existing = emp.get("existing_skills") or {}
    gaps = calculate_skill_gaps(existing, required)

    gapped = {g["skill"]: g for g in gaps if g["gap"] > 0}
    recommendations = []

    for idx, c in enumerate(COURSES, 1):
        c_skills = c.get("competencies_v3", c.get("skills", []))
        diff = c.get("difficulty_level", 1)
        for s_name, g in gapped.items():
            if any(s_name.lower() == s.lower() for s in c_skills) and (g["current_level"] < diff <= g["required_level"]):
                recommendations.append({
                    "id": idx,
                    "title": c.get("name"),
                    "description": c.get("description", "Comprehensive public sector training module."),
                    "whyRecommended": f"Bridges gap from Level {g['current_level']} to Level {g['required_level']} in {s_name}.",
                    "provider": c.get("channel", "iGOT"),
                    "category": "Technical" if any(w in s_name.lower() for w in ["python", "sql"]) else "Statistical",
                    "duration": f"{c.get('duration_hours', 8)} hours",
                    "skills": c_skills,
                    "status": "Recommended",
                    "progress": 0,
                    "priority": "High" if g["gap"] >= 2 else "Medium"
                })
                break

    return recommendations


# ---------------------------------------------------------------------------
# 4. Diagnostic & Post-Learning Quiz (Powers /ai-assessment-quiz)
# ---------------------------------------------------------------------------
@app.get("/api/quiz/{quiz_type}", tags=["Quiz"])
def get_quiz(quiz_type: str = "diagnostic", skill: str = "Survey Design"):
    """Returns quiz questions tailored for the frontend quiz interface."""
    from workflow_3phase import QUESTION_BANK
    matching = [q for q in QUESTION_BANK if skill.lower() in q.skill.lower()]
    if not matching:
        matching = QUESTION_BANK[:5]

    questions_out = []
    for idx, q in enumerate(matching, 1):
        questions_out.append({
            "id": idx,
            "question": q.prompt,
            "options": q.options,
            "correctAnswer": q.correct_option,
            "explanation": q.explanation,
            "competency": q.skill
        })

    return {
        "quiz_type": quiz_type,
        "skill": skill,
        "questions": questions_out
    }


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "StatSkill Connected Backend",
        "frontend_cors_ready": True,
        "available_endpoints": [
            "/api/assess",
            "/api/gap-analysis/{employee_id}",
            "/api/learning-recommendations/{employee_id}",
            "/api/quiz/{quiz_type}"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
