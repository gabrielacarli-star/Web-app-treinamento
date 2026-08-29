import type { Answers, QuizStep } from "./types";

const picked = (answers: Answers, id: string, option: string) => {
  const value = answers[id];
  return Array.isArray(value) ? value.includes(option) : value === option;
};

/**
 * Structure only — every visible string is resolved per locale from
 * `src/content/<locale>.ts` using the step and option ids below.
 */
export const QUIZ_STEPS: QuizStep[] = [
  { id: "dog_sex", type: "single", section: "dog", options: ["female", "male"] },
  { id: "dog_name", type: "text", section: "dog" },
  {
    id: "dog_age",
    type: "single",
    section: "dog",
    options: ["m0_6", "m7_12", "y1_2", "y2_7", "y7plus"],
  },
  { id: "dog_breed", type: "breed", section: "dog" },
  { id: "proof_breed", type: "interstitial" },
  {
    id: "dog_health",
    type: "multi",
    section: "dog",
    options: ["healthy", "vision", "hearing", "joints"],
    hasNone: true,
  },
  {
    id: "potty",
    type: "multi",
    section: "behaviour",
    options: ["no_routine", "night", "alone"],
    hasNone: true,
  },
  {
    id: "home_issues",
    type: "multi",
    section: "behaviour",
    options: ["crate", "biting", "barking", "chewing"],
    hasNone: true,
  },
  {
    id: "walk_issues",
    type: "multi",
    section: "behaviour",
    options: ["not_outside", "pulling", "eats_trash"],
    hasNone: true,
  },
  {
    id: "activity",
    type: "single",
    section: "behaviour",
    options: ["very", "moderate", "low"],
  },
  { id: "heard_you", type: "interstitial" },
  {
    id: "commands_known",
    type: "multi",
    section: "training",
    options: [
      "name",
      "heel",
      "no",
      "food_lure",
      "touch",
      "look",
      "stand",
      "place",
      "down",
      "drop",
    ],
    hasNone: true,
  },
  { id: "scale_ignores", type: "scale", section: "training" },
  { id: "scale_bond", type: "scale", section: "training" },
  {
    id: "reason",
    type: "multi",
    section: "training",
    options: [
      "new_dog",
      "baby",
      "moving",
      "wedding",
      "work_schedule",
      "travel",
      "guests",
      "just_wellbehaved",
    ],
    hasNone: true,
  },
  {
    id: "moving_date",
    type: "date",
    section: "training",
    showIf: (answers) => picked(answers, "reason", "moving"),
  },
  {
    id: "trained_before",
    type: "single",
    section: "training",
    options: ["pro", "alone", "not_yet"],
  },
  {
    id: "owner_age",
    type: "single",
    section: "training",
    options: ["a18_24", "a25_34", "a35_44", "a45_54", "a55plus"],
  },
  {
    id: "time_together",
    type: "single",
    section: "training",
    options: ["love", "sometimes", "not_enough", "challenge"],
  },
];

export const visibleSteps = (answers: Answers) =>
  QUIZ_STEPS.filter((step) => !step.showIf || step.showIf(answers));
