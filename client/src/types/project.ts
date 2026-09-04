export const projectStatuses = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export type ProjectMember = string | { _id: string; name: string; email: string; avatar?: string | null };
export type Project = {
  _id: string;
  organizationId: string;
  name: string;
  key: string;
  description: string;
  ownerId: string | { _id: string; name: string; email: string };
  members: ProjectMember[];
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectListResponse = {
  items: Project[];
  pagination: { page: number; limit: number; total: number; pages: number };
};