import type { ReactElement } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export const LandingPage = (): ReactElement => {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'kanban' | 'cicd' | 'chat' | 'analytics'>('kanban');

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-500/10 blur-[140px]" />
        <div className="absolute top-[35%] -left-40 h-[450px] w-[600px] rounded-full bg-accent-indigo/10 blur-[150px]" />
        <div className="absolute top-[65%] -right-40 h-[450px] w-[600px] rounded-full bg-accent-purple/10 blur-[150px]" />
      </div>

      {/* Top Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-surface-800/80 bg-[#090D16]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/30">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">Dev<span className="text-brand-400">Flow</span></span>
              <span className="ml-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-300">
                Enterprise 3.0
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="transition hover:text-brand-400">Features</a>
            <a href="#preview" className="transition hover:text-brand-400">Live Demo</a>
            <a href="#architecture" className="transition hover:text-brand-400">Architecture</a>
            <a href="#security" className="transition hover:text-brand-400">Security & RBAC</a>
            <a href="#metrics" className="transition hover:text-brand-400">Performance</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/organizations" className="button">
                <span>Go to Workspace</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <>
                <Link to="/login" className="button-secondary text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="button text-sm">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            <span>Unified Engineering Intelligence & Delivery Ecosystem</span>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
            Orchestrate Engineering Velocity with <span className="gradient-text">Industrial Precision</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400 sm:text-xl leading-relaxed">
            The next-generation platform for high-velocity software engineering organizations.
            Unify agile sprint orchestration, real-time WebSocket collaboration, multi-tenant RBAC, and automated CI/CD pipeline observability.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to={user ? "/organizations" : "/register"} className="button px-8 py-3.5 text-base shadow-xl shadow-brand-500/25">
              <span>{user ? "Open Active Workspace" : "Launch Enterprise Workspace"}</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a href="#preview" className="button-secondary px-6 py-3.5 text-base">
              <svg className="h-5 w-5 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Explore Interactive Live Demo</span>
            </a>
          </div>

          {/* Enterprise Metric Counters */}
          <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-surface-800 bg-[#0E1522]/80 p-6 backdrop-blur-md sm:grid-cols-4 lg:gap-8">
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">99.99%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Guaranteed SLA</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-brand-400 tracking-tight sm:text-4xl">&lt;10ms</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">WebSocket Latency</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-accent-emerald tracking-tight sm:text-4xl">SOC2</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Type II Certified</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-accent-indigo tracking-tight sm:text-4xl">10x</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Deployment Velocity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Product Showcase */}
      <section id="preview" className="relative px-6 py-16 lg:py-24 border-t border-surface-800/80 bg-[#080D17]/90">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="badge-cyan">INTERACTIVE TELEMETRY DEMO</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Experience the DevFlow Engine
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400 text-sm sm:text-base">
              Switch between workspaces to preview real-time sprint execution, CI/CD observability, team chat, and velocity analytics.
            </p>
          </div>

          {/* Demo Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 border-b border-surface-800 pb-4">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === 'kanban'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-800/50'
              }`}
            >
              <span>📋</span> Agile Kanban & Sprints
            </button>
            <button
              onClick={() => setActiveTab('cicd')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === 'cicd'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-800/50'
              }`}
            >
              <span>🔄</span> CI/CD & GitHub Telemetry
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === 'chat'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-800/50'
              }`}
            >
              <span>⚡</span> Real-Time WebSocket Chat
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === 'analytics'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-800/50'
              }`}
            >
              <span>📊</span> Velocity & Burndown
            </button>
          </div>

          {/* Interactive Showcase Frame */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-surface-700 bg-[#0E1522] shadow-2xl shadow-black/80">
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-surface-800 bg-[#0A0F1A] px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-xs text-slate-400">devflow://workspace/enterprise-core/sprint-42</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync (Socket Connected)
                </span>
              </div>
            </div>

            {/* Tab 1: Kanban Showcase */}
            {activeTab === 'kanban' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Column 1: TODO */}
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B]/60 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-surface-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">To Do</span>
                      <span className="rounded-full bg-surface-800 px-2 py-0.5 text-xs font-mono text-slate-400">3</span>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-lg border border-surface-700/80 bg-[#16233B] p-3 shadow-md">
                        <span className="badge-amber text-[10px]">URGENT</span>
                        <p className="mt-2 text-sm font-semibold text-white">Implement OAuth 2.0 PKCE Flow</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>CORE-104</span>
                          <span className="rounded bg-brand-500/20 px-1.5 text-brand-300 font-semibold">5 pts</span>
                        </div>
                      </div>
                      <div className="rounded-lg border border-surface-700/80 bg-[#16233B] p-3 shadow-md">
                        <span className="badge-cyan text-[10px]">FEATURE</span>
                        <p className="mt-2 text-sm font-semibold text-white">Redis Cluster failover retry hook</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>CORE-108</span>
                          <span className="rounded bg-brand-500/20 px-1.5 text-brand-300 font-semibold">3 pts</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: IN PROGRESS */}
                  <div className="rounded-xl border border-brand-500/30 bg-[#121B2B]/90 p-4 shadow-lg shadow-brand-500/5">
                    <div className="flex items-center justify-between pb-3 border-b border-surface-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-400">In Progress</span>
                      <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs font-mono text-brand-300">2</span>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-lg border border-brand-500/50 bg-[#182640] p-3 shadow-md">
                        <span className="badge-rose text-[10px]">HIGH PRIORITY</span>
                        <p className="mt-2 text-sm font-semibold text-white">Global Command-K Multi-entity Search</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>FE-89</span>
                          <span className="rounded bg-brand-500/20 px-1.5 text-brand-300 font-semibold">8 pts</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: IN REVIEW */}
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B]/60 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-surface-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent-purple">In Review</span>
                      <span className="rounded-full bg-surface-800 px-2 py-0.5 text-xs font-mono text-slate-400">2</span>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-lg border border-surface-700/80 bg-[#16233B] p-3 shadow-md">
                        <span className="badge-emerald text-[10px]">PULL REQUEST</span>
                        <p className="mt-2 text-sm font-semibold text-white">Mongoose multi-tenant isolation schema</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>PR #412</span>
                          <span className="text-accent-emerald font-semibold">Approved</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 4: DONE */}
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B]/60 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-surface-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent-emerald">Done</span>
                      <span className="rounded-full bg-surface-800 px-2 py-0.5 text-xs font-mono text-slate-400">6</span>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-lg border border-surface-750 bg-[#142034] p-3 opacity-80">
                        <span className="badge-slate text-[10px]">COMPLETED</span>
                        <p className="mt-2 text-sm font-medium text-slate-300 line-through">Setup Vitest in-memory MongoDB suite</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
                          <span>CORE-99</span>
                          <span className="text-emerald-400">✓ 19/19 Pass</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: CI/CD Showcase */}
            {activeTab === 'cicd' && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-4">
                    <span className="text-xs font-semibold text-slate-400">Latest Build</span>
                    <p className="mt-2 text-lg font-bold text-emerald-400 flex items-center gap-2">
                      <span>✓</span> BUILD #1094 SUCCESS
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-1">commit 9fa81c · main branch</p>
                  </div>
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-4">
                    <span className="text-xs font-semibold text-slate-400">Test Execution</span>
                    <p className="mt-2 text-lg font-bold text-emerald-400 flex items-center gap-2">
                      <span>✓</span> 22/22 SUITES PASSED
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-1">100% tenant isolation verify</p>
                  </div>
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-4">
                    <span className="text-xs font-semibold text-slate-400">Kubernetes Deploy</span>
                    <p className="mt-2 text-lg font-bold text-brand-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" /> LIVE PRODUCTION
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-1">cluster us-east-prod-1</p>
                  </div>
                </div>

                <div className="rounded-xl border border-surface-800 bg-[#090E18] p-4 font-mono text-xs text-slate-300 space-y-1.5">
                  <div className="text-slate-500">// Pipeline: .github/workflows/deploy-production.yml</div>
                  <div className="text-emerald-400">[07:25:31] ✓ Step 1: Install dependencies with npm ci (8.2s)</div>
                  <div className="text-emerald-400">[07:25:39] ✓ Step 2: Run TypeScript static analysis across client/server (4.1s)</div>
                  <div className="text-emerald-400">[07:25:43] ✓ Step 3: Execute Vitest security & RBAC isolation matrix (5.4s)</div>
                  <div className="text-brand-300">[07:25:49] ⚡ Step 4: Containerize Docker multi-stage artifact to ECR</div>
                  <div className="text-emerald-400">[07:25:54] ✓ Step 5: Rolling deployment to prod cluster with 0 downtime</div>
                </div>
              </div>
            )}

            {/* Tab 3: Chat Showcase */}
            {activeTab === 'chat' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-surface-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white">#core-infrastructure</span>
                    <span className="badge-cyan text-[10px]">LIVE CHANNEL</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>8 Engineers Active</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-accent-indigo grid place-items-center text-xs font-bold text-white">
                      AK
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Alex Chen</span>
                        <span className="text-[10px] text-slate-500 font-mono">10:42 AM</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300">
                        Pushed the new Redis pub/sub socket broadcaster. Notifications and task moves now sync across all connected clients in &lt;10ms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent-purple to-accent-rose grid place-items-center text-xs font-bold text-white">
                      SM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Sarah Miller</span>
                        <span className="text-[10px] text-slate-500 font-mono">10:44 AM</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300">
                        Verified the multi-tenant isolation unit tests. All 19 suites in server and 3 in client pass cleanly with zero leaks! 🚀
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 rounded-xl border border-surface-700 bg-[#0A0F1A] px-4 py-2.5">
                    <input
                      readOnly
                      value="Replying to sprint team with release changelog..."
                      className="w-full bg-transparent text-xs text-slate-400 outline-none"
                    />
                    <button className="button py-1 px-3 text-xs">Send</button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Analytics Showcase */}
            {activeTab === 'analytics' && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-3">
                    <span className="text-xs text-slate-400 font-medium">Sprint Velocity</span>
                    <p className="mt-1 text-2xl font-bold text-brand-400">48 pts</p>
                    <span className="text-[10px] text-emerald-400">+14% vs avg</span>
                  </div>
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-3">
                    <span className="text-xs text-slate-400 font-medium">Cycle Time</span>
                    <p className="mt-1 text-2xl font-bold text-white">1.8 days</p>
                    <span className="text-[10px] text-emerald-400">-32% reduction</span>
                  </div>
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-3">
                    <span className="text-xs text-slate-400 font-medium">PR Review Latency</span>
                    <p className="mt-1 text-2xl font-bold text-accent-purple">42 min</p>
                    <span className="text-[10px] text-slate-400">Automated alerts</span>
                  </div>
                  <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-3">
                    <span className="text-xs text-slate-400 font-medium">Sprint Completion</span>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">92.4%</p>
                    <span className="text-[10px] text-emerald-400">Ahead of target</span>
                  </div>
                </div>

                <div className="rounded-xl border border-surface-800 bg-[#0D1420] p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-800 text-xs">
                    <span className="font-semibold text-slate-300">Sprint 42 Burndown Telemetry</span>
                    <span className="font-mono text-slate-400">Ideal vs Actual (Story Points)</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between h-28 px-2 gap-3">
                    {[50, 44, 38, 30, 22, 14, 6, 0].map((points, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1.5">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-500"
                          style={{ height: `${(points / 50) * 100}%` }}
                        />
                        <span className="text-[10px] text-slate-500 font-mono">Day {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6 Core Enterprise Pillars */}
      <section id="features" className="relative px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="badge-cyan">ENTERPRISE CAPABILITIES</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Engineered for Industrial Scale
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-base">
              Everything your engineering team needs to plan, build, observe, and ship enterprise software with zero friction.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card group relative overflow-hidden rounded-2xl p-8 border border-surface-800 hover:border-brand-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Multi-Tenant Tenant Isolation</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Cryptographically isolated workspaces and role-based permissions (ADMIN, MEMBER, VIEWER) ensure zero data crossover between organizations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card group relative overflow-hidden rounded-2xl p-8 border border-surface-800 hover:border-brand-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple border border-accent-purple/20 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Real-Time WebSocket Engine</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Sub-millisecond socket broadcasting for live task movements, presence indicators, real-time team chat, and instant push alerts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card group relative overflow-hidden rounded-2xl p-8 border border-surface-800 hover:border-brand-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Predictive Velocity & Burndown</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Automated burndown calculation, sprint velocity forecasting, and developer workload distribution charts powered by Recharts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card group relative overflow-hidden rounded-2xl p-8 border border-surface-800 hover:border-brand-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">CI/CD & GitHub Telemetry</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Connect GitHub repositories to track live workflow runs, pull request health, build success ratios, and commit telemetry inside project views.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card group relative overflow-hidden rounded-2xl p-8 border border-surface-800 hover:border-brand-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-amber/10 text-accent-amber border border-accent-amber/20 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Global Command Palette (Ctrl+K)</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Universal keyboard-first search index across projects, tasks, issues, sprints, team members, and file attachments in milliseconds.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card group relative overflow-hidden rounded-2xl p-8 border border-surface-800 hover:border-brand-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-rose/10 text-accent-rose border border-accent-rose/20 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Zero-Trust JWT & Session Guard</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Short-lived access tokens with automatic silent refresh rotation, strict HTTP-only cookies, and tamper-resistant security middleware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Tech Architecture Section */}
      <section id="architecture" className="relative px-6 py-20 border-t border-surface-800 bg-[#080D17]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="badge-cyan">ARCHITECTURE BLUEPRINT</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Built on Resilient Modern Infrastructure</h2>
            <p className="mt-2 text-sm text-slate-400">High-throughput microservices engineered for zero downtime.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="rounded-xl border border-surface-800 bg-[#0E1522] p-5">
              <div className="text-2xl font-bold text-brand-400 font-mono">React 19 + Vite</div>
              <p className="mt-2 text-xs text-slate-400">High-performance SPA with TanStack Query and Zustand atomic state stores.</p>
            </div>
            <div className="rounded-xl border border-surface-800 bg-[#0E1522] p-5">
              <div className="text-2xl font-bold text-emerald-400 font-mono">Express 5 + TS</div>
              <p className="mt-2 text-xs text-slate-400">Type-safe REST controllers with Zod schema validation & RBAC guards.</p>
            </div>
            <div className="rounded-xl border border-surface-800 bg-[#0E1522] p-5">
              <div className="text-2xl font-bold text-rose-400 font-mono">Redis Pub/Sub</div>
              <p className="mt-2 text-xs text-slate-400">Real-time socket clustering, rate limiting, and ephemeral presence.</p>
            </div>
            <div className="rounded-xl border border-surface-800 bg-[#0E1522] p-5">
              <div className="text-2xl font-bold text-accent-purple font-mono">MongoDB Atlas</div>
              <p className="mt-2 text-xs text-slate-400">Tenant-isolated multi-collection schemas with indexed geospatial queries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative px-6 py-20 lg:py-28 overflow-hidden">
        <div className="mx-auto max-w-5xl rounded-3xl border border-brand-500/30 bg-gradient-to-br from-[#101C30] to-[#0A101C] p-10 text-center shadow-2xl sm:p-16 relative">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative z-10">
            <span className="badge-cyan">INSTANT WORKSPACE ACTIVATION</span>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
              Elevate Your Team's Shipping Velocity Today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300 text-base">
              Join thousands of engineering teams that coordinate sprints, automate CI/CD observability, and collaborate in real-time.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to={user ? "/organizations" : "/register"} className="button px-8 py-3.5 text-base shadow-xl">
                {user ? "Open Active Workspace" : "Get Started Free"}
              </Link>
              <Link to="/login" className="button-secondary px-8 py-3.5 text-base">
                Sign In to Existing Org
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Footer */}
      <footer className="border-t border-surface-800 bg-[#060910] px-6 py-12 text-slate-500 text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-xs">
              DF
            </div>
            <span className="font-bold text-slate-300 text-sm">DevFlow Enterprise</span>
            <span className="text-slate-600">|</span>
            <span>© 2026 DevFlow Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> All Systems Operational
            </span>
            <Link to="/login" className="hover:text-slate-300">Login</Link>
            <Link to="/register" className="hover:text-slate-300">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
