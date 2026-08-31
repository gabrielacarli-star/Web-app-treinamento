import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_LOCALE } from "@/lib/config";

/**
 * Verifies the token_hash from an admin-generated invite/recovery link
 * server-side and writes the resulting session to cookies — unlike the
 * link's own action_link (Supabase's hosted /verify endpoint), which
 * redirects with the session in the URL's hash fragment instead. A
 * fragment never reaches any server, so a link built around it can only be
 * picked up by client-side JS; verifyOtp here gives every other server
 * component (the reset-password page included) a normal cookie session
 * from the moment this redirect lands, no client detection needed.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  const target = next && next.startsWith("/") ? next : `/${DEFAULT_LOCALE}/app`;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${target}`);
  }

  return NextResponse.redirect(`${origin}/${DEFAULT_LOCALE}/login?error=auth`);
}
