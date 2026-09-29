import type { ReactElement } from 'react';
import { useState } from 'react';
import { IssueDetails } from '../components/IssueDetails';
import { IssueFilters } from '../components/IssueFilters';
import { IssueForm } from '../components/IssueForm';
import { IssueList } from '../components/IssueList';
import { useIssues, type IssueFilters as FilterValues } from '../features/issues';
import type { Issue } from '../types/issue';
import { useParams, Link } from 'react-router-dom';
import { useProjectRealtime } from '../hooks/useProjectRealtime';

export const ProjectIssuesPage = (): ReactElement => {
  const { projectId } = useParams();
  useProjectRealtime(projectId);
  const [filters, setFilters] = useState<FilterValues>({});
  const [selected, setSelected] = useState<Issue>();
  const issues = useIssues(projectId, filters);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-surface-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold mb-2">
            <Link className="text-brand-400 hover:text-brand-300" to={`/projects/${projectId}`}>
              ← Project Board
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-mono">Triage</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Issue Tracker & Bug Triage
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Submit, prioritize, filter, and resolve defects and user feedback tickets.
          </p>
        </div>
      </div>

      {projectId && (
        <div className="glass-panel p-6">
          <IssueForm projectId={projectId} onSaved={(issue) => setSelected(issue)} />
        </div>
      )}

      <div className="glass-panel p-4">
        <IssueFilters filters={filters} onChange={setFilters} />
      </div>

      {issues.isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="glass-panel h-96 animate-pulse" />
          <div className="glass-panel h-96 animate-pulse" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="glass-panel p-4 overflow-hidden">
            <IssueList issues={issues.data?.items ?? []} onSelect={setSelected} />
          </div>
          <div>
            {selected ? (
              <div className="glass-panel p-6">
                <IssueDetails
                  issue={selected}
                  onDeleted={() => {
                    setSelected(undefined);
                    void issues.refetch();
                  }}
                />
              </div>
            ) : (
              <div className="glass-panel p-8 text-center text-xs text-slate-500">
                Select an issue from the list to view telemetry details, reproduction steps, and discussions.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};