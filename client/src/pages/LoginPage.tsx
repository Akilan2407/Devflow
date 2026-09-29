import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = (): ReactElement => (
  <main className="auth-page flex items-center justify-center p-4 min-h-screen">
    <div className="mx-auto w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left Branding Showcase */}
      <div className="hidden lg:flex flex-col justify-between p-8 rounded-3xl border border-surface-800 bg-gradient-to-br from-[#0F172A]/80 to-[#0B0F19]/90 backdrop-blur-xl h-full shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-md shadow-brand-500/30">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-extrabold text-xl text-white">Dev<span className="text-brand-400">Flow</span></span>
          </Link>

          <div className="mt-12">
            <span className="badge-cyan">CONTINUOUS TELEMETRY</span>
            <h2 className="mt-4 text-3xl font-extrabold text-white leading-tight">
              Enterprise Sprint Velocity & Observability.
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Connect your distributed software engineering teams with realtime WebSocket updates, sprint burndown tracking, and GitOps automation.
            </p>
          </div>
        </div>

        {/* Live Terminal Box */}
        <div className="mt-8 rounded-xl border border-surface-700 bg-[#090D16] p-4 font-mono text-xs text-slate-300 space-y-1.5 shadow-inner">
          <div className="text-slate-500 flex items-center justify-between">
            <span>// session_guard.ts</span>
            <span className="text-emerald-400">● 256-bit AES</span>
          </div>
          <p className="text-emerald-400">&gt; Authenticating multi-tenant token...</p>
          <p className="text-brand-300">&gt; Subscribing to Redis channel: org_events</p>
          <p className="text-slate-400">&gt; Ready for collaborative sprint flow</p>
        </div>

        <div className="mt-8 pt-4 border-t border-surface-800 flex items-center justify-between text-xs text-slate-500">
          <span>SOC2 Type II Compliant</span>
          <Link to="/" className="text-brand-400 hover:underline">← Back to Overview</Link>
        </div>
      </div>

      {/* Right Auth Form */}
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </div>
  </main>
);

