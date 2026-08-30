import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_LOCALE } from "@/lib/config";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  // Only ever redirect within this app — an attacker-supplied absolute URL
  // here would turn the login link into an open redirect.
  const target = next && next.startsWith("/") ? next : `/${DEFAULT_LOCALE}/app`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${target}`);
  }

  return NextResponse.redirect(`${origin}/${DEFAULT_LOCALE}/login?error=auth`);
}
