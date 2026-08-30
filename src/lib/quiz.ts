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

/**
 * Emoji per option, keyed "stepId.optionId". Kept out of the locale files
 * because an emoji reads the same in every language — and because scanning a
 * list of options is much faster with a picture anchoring each line.
 */
export const OPTION_EMOJI: Record<string, string> = {
  "dog_sex.female": "♀️", "dog_sex.male": "♂️",

  "dog_age.m0_6": "🍼", "dog_age.m7_12": "🐶", "dog_age.y1_2": "🐕",
  "dog_age.y2_7": "🦮", "dog_age.y7plus": "🧓",

  "dog_health.healthy": "💚", "dog_health.vision": "👁️",
  "dog_health.hearing": "👂", "dog_health.joints": "🦴",

  "potty.no_routine": "🕐", "potty.night": "🌙", "potty.alone": "🏠",

  "home_issues.crate": "📦", "home_issues.biting": "🦷",
  "home_issues.barking": "🔊", "home_issues.chewing": "🛋️",

  "walk_issues.not_outside": "🚪", "walk_issues.pulling": "🪢",
  "walk_issues.eats_trash": "🗑️",

  "activity.very": "⚡", "activity.moderate": "🙂", "activity.low": "😴",

  "commands_known.name": "📛", "commands_known.heel": "🚶",
  "commands_known.no": "✋", "commands_known.food_lure": "🍖",
  "commands_known.touch": "👆", "commands_known.look": "👀",
  "commands_known.stand": "🧍", "commands_known.place": "🎯",
  "commands_known.down": "⬇️", "commands_known.drop": "🫳",

  "reason.new_dog": "🏡", "reason.baby": "👶", "reason.moving": "📦",
  "reason.wedding": "💍", "reason.work_schedule": "🕐",
  "reason.travel": "✈️", "reason.guests": "🎉",
  "reason.just_wellbehaved": "⭐",

  "moving_date.already": "✅",

  "trained_before.pro": "🎓", "trained_before.alone": "💪",
  "trained_before.not_yet": "🌱",

  "time_together.love": "❤️", "time_together.sometimes": "🙂",
  "time_together.not_enough": "😕", "time_together.challenge": "😤",
};

export const emojiFor = (stepId: string, optionId: string) =>
  OPTION_EMOJI[`${stepId}.${optionId}`];

/**
 * Breeds with a real, on-brand photo to back the social-proof claim on
 * `proof_breed`. Deliberately narrow: hero-leash (Labrador) and hero-potty
 * (Beagle) are the right breed but show the *problem* — a dog pulling, a
 * guilty mess — which contradicts a headline claiming they are already
 * trained. Only pair a breed with a photo that shows a calm, successful dog.
 */
export const BREED_MATCHED_ART: Record<string, string> = {
  "Border Collie": "plan-ready",
  "Golden Retriever": "quiz-heard_you",
};
