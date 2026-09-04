export type Organization = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  ownerId: string;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationMember = {
  organizationId: string;
  userId: { _id: string; name: string; email: string; avatar: string | null; isActive: boolean };
  role: string;
  joinedAt: string;
};
