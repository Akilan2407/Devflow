export const organizationRoles = [
  'SUPER_ADMIN',
  'ORGANIZATION_ADMIN',
  'PROJECT_MANAGER',
  'DEVELOPER',
  'TESTER',
  'VIEWER',
] as const;

export type OrganizationRole = (typeof organizationRoles)[number];

export const permissions = [
  'organization:create',
  'organization:read',
  'organization:update',
  'organization:delete',
  'member:invite',
  'member:remove',
  'member:updateRole',
  'project:create',
  'project:read',
  'project:update',
  'project:delete',
  'task:create',
  'task:read',
  'task:update',
  'task:delete',
  'issue:create',
  'issue:read',
  'issue:update',
  'issue:delete',
  'sprint:create',
  'sprint:read',
  'sprint:update',
  'sprint:delete',
  'analytics:read',
] as const;

export type Permission = (typeof permissions)[number];

const admin = new Set<Permission>(permissions);
const manager = new Set<Permission>([
  'organization:read',
  'member:invite',
  'member:remove',
  'member:updateRole',
  'project:create',
  'project:read',
  'project:update',
  'project:delete',
  'task:create',
  'task:read',
  'task:update',
  'task:delete',
  'issue:create',
  'issue:read',
  'issue:update',
  'issue:delete',
  'sprint:create',
  'sprint:read',
  'sprint:update',
  'sprint:delete',
  'analytics:read',
]);

const rolePermissions: Record<OrganizationRole, Set<Permission>> = {
  SUPER_ADMIN: admin,
  ORGANIZATION_ADMIN: admin,
  PROJECT_MANAGER: manager,
  DEVELOPER: new Set([
    'organization:read',
    'project:read',
    'project:update',
    'task:create',
    'task:read',
    'task:update',
    'issue:create',
    'issue:read',
    'issue:update',
    'sprint:read',
  ]),
  TESTER: new Set([
    'organization:read',
    'project:read',
    'task:read',
    'issue:create',
    'issue:read',
    'issue:update',
    'sprint:read',
  ]),
  VIEWER: new Set([
    'organization:read',
    'project:read',
    'task:read',
    'issue:read',
    'sprint:read',
    'analytics:read',
  ]),
};

export const roleHasPermission = (role: OrganizationRole, permission: Permission): boolean =>
  rolePermissions[role].has(permission);
