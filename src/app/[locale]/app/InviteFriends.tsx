"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/config";
import { fill } from "@/content";
import type { Dict } from "@/content";
import type { Locale } from "@/lib/types";

/**
 * Pure sharing, no reward on either side (for now — see UPSELL_OFFERS for
 * the pattern to follow if a discount or credit gets added later). Web
 * Share API on mobile where it exists; clipboard copy as the fallback
 * everywhere else, since there is no share sheet to hand off to on desktop.
 */
export function InviteFriends({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [copied, setCopied] = useState(false);

  const url = `${SITE_URL}/${locale}`;
  const message = fill(dict.member.inviteMessage, { url });

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: message, url });
      } catch {
        // User cancelled the share sheet — not an error worth surfacing.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — nothing more to fall back to here.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="mb-2 w-full rounded-pill border-2 border-violet-500 px-4 py-2.5 text-center text-[13px] font-bold text-violet-600"
    >
      {copied ? dict.member.inviteCopied : dict.member.inviteCta}
    </button>
  );
}
