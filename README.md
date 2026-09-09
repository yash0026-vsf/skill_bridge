# 🧠 AI Skill Assessment & Gap Analysis (Member 2 Module)

Part of the **AI Skill Intelligence & Learning Platform (PS 26101)**.

This module evaluates employee profiles, extracts skills and proficiency levels (1–5) with evidence using Google Gemini LLM, normalizes technical terminology, and performs rule-based skill gap analysis against benchmark role requirements.

---

## 📁 Repository Structure

```text
├── data/
│   ├── employees.json               # Employee profiles with experience text
│   └── employee_requirement.json    # Benchmark role skill requirements (levels 1-5)
├── data_loader.py                   # Loads JSON dataset files
├── skill_extractor.py               # Gemini 3.6 Flash skill & proficiency extractor
├── skill_normalizer.py              # Case standardizer & technical acronym handler (SQL, ML, AI)
├── gap_analyzer.py                  # Case-insensitive skill merger & gap calculator
├── main.py                          # Batch runner with auto-retry and reporting
├── requirements.txt                 # Python dependencies
├── .env.example                     # Environment template (API key placeholder)
└── .gitignore                       # Protects .env and cache from git commits
```

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure API Key
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run the Pipeline
```bash
python main.py
```
