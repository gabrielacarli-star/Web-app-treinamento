export type Locale = "pt" | "es" | "en";

export type StepType =
  | "single"
  | "multi"
  | "text"
  | "breed"
  | "scale"
  | "date"
  | "interstitial";

export type Section = "dog" | "behaviour" | "training";

export type Answers = Record<string, string | string[]>;

export type QuizStep = {
  id: string;
  type: StepType;
  section?: Section;
  /** Option ids; labels live in the locale dictionaries. */
  options?: string[];
  /** Adds a "none of the above" escape that clears the other picks. */
  hasNone?: boolean;
  /** Steps that only apply to some answer paths. */
  showIf?: (answers: Answers) => boolean;
};

export type StepCopy = {
  question?: string;
  hint?: string;
  placeholder?: string;
  skip?: string;
  none?: string;
  options?: Record<string, string>;
  /** Interstitial-only. */
  headline?: string;
  body?: string;
  minLabel?: string;
  maxLabel?: string;
};
