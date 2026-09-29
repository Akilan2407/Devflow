import { useState, type ReactElement } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSprints } from '../features/sprints';
import { useProjectAnalytics, useSprintAnalytics, useTeamAnalytics } from '../features/analytics';
import type { AnalyticsFilters } from '../types/analytics';

const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#64748b'];

const Card = ({
  title,
  value,
  detail,
  accentColor = 'text-white',
}: {
  title: string;
  value: string | number;
  detail?: string;
  accentColor?: string;
}): ReactElement => (
  <article className="rounded-2xl border border-surface-800 bg-[#0E1522] p-5 shadow-sm transition hover:border-surface-700">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
    <strong className={`mt-2 block text-3xl font-extrabold tracking-tight ${accentColor}`}>
      {value}
    </strong>
    {detail && <p className="mt-1 text-xs text-slate-400 font-mono">{detail}</p>}
  </article>
);

const ChartPanel = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactElement;
}): ReactElement => (
  <section className="rounded-2xl border border-surface-800 bg-[#0E1522] p-5 shadow-sm">
    <div className="mb-4">
      <h3 className="font-bold text-white text-sm">{title}</h3>
      {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
    </div>
    <div className="h-64">{children}</div>
  </section>
);

export const AnalyticsDashboard = ({ projectId }: { projectId: string }): ReactElement => {
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  const project = useProjectAnalytics(projectId, filters);
  const sprints = useSprintAnalytics(projectId, filters);
  const team = useTeamAnalytics(projectId, filters);
  const availableSprints = useSprints(projectId);
  const data = project.data;

  const update = (key: keyof AnalyticsFilters, value: string) =>
    setFilters((current) => ({ ...current, [key]: value || undefined }));

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-cyan">PROJECT INTELLIGENCE</span>
            <span className="text-xs font-mono text-slate-500">Telemetry v3</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white">Engineering Velocity & Observability</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Real-time analytics on burndown velocity, developer throughput, and issue distribution.
          </p>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 rounded-2xl border border-surface-800 bg-[#0A0F1A] p-4">
        <label className="text-xs font-semibold text-slate-400">
          From
          <input
            className="input mt-1 max-w-44 py-1.5 text-xs"
            type="date"
            value={filters.from ?? ''}
            onChange={(event) => update('from', event.target.value)}
          />
        </label>
        <label className="text-xs font-semibold text-slate-400">
          To
          <input
            className="input mt-1 max-w-44 py-1.5 text-xs"
            type="date"
            value={filters.to ?? ''}
            onChange={(event) => update('to', event.target.value)}
          />
        </label>
        <label className="text-xs font-semibold text-slate-400">
          Sprint
          <select
            className="input mt-1 max-w-52 py-1.5 text-xs text-brand-300 font-medium"
            value={filters.sprintId ?? ''}
            onChange={(event) => update('sprintId', event.target.value)}
          >
            <option value="">All sprints</option>
            {(availableSprints.data ?? []).map((sprint) => (
              <option key={sprint._id} value={sprint._id}>
                {sprint.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-400">
          Developer
          <select
            className="input mt-1 max-w-52 py-1.5 text-xs text-brand-300 font-medium"
            value={filters.developerId ?? ''}
            onChange={(event) => update('developerId', event.target.value)}
          >
            <option value="">All squad engineers</option>
            {(team.data ?? []).map((member) => (
              <option key={member._id} value={member._id}>
                {member.name ?? member.email ?? member._id}
              </option>
            ))}
          </select>
        </label>
      </div>

      {data && (
        <>
          {/* Key Metric Counters */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Total Tasks" value={data.totalTasks} accentColor="text-white" />
            <Card
              title="Completed Tasks"
              value={data.completedTasks}
              detail={`${data.taskCompletionPercentage}% completion rate`}
              accentColor="text-emerald-400"
            />
            <Card
              title="Open Issues"
              value={data.openIssues}
              accentColor={data.openIssues > 0 ? 'text-amber-400' : 'text-slate-300'}
            />
            <Card
              title="Story Points Delivered"
              value={data.storyPointsCompleted}
              detail={`${data.storyPointsRemaining} pts in backlog`}
              accentColor="text-brand-400"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartPanel title="Task Status Breakdown" subtitle="Distribution across board columns">
              <ResponsiveContainer>
                <BarChart data={data.taskStatuses.map((item) => ({ name: item._id, count: item.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: 8 }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Issue Severity Distribution" subtitle="Active bugs & triage categories">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.issueDistribution.map((item) => ({ name: item._id, value: item.count }))}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={85}
                    label
                  >
                    {data.issueDistribution.map((item, index) => (
                      <Cell fill={colors[index % colors.length]} key={item._id} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Sprint Velocity Trend" subtitle="Story points delivered per sprint">
              <ResponsiveContainer>
                <BarChart
                  data={(sprints.data?.items ?? []).map((item) => ({
                    name: item.name,
                    velocity: item.velocity,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: 8 }}
                  />
                  <Bar dataKey="velocity" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Sprint Burndown Trajectory" subtitle="Remaining story points over time">
              <ResponsiveContainer>
                <LineChart
                  data={(sprints.data?.items ?? []).map((item) => ({
                    name: item.name,
                    remaining: Math.max(item.storyPointsTotal - item.storyPointsCompleted, 0),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="remaining" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Squad Workload Allocation" subtitle="Active tasks vs completed per engineer">
              <ResponsiveContainer>
                <BarChart
                  data={(team.data ?? []).map((item) => ({
                    name: item.name ?? item.email ?? 'Unassigned',
                    tasks: item.tasks,
                    completed: item.completed,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: 8 }}
                  />
                  <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Engineering Activity Frequency" subtitle="Commit and task transaction volume">
              <ResponsiveContainer>
                <LineChart
                  data={data.activityTrends.map((item) => ({
                    date: item._id,
                    activity: item.count,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="activity" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
        </>
      )}
    </section>
  );
};

