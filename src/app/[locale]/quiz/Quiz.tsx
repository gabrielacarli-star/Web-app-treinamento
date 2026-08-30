"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { Cta, CtaDock } from "@/components/Cta";
import { OptionCard } from "@/components/OptionCard";
import { Art } from "@/components/Art";
import { fill, type Dict } from "@/content";
import { emojiFor, visibleSteps } from "@/lib/quiz";
import { useFunnel } from "@/lib/store";
import type { Locale, QuizStep } from "@/lib/types";

const NONE = "__none__";

export function Quiz({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const { answers, setAnswer } = useFunnel();
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [breedQuery, setBreedQuery] = useState("");

  const steps = useMemo(() => visibleSteps(answers), [answers]);
  const step: QuizStep | undefined = steps[index];

  const vars = {
    dog: (answers.dog_name as string) || dict.common.yourDog,
    breed: (answers.dog_breed as string) || "",
  };

  const goNext = () => {
    // `steps` is recomputed from the answers, so conditional steps appear or
    // disappear as soon as the answer that gates them changes.
    const next = visibleSteps(answers);
    if (index + 1 >= next.length) {
      router.push(`/${locale}/prediction`);
      return;
    }
    setDraft("");
    setBreedQuery("");
    setIndex((current) => current + 1);
  };

  const goBack = () => {
    if (index === 0) {
      router.push(`/${locale}`);
      return;
    }
    setDraft("");
    setBreedQuery("");
    setIndex((current) => current - 1);
  };

  if (!step) return null;

  const copy = dict.steps[step.id] ?? {};
  const question = copy.question ? fill(copy.question, vars) : "";
  const eyebrow = step.section ? dict.sections[step.section] : undefined;
  const selected = answers[step.id];
  const selectedList = Array.isArray(selected) ? selected : [];

  const toggleMulti = (optionId: string) => {
    if (optionId === NONE) {
      setAnswer(step.id, [NONE]);
      return;
    }
    const withoutNone = selectedList.filter((item) => item !== NONE);
    setAnswer(
      step.id,
      withoutNone.includes(optionId)
        ? withoutNone.filter((item) => item !== optionId)
        : [...withoutNone, optionId],
    );
  };

  const chooseSingle = (optionId: string) => {
    setAnswer(step.id, optionId);
    // Single-choice steps advance on tap, the way the reference funnel does.
    window.setTimeout(goNext, 140);
  };

  return (
    <Shell
      progress={(index + 1) / steps.length}
      eyebrow={eyebrow}
      onBack={goBack}
    >
      {step.type === "interstitial" ? (
        <div className="flex flex-1 flex-col">
          <h2 className="headline mt-4 text-center">
            {fill(copy.headline ?? "", vars)}
          </h2>
          {copy.body && (
            <p className="mt-3 text-center text-[15px] leading-relaxed text-ink-soft">
              {fill(copy.body, vars)}
            </p>
          )}
          <div className="my-6">
            <Art id={`quiz-${step.id}`} />
          </div>
          <CtaDock>
            <Cta onClick={goNext}>{dict.common.continue}</Cta>
          </CtaDock>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <h2 className="headline mt-3 text-center text-[22px]">{question}</h2>
          {copy.body && (
            <p className="mt-3 rounded-xl2 bg-cream px-4 py-3 text-center text-[15px] italic leading-relaxed text-ink">
              {fill(copy.body, vars)}
            </p>
          )}
          {copy.hint && (
            <p className="mt-2 text-center text-[13px] text-ink-faint">
              {copy.hint}
            </p>
          )}

          <div className="mt-5 space-y-2.5">
            {step.type === "single" &&
              step.options?.map((optionId, index) => (
                <OptionCard
                  key={optionId}
                  tone={index}
                  emoji={emojiFor(step.id, optionId)}
                  label={fill(copy.options?.[optionId] ?? optionId, vars)}
                  selected={selected === optionId}
                  onClick={() => chooseSingle(optionId)}
                />
              ))}

            {step.type === "multi" && (
              <>
                {step.options?.map((optionId, index) => (
                  <OptionCard
                    key={optionId}
                    tone={index}
                    multi
                    emoji={emojiFor(step.id, optionId)}
                    label={fill(copy.options?.[optionId] ?? optionId, vars)}
                    selected={selectedList.includes(optionId)}
                    onClick={() => toggleMulti(optionId)}
                  />
                ))}
                {step.hasNone && (
                  <OptionCard
                    multi
                    label={dict.common.none}
                    selected={selectedList.includes(NONE)}
                    onClick={() => toggleMulti(NONE)}
                  />
                )}
              </>
            )}

            {step.type === "text" && (
              <input
                autoFocus
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={copy.placeholder}
                className="w-full rounded-xl2 border border-line bg-surface px-4 py-4 text-[16px] text-ink outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
              />
            )}

            {step.type === "breed" && (
              <>
                <input
                  value={breedQuery}
                  onChange={(event) => setBreedQuery(event.target.value)}
                  placeholder={dict.breeds.search}
                  className="w-full rounded-xl2 border border-line bg-surface px-4 py-4 text-[16px] text-ink outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                />
                <p className="pt-2 text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
                  {dict.breeds.common}
                </p>
                {dict.breeds.list
                  .filter((breed) =>
                    breed.toLowerCase().includes(breedQuery.trim().toLowerCase()),
                  )
                  .slice(0, breedQuery ? 12 : 5)
                  .map((breed) => (
                    <OptionCard
                      key={breed}
                      label={breed}
                      selected={selected === breed}
                      onClick={() => {
                        setAnswer(step.id, breed);
                        window.setTimeout(goNext, 140);
                      }}
                    />
                  ))}
              </>
            )}

            {step.type === "scale" && (
              <div className="pt-2">
                <div className="flex items-center justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAnswer(step.id, String(value))}
                      aria-label={String(value)}
                      className={`h-14 flex-1 rounded-xl2 border-2 text-[16px] font-bold transition ${
                        selected === String(value)
                          ? "animate-pop border-violet-600 bg-violet-500 text-white shadow-[0_6px_20px_rgba(124,45,255,0.42)]"
                          : "border-line bg-surface text-ink-soft hover:border-violet-300 hover:bg-violet-50"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[12px] text-ink-faint">
                  <span>{copy.minLabel}</span>
                  <span>{copy.maxLabel}</span>
                </div>
              </div>
            )}

            {step.type === "date" && (
              <>
                <input
                  type="date"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="w-full rounded-xl2 border border-line bg-surface px-4 py-4 text-[16px] text-ink outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                />
                <OptionCard
                  emoji={emojiFor(step.id, "already")}
                  label={copy.options?.already ?? ""}
                  selected={selected === "already"}
                  onClick={() => {
                    setAnswer(step.id, "already");
                    window.setTimeout(goNext, 140);
                  }}
                />
              </>
            )}
          </div>

          <CtaDock>
            {step.type === "multi" && (
              <Cta disabled={selectedList.length === 0} onClick={goNext}>
                {dict.common.continue}
              </Cta>
            )}
            {step.type === "scale" && (
              <Cta disabled={!selected} onClick={goNext}>
                {dict.common.continue}
              </Cta>
            )}
            {step.type === "text" && (
              <>
                <Cta
                  disabled={!draft.trim()}
                  onClick={() => {
                    setAnswer(step.id, draft.trim());
                    goNext();
                  }}
                >
                  {dict.common.continue}
                </Cta>
                <button type="button" className="cta-ghost" onClick={goNext}>
                  {copy.skip}
                </button>
              </>
            )}
            {step.type === "breed" && (
              <button
                type="button"
                className="cta-ghost"
                onClick={() => {
                  setAnswer(step.id, dict.breeds.list[0]);
                  goNext();
                }}
              >
                {dict.breeds.unknown}
              </button>
            )}
            {step.type === "date" && (
              <>
                <Cta
                  disabled={!draft}
                  onClick={() => {
                    setAnswer(step.id, draft);
                    goNext();
                  }}
                >
                  {dict.common.continue}
                </Cta>
                <button type="button" className="cta-ghost" onClick={goNext}>
                  {copy.skip}
                </button>
              </>
            )}
          </CtaDock>
        </div>
      )}
    </Shell>
  );
}
