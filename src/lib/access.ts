import { createClient } from "./supabase/server";

export type Access = {
  email: string | null;
  signedIn: boolean;
  active: boolean;
  plan: string | null;
};

/**
 * A visitor reaches the member area only with both a session and a purchase
 * that is still active. RLS limits the query to the signed-in user's own rows,
 * so this cannot read anyone else's purchases even if it tried.
 */
export async function getAccess(): Promise<Access> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { email: null, signedIn: false, active: false, plan: null };
  }

  const { data } = await supabase
    .from("purchases")
    .select("plan, expires_at")
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("purchased_at", { ascending: false })
    .limit(1);

  const purchase = data?.[0];
  return {
    email: user.email,
    signedIn: true,
    active: Boolean(purchase),
    plan: purchase?.plan ?? null,
  };
}
