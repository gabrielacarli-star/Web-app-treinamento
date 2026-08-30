"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { VideoSlot } from "@/components/Slots";
import type { Dict } from "@/content";
import type { Locale } from "@/lib/types";
import { SignOutButton } from "./SignOutButton";

type View =
  | { name: "courses" }
  | { name: "lessons"; course: number }
  | { name: "lesson"; course: number; lesson: number };

type Props = {
  dict: Dict;
  /** Shown before auth is configured: the area is open and says so. */
  preview?: boolean;
  account?: { email: string; signOut: string };
  locale?: Locale;
};

export function MemberArea({ dict, preview, account, locale }: Props) {
  const [view, setView] = useState<View>({ name: "courses" });
  const { courses } = dict.member;

  return (
    <div className="funnel-shell">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 px-5 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Logo />
          {view.name !== "courses" && (
            <button
              type="button"
              onClick={() =>
                setView(
                  view.name === "lesson"
                    ? { name: "lessons", course: view.course }
                    : { name: "courses" },
                )
              }
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
                    onClick={() =>
                      setView({ name: "lesson", course: view.course, lesson: index })
                    }
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

        {view.name === "lesson" && (
          <article>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600">
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
        {[dict.member.tabs.course, dict.member.tabs.training, dict.member.tabs.clicker].map(
          (tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setView({ name: "courses" })}
              className={`flex-1 py-3 text-[12px] font-medium ${
                index === 0 ? "text-violet-600" : "text-ink-faint"
              }`}
            >
              {tab}
            </button>
          ),
        )}
      </nav>
    </div>
  );
}
