"use client";

import { useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { VideoSlot } from "@/components/Slots";
import type { Dict } from "@/content";
import type { OtherProduct } from "@/lib/crossApp";
import { PET_SAUDAVEL_APP_URL } from "@/lib/crossApp";
import { UPSELL_OFFERS } from "@/lib/upsell";
import { DEFAULT_LOCALE } from "@/lib/config";
import type { Locale } from "@/lib/types";
import { SignOutButton } from "./SignOutButton";

type View =
  | { name: "courses" }
  | { name: "lessons"; course: number }
  | { name: "lesson"; course: number; lesson: number; from: "courses" | "training" }
  | { name: "training" }
  | { name: "clicker" }
  | { name: "products" };

type Props = {
  dict: Dict;
  /** Shown before auth is configured: the area is open and says so. */
  preview?: boolean;
  account?: { email: string; signOut: string };
  locale?: Locale;
  /** Other Dr. Eduardo products this buyer's email has an active purchase
   *  for, per Pet Saudável's own database — empty means none, never "we
   *  couldn't check", so this always fails closed. */
  otherProducts?: OtherProduct[];
};

/** Which bottom tab is "on" for a given view — a lesson counts toward
 *  whichever tab the visitor drilled into it from. */
function tabFor(view: View): "course" | "training" | "clicker" | "products" {
  if (view.name === "clicker") return "clicker";
  if (view.name === "products") return "products";
  if (view.name === "training") return "training";
  if (view.name === "lesson") return view.from === "training" ? "training" : "course";
  return "course";
}

export function MemberArea({ dict, preview, account, locale, otherProducts = [] }: Props) {
  const [view, setView] = useState<View>({ name: "courses" });
  const { courses } = dict.member;
  const activeTab = tabFor(view);

  const backTarget: View | null =
    view.name === "lesson"
      ? view.from === "training"
        ? { name: "training" }
        : { name: "lessons", course: view.course }
      : view.name === "lessons"
        ? { name: "courses" }
        : null;

  const openLesson = (course: number, lesson: number, from: "courses" | "training") =>
    setView({ name: "lesson", course, lesson, from });

  return (
    <div className="funnel-shell">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 px-5 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Logo />
          {backTarget && (
            <button
              type="button"
              onClick={() => setView(backTarget)}
              className="text-[14px] font-medium text-violet-600"
            >
              ← {dict.member.backToCourse}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 px-5 pb-24 pt-4">
        {preview && (
          <p className="mb-4 rounded-xl2 bg-violet-50 px-3 py-2 text-center text-[12px] text-violet-700">
            {dict.member.previewNote}
          </p>
        )}

        {view.name === "courses" && (
          <>
            <h1 className="headline text-[24px]">{dict.member.coursesHeadline}</h1>
            <div className="mt-4 space-y-3">
              {courses.map((course, index) => (
                <button
                  key={course.title}
                  type="button"
                  onClick={() => setView({ name: "lessons", course: index })}
                  className="flex w-full items-center gap-3 overflow-hidden rounded-xl2 border border-line bg-surface p-3 text-left shadow-card transition hover:border-violet-300"
                >
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-sun/70 text-[26px]">
                    🐾
                  </span>
                  <span className="min-w-0 flex-1">
                    {index === 0 && (
                      <span className="mb-1 inline-block rounded-pill bg-teal-100 px-2 py-0.5 text-[10px] font-bold uppercase text-teal-600">
                        {dict.member.inProgress}
                      </span>
                    )}
                    <span className="block text-[15px] font-bold text-ink">
                      {course.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">
                      {course.subtitle}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {view.name === "lessons" && (
          <>
            <h1 className="headline text-[22px]">
              {courses[view.course].title}
            </h1>
            <p className="mt-1 text-[14px] text-ink-soft">
              {courses[view.course].subtitle}
            </p>
            <ol className="mt-4 space-y-2">
              {courses[view.course].lessons.map((lesson, index) => (
                <li key={lesson.title}>
                  <button
                    type="button"
                    onClick={() => openLesson(view.course, index, "courses")}
                    className="w-full rounded-xl2 border border-line bg-surface px-4 py-3 text-left shadow-card transition hover:border-violet-300"
                  >
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-violet-600">
                      {dict.member.lessonLabel} {index + 1}
                    </span>
                    <span className="mt-0.5 block text-[15px] font-medium leading-snug text-ink">
                      {lesson.title}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}

        {view.name === "training" && (
          <>
            <h1 className="headline text-[22px]">{dict.member.allLessons}</h1>
            <div className="mt-4 space-y-5">
              {courses.map((course, ci) => (
                <div key={course.title}>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-ink-faint">
                    {course.title}
                  </p>
                  <ol className="mt-2 space-y-2">
                    {course.lessons.map((lesson, li) => (
                      <li key={lesson.title}>
                        <button
                          type="button"
                          onClick={() => openLesson(ci, li, "training")}
                          className="w-full rounded-xl2 border border-line bg-surface px-4 py-3 text-left shadow-card transition hover:border-violet-300"
                        >
                          <span className="block text-[15px] font-medium leading-snug text-ink">
                            {lesson.title}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </>
        )}

        {view.name === "clicker" && <Clicker dict={dict} />}

        {view.name === "products" && (
          <>
            <h1 className="headline text-[22px]">
              {dict.member.otherProductsHeadline}
            </h1>
            {UPSELL_OFFERS.length === 0 ? (
              <p className="mt-4 rounded-xl2 bg-cream px-4 py-3 text-[14px] leading-relaxed text-ink-soft">
                {dict.member.otherProductsEmpty}
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {UPSELL_OFFERS.map((offer) => {
                  const activeLocale = locale ?? DEFAULT_LOCALE;
                  const owned = otherProducts.some(
                    (p) => p.productId === offer.hotmartProductId,
                  );
                  const copy = offer.copy[activeLocale] ?? offer.copy.es;
                  const buyUrl = new URL(`/${activeLocale}`, offer.quizUrl);
                  if (account?.email) buyUrl.searchParams.set("email", account.email);

                  return (
                    <div
                      key={offer.id}
                      className="flex items-center gap-3 overflow-hidden rounded-xl2 border border-line bg-surface p-3 shadow-card"
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-[22px]">
                        🩺
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold text-ink">
                          {offer.productName}
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-ink-soft">
                          {copy.tagline}
                        </span>
                        {!owned && (
                          <span className="mt-0.5 block text-[12px] font-semibold text-action-600">
                            {offer.priceLabel}
                          </span>
                        )}
                      </span>
                      {owned ? (
                        <a
                          href={PET_SAUDAVEL_APP_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 rounded-pill bg-violet-600 px-3.5 py-2 text-[12px] font-bold text-white"
                        >
                          {dict.member.otherProductsCta}
                        </a>
                      ) : (
                        <a
                          href={buyUrl.toString()}
                          className="shrink-0 rounded-pill bg-action-500 px-3.5 py-2 text-[12px] font-bold text-white"
                        >
                          {copy.cta}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {view.name === "lesson" && (
          <article>
            {/* Breadcrumb: which course this lesson belongs to, so drilling in
                from "all lessons" doesn't leave the visitor guessing. */}
            <p className="text-[12px] font-medium text-ink-faint">
              {courses[view.course].title}
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-violet-600">
              {dict.member.lessonLabel} {view.lesson + 1}
            </p>
            <h1 className="headline mt-1 text-[22px]">
              {courses[view.course].lessons[view.lesson].title}
            </h1>

            {courses[view.course].lessons[view.lesson].body && (
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                {courses[view.course].lessons[view.lesson].body}
              </p>
            )}

            <p className="mt-5 text-[15px] font-semibold text-violet-600">
              {dict.member.stepLabel} 1.
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
              {dict.member.stepPlaceholder}
            </p>

            <div className="mt-5">
              <VideoSlot
                label={dict.videoPlaceholder.label}
                hint={dict.videoPlaceholder.hint}
                ratio="4 / 3"
                id={`lesson-${view.course + 1}-${view.lesson + 1}`}
              />
            </div>
          </article>
        )}
      </main>

      {account && locale && (
        <div className="border-t border-line bg-cream px-5 py-3 text-center">
          <p className="text-[12px] text-ink-faint">{account.email}</p>
          <SignOutButton label={account.signOut} locale={locale} />
        </div>
      )}

      <nav className="sticky bottom-0 z-30 flex border-t border-line bg-surface">
        {(
          [
            ["course", dict.member.tabs.course, { name: "courses" } as const],
            ["training", dict.member.tabs.training, { name: "training" } as const],
            ["clicker", dict.member.tabs.clicker, { name: "clicker" } as const],
            ["products", dict.member.tabs.products, { name: "products" } as const],
          ] as const
        ).map(([key, label, target]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(target)}
            aria-current={activeTab === key ? "page" : undefined}
            className={`flex-1 py-3 text-[12px] font-medium transition ${
              activeTab === key ? "text-violet-600" : "text-ink-faint"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

/** A real clicker: a short percussive tone via Web Audio, no audio file to
 *  ship. Matches the reference app's "whistle" tab instead of leaving it a
 *  dead tap target. */
function Clicker({ dict }: { dict: Dict }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const [pressed, setPressed] = useState(false);

  const click = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = ctxRef.current ?? new AudioCtx();
      ctxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(2200, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // No Web Audio support: the button still gives visual feedback below.
    }

    setPressed(true);
    window.setTimeout(() => setPressed(false), 120);
  };

  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <h1 className="headline text-[22px]">{dict.member.clickerTitle}</h1>
      <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-ink-soft">
        {dict.member.clickerBody}
      </p>

      <button
        type="button"
        onClick={click}
        className={`mt-10 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-action-400 to-action-600 text-[16px] font-bold text-white shadow-pop transition ${
          pressed ? "scale-95" : "active:scale-95"
        }`}
      >
        {dict.member.clickerButton}
      </button>

      <p className="mt-6 text-[12px] text-ink-faint">{dict.member.clickerHint}</p>
    </div>
  );
}
