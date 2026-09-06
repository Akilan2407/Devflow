import type { NextFunction, Request, Response } from 'express';
import { organizationService } from '../services/organization.service.js';
import type { OrganizationRequest } from '../types/organization.types.js';
import { createActivityLog } from '../services/activity-log.service.js';
import {
  createOrganizationSchema,
  memberInviteSchema,
  memberRoleSchema,
  updateOrganizationSchema,
} from '../validators/organization.validators.js';

const requiredParam = (value: string | string[] | undefined): string => {
  if (typeof value !== 'string') throw new Error('Invalid route parameter');
  return value;
};

export const createOrganization = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organizationRequest = request as unknown as OrganizationRequest;
    const organization = await organizationService.create(
      organizationRequest.user._id.toString(),
      createOrganizationSchema.parse(request.body),
    );
    response.status(201).json({ data: organization });
  } catch (error) {
    next(error);
  }
};

export const listOrganizations = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organizationRequest = request as unknown as OrganizationRequest;
    response.json({
      data: await organizationService.listForUser(organizationRequest.user._id.toString()),
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganization = (request: Request, response: Response): void => {
  response.json({ data: (request as unknown as OrganizationRequest).organization });
};

export const updateOrganization = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organizationRequest = request as unknown as OrganizationRequest;
    const organization = await organizationService.update(
      organizationRequest.organization,
      updateOrganizationSchema.parse(request.body),
    );
    response.json({ data: organization });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await organizationService.delete((request as unknown as OrganizationRequest).organization);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organizationRequest = request as unknown as OrganizationRequest;
    const input = memberInviteSchema.parse(request.body);
    await organizationService.invite(
      organizationRequest.organization._id.toString(),
      input,
    );
    await createActivityLog({ organizationId: organizationRequest.organization._id.toString(), userId: organizationRequest.user._id.toString(), action: 'MEMBER_ADDED', entityType: 'ORGANIZATION', entityId: organizationRequest.organization._id.toString(), description: `Member with email ${input.email} added`, metadata: { role: input.role } });
    response.status(201).json({ data: { message: 'Member added' } });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const value = request as unknown as OrganizationRequest; const memberId = requiredParam(request.params.userId);
    await organizationService.remove(value.organization, memberId);
    await createActivityLog({ organizationId: value.organization._id.toString(), userId: value.user._id.toString(), action: 'MEMBER_REMOVED', entityType: 'ORGANIZATION', entityId: value.organization._id.toString(), description: 'Organization member removed', metadata: { memberId } });
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const changeMemberRole = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { role } = memberRoleSchema.parse(request.body);
    const value = request as unknown as OrganizationRequest; const memberId = requiredParam(request.params.userId);
    await organizationService.changeRole(value.organization, memberId, role);
    await createActivityLog({ organizationId: value.organization._id.toString(), userId: value.user._id.toString(), action: 'ROLE_CHANGED', entityType: 'ORGANIZATION_MEMBER', entityId: memberId, description: 'Organization member role changed', metadata: { memberId, role } });
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    response.json({
      data: await organizationService.members(
        (request as unknown as OrganizationRequest).organization._id.toString(),
      ),
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationId = (request: Request): string => requiredParam(request.params.id);
