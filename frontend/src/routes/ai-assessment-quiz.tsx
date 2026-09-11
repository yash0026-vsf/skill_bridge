import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Flag,
  RotateCcw,
  Sparkles,
  Upload,
  XCircle,
} from "lucide-react";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import {
  getQuizQuestions,
  getQuizInsights,
  type QuizQuestion,
} from "@/lib/quiz-data";

export const Route = createFileRoute("/ai-assessment-quiz")({
  component: AIAssessmentQuizPage,
});

type QuizMode = "diagnostic" | "post-learning";
type QuizView = "setup" | "quiz" | "results";

function AIAssessmentQuizPage() {
  const [mode] = useState<QuizMode>(() => {
    if (typeof window === "undefined") {
      return "post-learning";
    }

    const params = new URLSearchParams(window.location.search);

    return params.get("mode") === "diagnostic"
      ? "diagnostic"
      : "post-learning";
  });

  const isDiagnostic = mode === "diagnostic";

  const [view, setView] = useState<QuizView>(
    isDiagnostic ? "quiz" : "setup",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);

  const questions = useMemo(() => getQuizQuestions(), []);
  const insights = useMemo(() => getQuizInsights(), []);

  const currentQuestion = questions[currentQuestionIndex];

  const answeredCount = Object.keys(answers).length;

  const correctCount = questions.reduce((count, question) => {
    return (
      count +
      (answers[question.id] === question.correctAnswer ? 1 : 0)
    );
  }, 0);

  const incorrectCount = questions.reduce((count, question) => {
    const answer = answers[question.id];

    if (answer === undefined) {
      return count;
    }

    return count + (answer !== question.correctAnswer ? 1 : 0);
  }, 0);

  const notAttemptedCount = questions.length - answeredCount;

  const score = questions.length
    ? Math.round((correctCount / questions.length) * 100)
    : 0;

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMarkedForReview([]);
    setView("quiz");
  };

  const handlePostLearningGenerate = () => {
    if (!selectedFile) {
      return;
    }

    /*
     * Temporary frontend behaviour.
     *
     * Later this button will send the selected learning material
     * to the backend and request an AI-generated post-learning quiz.
     */
    startQuiz();
  };

  const handleDiagnosticStart = () => {
    /*
     * Temporary frontend behaviour.
     *
     * Later this action will retrieve the diagnostic quiz generated
     * automatically by the backend from the learner's profile,
     * role requirements and initial competency assessment.
     */
    startQuiz();
  };

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((previous) => previous + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((previous) => previous - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleToggleReview = () => {
    if (!currentQuestion) {
      return;
    }

    setMarkedForReview((previous) =>
      previous.includes(currentQuestion.id)
        ? previous.filter((id) => id !== currentQuestion.id)
        : [...previous, currentQuestion.id],
    );
  };

  const handleSubmit = () => {
    setView("results");
  };

  const handleRestart = () => {
    setView(isDiagnostic ? "quiz" : "setup");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMarkedForReview([]);

    if (!isDiagnostic) {
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <DashboardSidebar className="sticky top-0 hidden h-screen lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar onMenuClick={() => undefined} />

        <main className="flex-1 px-4 py-6 lg:px-7 lg:py-7">
          <div className="mx-auto max-w-6xl space-y-5">
            {view === "setup" && (
              <PostLearningSetupView
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
                onGenerate={handlePostLearningGenerate}
              />
            )}

            {view === "quiz" && currentQuestion && (
              <QuizViewComponent
                mode={mode}
                questions={questions}
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                answers={answers}
                answeredCount={answeredCount}
                markedForReview={markedForReview}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onJump={handleQuestionJump}
                onToggleReview={handleToggleReview}
                onSubmit={handleSubmit}
                onBack={() => {
                  if (!isDiagnostic) {
                    setView("setup");
                  }
                }}
              />
            )}

            {view === "results" && (
              <ResultsView
                mode={mode}
                questions={questions}
                insights={insights}
                answers={answers}
                correctCount={correctCount}
                incorrectCount={incorrectCount}
                notAttemptedCount={notAttemptedCount}
                score={score}
                onRestart={handleRestart}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function PostLearningSetupView({
  selectedFile,
  onFileSelect,
  onGenerate,
}: {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onGenerate: () => void;
}) {
  return (
    <>
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          Learning Assessment Quiz
        </h1>
      </section>

      <section>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:p-6">
          <div className="flex items-start gap-3 border-b border-border pb-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              <Upload className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-bold text-foreground">
                Upload Learning Material
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Add the material you studied for AI-generated assessment questions.
              </p>
            </div>
          </div>

          <label className="mt-4 block cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/20 p-7 text-center transition hover:border-accent/40 hover:bg-muted/30">
            <input
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.mp4,.mov,.avi"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                onFileSelect(file);
              }}
            />

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-card text-accent shadow-sm">
              <Upload className="h-4 w-4" />
            </div>

            <p className="mt-3 text-sm font-semibold text-foreground">
              Drop your learning material here
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              PDF, PowerPoint, Word, text, or supported video
            </p>

            <span className="mt-3 inline-flex rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground">
              Choose File
            </span>
          </label>

          {selectedFile && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-accent" />

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {selectedFile.name}
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    Ready for assessment generation
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onFileSelect(null)}
                className="shrink-0 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Remove file"
              >
                ×
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onGenerate}
            disabled={!selectedFile}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Generate AI Quiz
            <ArrowRight className="h-4 w-4" />
          </button>

          {!selectedFile && (
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Upload learning material to continue.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function QuizViewComponent({
  mode,
  questions,
  currentQuestion,
  currentQuestionIndex,
  answers,
  answeredCount,
  markedForReview,
  onAnswer,
  onNext,
  onPrevious,
  onJump,
  onToggleReview,
  onSubmit,
  onBack,
}: {
  mode: QuizMode;
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion;
  currentQuestionIndex: number;
  answers: Record<number, number>;
  answeredCount: number;
  markedForReview: number[];
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onJump: (index: number) => void;
  onToggleReview: () => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const isDiagnostic = mode === "diagnostic";
  const isMarked = markedForReview.includes(currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const progress = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100,
  );

  return (
    <>
      <section>
        {!isDiagnostic && (
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Quiz Setup
          </button>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isDiagnostic
                ? "Current Competency Diagnostic"
                : "Learning Assessment Quiz"}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              Self-paced
            </span>

            <span>{answeredCount} answered</span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
              {isDiagnostic
                ? "Diagnostic Competency Quiz"
                : "Post-Learning Quiz"}
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {isDiagnostic
                ? "Questions generated from your competency assessment context."
                : "Questions generated from your uploaded learning material."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              Q{currentQuestionIndex + 1}/{questions.length}
            </span>

            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">
              {progress}%
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-orange-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700">
                  Question {String(currentQuestionIndex + 1).padStart(2, "0")}
                </span>

                <span className="text-[11px] text-muted-foreground">
                  Single Choice · 1 Mark
                </span>
              </div>

              <button
                type="button"
                onClick={onToggleReview}
                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  isMarked
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Flag className="h-3.5 w-3.5" />
                {isMarked ? "Marked" : "Mark for Review"}
              </button>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">
                {currentQuestion.competency}
              </p>

              <h2 className="mt-2 text-xl font-bold leading-7 tracking-tight text-foreground">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="mt-5 space-y-2.5">
              {currentQuestion.options.map((option, index) => {
                const selected = answers[currentQuestion.id] === index;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onAnswer(index)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition ${
                      selected
                        ? "border-accent bg-accent-soft/40"
                        : "border-border bg-background hover:border-accent/40 hover:bg-muted/30"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        selected
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="text-sm leading-5 text-foreground">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={onPrevious}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  type="button"
                  onClick={onSubmit}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  Submit Assessment
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Question Navigator
                  </p>

                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Jump to a question
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-muted-foreground">
                  {questions.length} total
                </span>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-1.5">
                {questions.map((question, index) => {
                  const answered = answers[question.id] !== undefined;
                  const marked = markedForReview.includes(question.id);
                  const active = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => onJump(index)}
                      className={`relative flex h-8 items-center justify-center rounded-md border text-[11px] font-bold transition ${
                        active
                          ? "border-accent bg-accent text-accent-foreground"
                          : answered
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {index + 1}

                      {marked && (
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Current
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Answered
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Marked for review
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

function ResultsView({
  mode,
  questions,
  insights,
  answers,
  correctCount,
  incorrectCount,
  notAttemptedCount,
  score,
  onRestart,
}: {
  mode: QuizMode;
  questions: QuizQuestion[];
  insights: import("@/lib/quiz-data").CompetencyInsight[];
  answers: Record<number, number>;
  correctCount: number;
  incorrectCount: number;
  notAttemptedCount: number;
  score: number;
  onRestart: () => void;
}) {
  const isDiagnostic = mode === "diagnostic";

  const feedback =
    score >= 80
      ? "Strong performance across the assessed competency areas."
      : score >= 60
        ? "Good progress. Targeted practice in weaker competency areas can strengthen your current capability."
        : "The assessment highlights competency areas that would benefit from additional learning and practice.";

  return (
    <>
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
           

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {isDiagnostic
                ? "Current Competency Results"
                : "Learning Assessment Results"}
            </h1>

            
          </div>

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart Assessment
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:border-r lg:border-border lg:pr-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Assessment Complete</span>
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="text-success">Evaluated</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {correctCount}
              </span>

              <span className="text-xl text-muted-foreground">
                / {questions.length}
              </span>

              <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                {score}% Performance
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {isDiagnostic
                ? "This result can be used by the competency engine to refine your current competency after the diagnostic assessment."
                : "This result can be used to measure learning progress and update competency after training."}
            </p>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:col-span-8">
            <MetricCard
              label="Correct Answers"
              value={`${correctCount}`}
              detail={`${score}% accuracy`}
              tone="success"
            />

            <MetricCard
              label="Incorrect Answers"
              value={`${incorrectCount}`}
              detail="Review recommended"
              tone="danger"
            />

            <MetricCard
              label="Not Attempted"
              value={`${notAttemptedCount}`}
              detail="Questions left unanswered"
              tone="neutral"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-accent-soft p-2 text-accent">
            <Sparkles className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base font-bold text-foreground">
              Personalized Feedback
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {feedback}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Competency Insights
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Performance signals across assessed competency areas.
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {insights.map((insight) => {
            const tone =
              insight.result === "Strong"
                ? "success"
                : insight.result === "Needs Practice"
                  ? "danger"
                  : "accent";

            return (
              <div
                key={insight.competency}
                className="rounded-lg border border-border bg-muted/20 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-foreground">
                    {insight.competency}
                  </h3>

                  <span
                    className={
                      tone === "success"
                        ? "rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold text-success"
                        : tone === "danger"
                          ? "rounded-full bg-destructive/10 px-2 py-1 text-[10px] font-bold text-destructive"
                          : "rounded-full bg-accent-soft px-2 py-1 text-[10px] font-bold text-accent"
                    }
                  >
                    {insight.result}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {insight.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Review Your Answers
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Review your response, the correct answer, and the explanation.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {questions.map((question, index) => {
            const selectedAnswer = answers[question.id];
            const isCorrect =
              selectedAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  )}

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Question {index + 1} · {question.competency}
                    </p>

                    <h3 className="mt-1 text-sm font-bold leading-5 text-foreground">
                      {question.question}
                    </h3>
                  </div>
                </div>

                <div className="mt-3 grid gap-2.5 md:grid-cols-2">
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Your Answer
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-foreground">
                      {selectedAnswer !== undefined
                        ? question.options[selectedAnswer]
                        : "Not answered"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-success/5 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-success">
                      Correct Answer
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-foreground">
                      {question.options[question.correctAnswer]}
                    </p>
                  </div>
                </div>

                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Explanation
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {question.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {isDiagnostic ? (
        <section className="rounded-xl border border-accent/20 bg-accent-soft p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Next Step
              </p>

              <h2 className="mt-1 text-base font-bold text-foreground">
                Continue to your skill gap analysis
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your diagnostic performance can be used to refine current
                competency before personalized learning recommendations.
              </p>
            </div>

            <Link
              to="/skill-gap-analysis"
              className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
            >
              View Skill Gaps
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-accent/20 bg-accent-soft p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Next Learning
              </p>

              <h2 className="mt-1 text-base font-bold text-foreground">
                Continue building weaker competency areas
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                This assessment can be used to measure learning progress and
                update your competency after training.
              </p>
            </div>

            <Link
              to="/learning-paths"
              className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
            >
              View Learning Paths
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "success" | "danger" | "neutral";
}) {
  const wrapper =
    tone === "success"
      ? "bg-success/5 border-success/10"
      : tone === "danger"
        ? "bg-destructive/5 border-destructive/10"
        : "bg-muted/20 border-border";

  const valueClass =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-destructive"
        : "text-foreground";

  return (
    <div className={`rounded-lg border p-3.5 ${wrapper}`}>
      <p className="text-[11px] font-medium text-muted-foreground">
        {label}
      </p>

      <p className={`mt-1 text-xl font-extrabold ${valueClass}`}>
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-muted-foreground">{detail}</p>
    </div>
  );
}
