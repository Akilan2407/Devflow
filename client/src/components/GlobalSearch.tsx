import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '../features/search';
import type { SearchResult, SearchType } from '../types/search';
import { useAuthStore } from '../stores/auth.store';

const groups: { type: SearchType; label: string }[] = [
  { type: 'PROJECT', label: 'Projects' },
  { type: 'TASK', label: 'Tasks' },
  { type: 'ISSUE', label: 'Issues' },
  { type: 'SPRINT', label: 'Sprints' },
  { type: 'USER', label: 'People' },
  { type: 'COMMENT', label: 'Comments' },
];

const target = (result: SearchResult): string => {
  if (result.type === 'PROJECT') return `/projects/${result._id}`;
  if (result.type === 'ISSUE') return `/projects/${result.projectId ?? ''}/issues`;
  if (result.type === 'TASK' || result.type === 'SPRINT') return `/projects/${result.projectId ?? ''}`;
  if (result.type === 'COMMENT')
    return result.entityType === 'ISSUE'
      ? `/projects/${result.projectId ?? ''}/issues`
      : `/projects/${result.projectId ?? result.entityId ?? ''}`;
  return '/organizations';
};

const iconBadge: Record<SearchType, { text: string; bg: string }> = {
  PROJECT: { text: 'PRJ', bg: 'bg-brand-500/20 text-brand-400 border-brand-500/30' },
  TASK: { text: 'TSK', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  ISSUE: { text: 'ISS', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  SPRINT: { text: 'SPR', bg: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30' },
  USER: { text: 'USR', bg: 'bg-accent-indigo/20 text-accent-indigo border-accent-indigo/30' },
  COMMENT: { text: 'CMT', bg: 'bg-surface-700 text-slate-300 border-surface-600' },
};

export const GlobalSearch = (): ReactElement | null => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.accessToken);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [type, setType] = useState<SearchType | undefined>();
  const results = useGlobalSearch(value, type);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const grouped = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: (results.data?.items ?? []).filter((item) => item.type === group.type),
        }))
        .filter((group) => group.items.length),
    [results.data?.items],
  );

  if (!token) return null;

  return (
    <>
      <button
        aria-label="Search"
        className="flex items-center gap-2.5 rounded-xl border border-surface-800 bg-[#0E1522] px-3.5 py-2 text-xs text-slate-400 hover:border-brand-500/40 hover:text-slate-200 transition shadow-sm"
        type="button"
        onClick={() => setOpen(true)}
      >
        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Quick Search...</span>
        <kbd className="hidden sm:inline-flex items-center rounded-md border border-surface-700 bg-[#0A0F1A] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 p-4 sm:p-16 backdrop-blur-md animate-fadeIn"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-surface-700 bg-[#0E1522] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
          >
            <div className="flex items-center gap-3 border-b border-surface-800 px-5 bg-[#0A0F1A]">
              <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                className="h-14 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                placeholder="Search across projects, tasks, sprints, issues..."
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
              <select
                aria-label="Filter search"
                className="rounded-lg border border-surface-700 bg-[#121B2B] px-2.5 py-1 text-xs text-slate-300 outline-none"
                value={type ?? ''}
                onChange={(event) => setType((event.target.value || undefined) as SearchType | undefined)}
              >
                <option value="">All Categories</option>
                {groups.map((group) => (
                  <option key={group.type} value={group.type}>
                    {group.label}
                  </option>
                ))}
              </select>
              <kbd className="rounded border border-surface-700 bg-surface-800 px-2 py-1 text-[10px] font-mono text-slate-400">
                Esc
              </kbd>
            </div>

            <div className="max-h-[min(70vh,520px)] overflow-y-auto p-4">
              {value.trim().length < 2 ? (
                <p className="p-10 text-center text-xs text-slate-500">
                  Type at least 2 characters to trigger instant full-text search.
                </p>
              ) : results.isLoading ? (
                <p className="p-10 text-center text-xs text-slate-400 animate-pulse">
                  Querying search index...
                </p>
              ) : grouped.length ? (
                grouped.map((group) => (
                  <div className="mb-4" key={group.type}>
                    <h2 className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {group.label}
                    </h2>
                    <div className="space-y-1 mt-1">
                      {group.items.map((result) => (
                        <button
                          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-surface-800/80 hover:border-surface-700"
                          key={`${result.type}:${result._id}`}
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            setValue('');
                            navigate(target(result));
                          }}
                        >
                          <span
                            className={`grid h-8 w-10 place-items-center rounded-lg border text-[10px] font-mono font-bold ${
                              iconBadge[result.type]?.bg ?? 'bg-surface-800 text-white'
                            }`}
                          >
                            {iconBadge[result.type]?.text ?? result.type.substring(0, 3)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <strong className="block truncate text-xs font-semibold text-white">
                              {result.title}
                            </strong>
                            <small className="block truncate text-[11px] text-slate-400">
                              {result.subtitle}
                            </small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-10 text-center text-xs text-slate-500">
                  No matching entities found for "{value}".
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

