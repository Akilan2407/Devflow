import type { ReactElement } from 'react';
import { useState } from 'react';
import { IssueDetails } from '../components/IssueDetails';
import { IssueFilters } from '../components/IssueFilters';
import { IssueForm } from '../components/IssueForm';
import { IssueList } from '../components/IssueList';
import { useIssues, type IssueFilters as FilterValues } from '../features/issues';
import type { Issue } from '../types/issue';
import { useParams } from 'react-router-dom';
import { useProjectRealtime } from '../hooks/useProjectRealtime';

export const ProjectIssuesPage = (): ReactElement => { const { projectId } = useParams(); useProjectRealtime(projectId); const [filters, setFilters] = useState<FilterValues>({}); const [selected, setSelected] = useState<Issue>(); const issues = useIssues(projectId, filters); return <main className="min-h-screen bg-slate-100 p-6 text-slate-900"><div className="mx-auto max-w-6xl space-y-6"><header><p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">Project workspace</p><h1 className="text-3xl font-bold">Issues</h1></header>{projectId && <IssueForm projectId={projectId} onSaved={(issue) => setSelected(issue)} />}<IssueFilters filters={filters} onChange={setFilters} />{issues.isLoading ? <p>Loading issues...</p> : <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><IssueList issues={issues.data?.items ?? []} onSelect={setSelected} />{selected && <IssueDetails issue={selected} onDeleted={() => { setSelected(undefined); void issues.refetch(); }} />}</div>}</div></main>; };