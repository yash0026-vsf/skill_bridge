import {
  getCurrentUserProfile,
} from "@/lib/current-user";
import {
  getCompetencyDomains,
  getLearningRecommendations,
  getRadarData,
  getRadarLegend,
  getSkillGapSummaries,
  getSummaryStats,
} from "@/lib/learner-data";

/**
 * Compatibility layer for the existing dashboard components.
 *
 * Learner identity comes from the shared current-user profile.
 * Dashboard presentation data remains behind getters so the integration
 * teammate can swap the implementation for API data without redesigning UI.
 */
export const officer = {
  get name() {
    return getCurrentUserProfile().name || "Learner";
  },

  get shortRole() {
    return getCurrentUserProfile().designation || "Learner";
  },

  get role() {
    const profile = getCurrentUserProfile();
    return [profile.designation, profile.department]
      .filter(Boolean)
      .join(" · ") || "Learner";
  },

  get cadre() {
    const profile = getCurrentUserProfile();
    return profile.department || "Statistical Workforce";
  },

  cadreId: "",
  syncLabel: "Profile data source ready",
};

// Dynamically proxy dashboard arrays so any UI read pulls the latest live data from getters
export const summaryStats = new Proxy([] as any, {
  get(target, prop, receiver) {
    const data = getSummaryStats();
    const val = Reflect.get(data, prop, receiver);
    return typeof val === "function" ? val.bind(data) : val;
  }
});

export const competencyDomains = new Proxy([] as any, {
  get(target, prop, receiver) {
    const data = getCompetencyDomains();
    const val = Reflect.get(data, prop, receiver);
    return typeof val === "function" ? val.bind(data) : val;
  }
});

export const radarData = new Proxy([] as any, {
  get(target, prop, receiver) {
    const data = getRadarData();
    const val = Reflect.get(data, prop, receiver);
    return typeof val === "function" ? val.bind(data) : val;
  }
});

export const radarLegend = new Proxy([] as any, {
  get(target, prop, receiver) {
    const data = getRadarLegend();
    const val = Reflect.get(data, prop, receiver);
    return typeof val === "function" ? val.bind(data) : val;
  }
});

export const skillGaps = new Proxy([] as any, {
  get(target, prop, receiver) {
    const data = getSkillGapSummaries();
    const val = Reflect.get(data, prop, receiver);
    return typeof val === "function" ? val.bind(data) : val;
  }
});

export const learningPaths = new Proxy([] as any, {
  get(target, prop, receiver) {
    const data = getLearningRecommendations().map((path) => ({
      track: `${path.provider} · ${path.category}`,
      rating: "—",
      title: path.title,
      reason: path.whyRecommended ?? path.description,
      duration: path.duration,
      level: path.category,
      provider: path.provider,
      progress: path.progress,
      statusLabel:
        path.status === "In Progress"
          ? `${path.progress}% Completed`
          : path.status,
      cta: path.status === "In Progress" ? "Resume Module" : "View Path",
      courseUrl: path.courseUrl,
    }));
    const val = Reflect.get(data, prop, receiver);
    return typeof val === "function" ? val.bind(data) : val;
  }
});

