"use client";

import { useEffect, useState } from "react";

/**
 * Internal spend x revenue x ROAS panel. This app has no admin auth of its
 * own, so access is a shared password (ADMIN_SECRET) kept in
 * sessionStorage -- never share this link with anyone but whoever should
 * see revenue.
 */

const SECRET_KEY = "trafego:admin-secret";

type SummaryRow = {
  campaignId: string;
  campaignName: string | null;
  date: string;
  spendCents: number;
  impressions: number;
  clicks: number;
  revenueCents: number;
  refundedCents: number;
  orders: number;
  profitCents: number;
  roas: number | null;
};

type Summary = {
  since: string;
  rows: SummaryRow[];
  totals: {
    spendCents: number;
    revenueCents: number;
    refundedCents: number;
    orders: number;
    profitCents: number;
    roas: number | null;
  };
};

const money = (cents: number, currency = "USD") =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency });

export default function TrafegoPage() {
  const [secret, setSecret] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [days, setDays] = useState(14);
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(SECRET_KEY);
    if (stored) setSecret(stored);
  }, []);

  useEffect(() => {
    if (!secret) return;
    setLoading(true);
    setError(null);
    fetch(`/api/metrics/summary?days=${days}`, { headers: { "x-admin-secret": secret } })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) window.sessionStorage.removeItem(SECRET_KEY);
          throw new Error((await res.json().catch(() => null))?.error || `HTTP ${res.status}`);
        }
        return res.json() as Promise<Summary>;
      })
      .then(setData)
      .catch((e) => {
        setError(e.message);
        if (String(e.message).includes("unauthorized")) setSecret(null);
      })
      .finally(() => setLoading(false));
  }, [secret, days]);

  if (!secret) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <form
          className="w-full max-w-sm space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            window.sessionStorage.setItem(SECRET_KEY, input);
            setSecret(input);
          }}
        >
          <h1 className="text-lg font-semibold">Painel de tráfego</h1>
          <input
            type="password"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Senha"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Gasto × Receita × ROAS</h1>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value={7}>7 dias</option>
            <option value={14}>14 dias</option>
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="text-sm text-gray-500">Carregando…</p>}

        {data && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Gasto" value={money(data.totals.spendCents)} />
              <Stat label="Receita" value={money(data.totals.revenueCents)} />
              <Stat label="Lucro" value={money(data.totals.profitCents)} />
              <Stat label="ROAS" value={data.totals.roas ? `${data.totals.roas.toFixed(2)}x` : "—"} />
            </div>

            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">Campanha</th>
                    <th className="px-3 py-2 text-right">Gasto</th>
                    <th className="px-3 py-2 text-right">Pedidos</th>
                    <th className="px-3 py-2 text-right">Receita</th>
                    <th className="px-3 py-2 text-right">Lucro</th>
                    <th className="px-3 py-2 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((r) => (
                    <tr key={`${r.campaignId}|${r.date}`} className="border-t border-gray-200">
                      <td className="px-3 py-2">{r.date}</td>
                      <td className="px-3 py-2">
                        {r.campaignName || (r.campaignId === "none" ? "Sem atribuição" : r.campaignId)}
                      </td>
                      <td className="px-3 py-2 text-right">{money(r.spendCents)}</td>
                      <td className="px-3 py-2 text-right">{r.orders}</td>
                      <td className="px-3 py-2 text-right">{money(r.revenueCents)}</td>
                      <td className="px-3 py-2 text-right">{money(r.profitCents)}</td>
                      <td className="px-3 py-2 text-right">{r.roas ? `${r.roas.toFixed(2)}x` : "—"}</td>
                    </tr>
                  ))}
                  {data.rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                        Sem dados no período.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500">
              &quot;Sem atribuição&quot; agrupa gasto sem venda casada, ou vendas sem campaign_id (venda
              anterior a esta atualização, orgânica, ou sem o formato nome|id no anúncio). Ver README.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-md border border-gray-200 px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
