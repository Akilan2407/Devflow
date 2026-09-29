import type { ReactElement } from 'react';
import type { Task } from '../types/task';

const priorityBadges: Record<string, string> = {
  URGENT: 'badge-rose',
  HIGH: 'badge-amber',
  MEDIUM: 'badge-cyan',
  LOW: 'badge-slate',
};

export const TaskCard = ({
  task,
  onSelect,
  draggable = false,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  onSelect: () => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}): ReactElement => (
  <button
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    className="group w-full cursor-grab rounded-xl border border-surface-800 bg-[#121B2B] p-4 text-left transition-all duration-200 hover:border-brand-500/50 hover:bg-[#16233B] hover:shadow-lg hover:shadow-brand-500/10 active:cursor-grabbing"
    onClick={onSelect}
  >
    <div className="flex items-start justify-between gap-2">
      <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-brand-300 transition-colors line-clamp-2">
        {task.title}
      </h3>
      <span className={priorityBadges[task.priority] || 'badge-slate'}>
        {task.priority}
      </span>
    </div>

    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-400">
      <span className="font-semibold text-brand-400">{task.type}</span>
      <span>•</span>
      <span className="capitalize text-slate-500">{task.status.replace('_', ' ').toLowerCase()}</span>
    </div>

    {task.description && (
      <p className="mt-2.5 line-clamp-2 text-xs text-slate-400 leading-relaxed">
        {task.description}
      </p>
    )}

    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-800/60">
      <div className="flex flex-wrap gap-1">
        {task.labels.map((label) => (
          <span
            className="rounded bg-surface-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono"
            key={label}
          >
            #{label}
          </span>
        ))}
      </div>
      {task.storyPoints !== null && (
        <span className="rounded bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-brand-300">
          {task.storyPoints} pts
        </span>
      )}
    </div>
  </button>
);