import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic route — reports only presence/shape of the env vars
 * the tracking and admin-client code depend on, never their values. Remove
 * once the "quiz_leads stays empty" issue is confirmed fixed.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: {
      present: !!url,
      length: url?.length ?? 0,
      startsWithHttps: url?.startsWith("https://") ?? false,
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      present: !!anonKey,
      length: anonKey?.length ?? 0,
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      present: !!serviceKey,
      length: serviceKey?.length ?? 0,
      segments: serviceKey?.split(".").length ?? 0,
    },
    vercelEnv: process.env.VERCEL_ENV ?? null,
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
  });
}
