import type { Locale, StepCopy } from "@/lib/types";

export type LandingVariant = { id: string; pre: string; highlight: string };

export type Faq = { q: string; a: string };
export type Testimonial = { handle: string; title: string; body: string };
export type Lesson = { title: string; body?: string };
export type Course = { title: string; subtitle: string; lessons: Lesson[] };

export type Dict = {
  code: Locale;
  htmlLang: string;
  name: string;
  meta: { title: string; description: string };
  common: {
    continue: string;
    back: string;
    skip: string;
    none: string;
    selectAll: string;
    of: string;
    yourDog: string;
  };
  sections: { dog: string; behaviour: string; training: string };
  landing: {
    variants: LandingVariant[];
    consent: string;
    privacy: string;
    terms: string;
    cta: string;
  };
  steps: Record<string, StepCopy>;
  breeds: { search: string; common: string; unknown: string; list: string[] };
  prediction: {
    eyebrow: string;
    headlinePre: string;
    headlineHighlight: string;
    headlinePost: string;
    now: string;
    nowItems: string[];
    goal: string;
    goalItems: string[];
  };
  building: { headline: string; tasks: string[]; testimonial: Testimonial };
  planReady: {
    headline: string;
    profile: string;
    cta: string;
    labels: { name: string; breed: string; age: string };
  };
  email: {
    headline: string;
    subhead: string;
    label: string;
    placeholder: string;
    cta: string;
    privacy: string;
    invalid: string;
  };
  optin: { headline: string; yes: string; no: string };
  discount: {
    headline: string;
    subhead: string;
    cta: string;
    off: string;
    scratchHint: string;
    wonHeadline: string;
    wonSubhead: string;
    wonCta: string;
  };
  offer: {
    timer: string;
    promoTitle: string;
    promoBadge: string;
    planNames: Record<string, string>;
    popular: string;
    perDay: string;
    weekly: string;
    total: string;
    billed: string;
    /** e.g. "≈ {amount}" — wraps the local-currency estimate next to the USD price. */
    approx: string;
    /** Disclaimer under the CTA: real charge is USD, the local figure is only an estimate. */
    approxNote: string;
    cta: string;
    stat: string;
    whyHeadline: string;
    why: string[];
    guaranteeEyebrow: string;
    guaranteeTitle: string;
    guaranteeBody: string;
    faqHeadline: string;
    faq: Faq[];
    testimonialsHeadline: string;
    testimonials: Testimonial[];
    contact: string;
    expired: string;
    restart: string;
    checkoutError: string;
  };
  login: {
    headline: string;
    subhead: string;
    label: string;
    placeholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    cta: string;
    sending: string;
    sentHeadline: string;
    sentBody: string;
    invalid: string;
    noAccessHeadline: string;
    noAccessBody: string;
    noAccessCta: string;
    signedInAs: string;
    signOut: string;
    /** Wrong e-mail/password combination on sign-in itself. */
    wrongCredentials: string;
    forgotPassword: string;
    firstAccessCta: string;
    or: string;
  };
  resetPassword: {
    headline: string;
    subhead: string;
    label: string;
    confirmLabel: string;
    placeholder: string;
    cta: string;
    saving: string;
    mismatch: string;
    tooShort: string;
    error: string;
    expiredHeadline: string;
    expiredBody: string;
    expiredCta: string;
  };
  success: {
    headline: string;
    body: string;
    cta: string;
    placeholderNote: string;
    /** Shown to a real buyer arriving from the checkout platform. */
    paidHeadline: string;
    paidBody: string;
    paidSteps: string[];
    paidCta: string;
    paidHint: string;
    upsellHeading: string;
    upsellSkip: string;
  };
  member: {
    tabs: { course: string; training: string; clicker: string; products: string };
    otherProductsHeadline: string;
    otherProductsEmpty: string;
    otherProductsCta: string;
    inviteCta: string;
    /** {url} placeholder for the share link. */
    inviteMessage: string;
    inviteCopied: string;
    coursesHeadline: string;
    inProgress: string;
    courses: Course[];
    lessonLabel: string;
    stepLabel: string;
    backToCourse: string;
    previewNote: string;
    stepPlaceholder: string;
    allLessons: string;
    clickerTitle: string;
    clickerBody: string;
    clickerButton: string;
    clickerHint: string;
  };
  videoPlaceholder: { label: string; hint: string };
  imagePlaceholder: string;
};
