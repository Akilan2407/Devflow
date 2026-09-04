export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskType = 'TASK' | 'FEATURE' | 'BUG' | 'IMPROVEMENT';
export type Task = {
  _id: string; organizationId: string; projectId: string; sprintId: string | null;
  title: string; description: string; status: TaskStatus; priority: TaskPriority; type: TaskType;
  assigneeId: string | { _id: string; name: string; email: string } | null;
  reporterId: string; labels: string[]; storyPoints: number | null; dueDate: string | null;
  position: number; createdAt: string; updatedAt: string;
};
export type TaskListResponse = { items: Task[]; pagination: { page: number; limit: number; total: number; pages: number } };