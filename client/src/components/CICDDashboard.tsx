import type { ReactElement } from 'react';
import { useState } from 'react';
import { useCIRun, useCIRuns, useCIWorkflows, useRepository } from '../features/github';
import type { GithubWorkflowRun } from '../types/github';
import { WorkflowDetails } from './WorkflowDetails';
import { WorkflowList } from './WorkflowList';

const latestFor = (runs: GithubWorkflowRun[], matcher: RegExp): GithubWorkflowRun | undefined => runs.find((run) => matcher.test(run.name ?? ''));
const statusText = (run: GithubWorkflowRun | undefined): string => run ? `${run.status === 'in_progress' ? 'IN_PROGRESS' : run.status.toUpperCase()}${run.conclusion ? ` · ${run.conclusion.toUpperCase()}` : ''}` : 'No matching workflow';

export const CICDDashboard = ({ projectId }: { projectId: string }): ReactElement => {
  const repository = useRepository(projectId);
  const enabled = Boolean(repository.data);
  const workflows = useCIWorkflows(projectId, enabled);
  const runs = useCIRuns(projectId, enabled);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useCIRun(projectId, selectedId);
  const allRuns = runs.data ?? [];
  const completed = allRuns.filter((run) => run.status === 'completed' && run.conclusion);
  const successPercentage = completed.length ? Math.round((completed.filter((run) => run.conclusion === 'success').length / completed.length) * 100) : null;
  const build = latestFor(allRuns, /build|compile|ci/i);
  const test = latestFor(allRuns, /test|check|quality/i);
  const deployment = latestFor(allRuns, /deploy|release|publish/i);
  return <section className="mx-auto max-w-5xl space-y-6 rounded-xl bg-white p-6 shadow-sm"><div><p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">GitHub Actions</p><h2 className="mt-1 text-2xl font-bold">CI/CD monitoring</h2><p className="mt-2 text-sm text-slate-500">Live workflow data from the connected repository.</p></div>{!enabled ? <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Connect a GitHub repository to monitor CI/CD.</p> : <><div className="grid gap-3 sm:grid-cols-4">{[['Build status', build], ['Test status', test], ['Deployment status', deployment]].map(([label, run]) => <div className="rounded-xl border border-slate-200 p-4" key={label as string}><p className="text-sm text-slate-500">{label as string}</p><p className="mt-2 font-bold">{statusText(run as GithubWorkflowRun | undefined)}</p></div>)}<div className="rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-500">Success percentage</p><p className="mt-2 text-2xl font-bold">{successPercentage === null ? 'No completed runs' : `${successPercentage}%`}</p></div></div><div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]"><WorkflowList workflows={workflows.data ?? []} runs={allRuns} selectedId={selectedId} onSelect={setSelectedId} /><WorkflowDetails run={selected.data ?? (selectedId === null ? allRuns[0] : undefined)} /></div></>}</section>;
};