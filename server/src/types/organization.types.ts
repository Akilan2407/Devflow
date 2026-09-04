import type { OrganizationRole, Permission } from '../utils/permissions.js';
import type { AuthenticatedRequest } from './auth.types.js';
import type { OrganizationDocument } from '../models/organization.model.js';
import type { OrganizationMemberDocument } from '../models/organization-member.model.js';

export type OrganizationRequest = AuthenticatedRequest & {
  organization: OrganizationDocument;
  membership: OrganizationMemberDocument;
};

export type OrganizationPermission = Permission;
export type OrganizationRoleName = OrganizationRole;
