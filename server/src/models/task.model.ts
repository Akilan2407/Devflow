import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

export const taskTypes = ['TASK', 'FEATURE', 'BUG', 'IMPROVEMENT'] as const;
export const taskPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export const taskStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const;
export type TaskType = (typeof taskTypes)[number];
export type TaskPriority = (typeof taskPriorities)[number];
export type TaskStatus = (typeof taskStatuses)[number];

const taskSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint', default: null },
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    description: { type: String, default: '', maxlength: 10000 },
    status: { type: String, enum: taskStatuses, required: true, default: 'TODO' },
    priority: { type: String, enum: taskPriorities, required: true, default: 'MEDIUM' },
    type: { type: String, enum: taskTypes, required: true, default: 'TASK' },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    labels: { type: [String], default: [] },
    storyPoints: { type: Number, min: 0, max: 100, default: null },
    dueDate: { type: Date, default: null },
    position: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true },
);

taskSchema.index({ projectId: 1, position: 1 });
taskSchema.index({ organizationId: 1, projectId: 1, status: 1 });

export type Task = InferSchemaType<typeof taskSchema>;
export type TaskDocument = HydratedDocument<Task>;
export const TaskModel = model<Task>('Task', taskSchema);