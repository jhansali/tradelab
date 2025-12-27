import Link from "next/link";

async function getHealthStatus(): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  try {
    const response = await fetch(`${baseUrl}/health`, { cache: "no-store" });
    if (!response.ok) {
      return "unreachable";
    }
    const data = await response.json();
    return data.status ?? "unknown";
  } catch (error) {
    console.error("Health check failed", error);
    return "unreachable";
  }
}

export default async function Home() {
  const healthStatus = await getHealthStatus();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-24">
        <section className="grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-cyan-400">TradeLab</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Build, test, and launch trading ideas faster.
            </h1>
            <p className="text-lg text-slate-300">
              A modern toolkit combining research, execution, and monitoring into a single workflow.
            </p>
            <div className="flex gap-4">
              <Link
                href="/signup"
                className="rounded-md bg-cyan-500 px-5 py-3 font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:translate-y-0.5 hover:bg-cyan-400"
              >
                Get started
              </Link>
              <Link
                href="/signin"
                className="rounded-md border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200"
              >
                Sign in
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-400" />
              <span>API health: {healthStatus}</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.12),transparent_40%),radial-gradient(circle_at_80%_0,rgba(16,185,129,0.12),transparent_35%)]" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.2em] text-slate-500">Dashboard</span>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Live</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 text-slate-200">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs text-slate-500">Throughput</p>
                  <p className="mt-2 text-2xl font-semibold">142ms</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs text-slate-500">Signals</p>
                  <p className="mt-2 text-2xl font-semibold">27</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs text-slate-500">Win Rate</p>
                  <p className="mt-2 text-2xl font-semibold">63%</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 text-sm leading-relaxed text-slate-200">
                Orchestrate your strategy from research to live trading with audit-ready execution logs.
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Why traders choose TradeLab</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {["Async FastAPI backend", "Next.js experience", "Production ready ops"].map((title, index) => (
              <div
                key={title}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20"
              >
                <h3 className="text-lg font-semibold text-cyan-100">{title}</h3>
                <p className="mt-3 text-sm text-slate-300">
                  {[
                    "Scale-ready API with async SQLAlchemy, Alembic migrations, and Postgres.",
                    "Modern app router UI with Tailwind styling and fast DX.",
                    "Docker-first setup with health checks and easy local orchestration.",
                  ][index]}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", title: "Connect", body: "Run docker compose to bring up API, UI, and Postgres." },
              { step: "2", title: "Create", body: "Design strategies, backtest, and set risk controls." },
              { step: "3", title: "Ship", body: "Deploy and monitor live trades with instant insights." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-200 font-semibold">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: "Is the API really ready to run?",
                a: "Yes. Environment variables are baked in and migrations run on startup.",
              },
              {
                q: "Can I point this at my cloud Postgres?",
                a: "Update DATABASE_URL and rebuild. The async engine and Alembic will follow.",
              },
              {
                q: "How do I start building UI?",
                a: "Use the App Router with Tailwind components. Extend the landing page or add routes under /app.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <p className="font-semibold text-cyan-100">{item.q}</p>
                <p className="mt-2 text-sm text-slate-300">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <span>TradeLab • Ship ideas confidently.</span>
          <div className="flex gap-4">
            <Link href="/signin" className="hover:text-cyan-200">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-cyan-200">
              Create account
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
